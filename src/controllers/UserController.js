import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Cria um novo usuário no sistema
 * Realiza validações de senha e email
 * Verifica existência de usuário
 * Criptografa a senha antes de salvar
 */

async function userCreate(req, res) {
  try {
    const { adm, name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    // Password validation regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const usuario = await prisma.user.create({
      data: {
        isAdmin: Boolean(adm),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password_hash,
        profileImage: null,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = usuario;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      error: "Internal server error while creating user",
    });
  }
}

/**
 * Busca um usuário específico pelo ID
 * Inclui todos os posts do usuário com seus comentários
 * Inclui todos os comentários feitos pelo usuário
 * Remove a senha dos dados retornados
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      include: {
        posts: {
          include: {
            comments: true,
            biome: true,
          },
        },
        comments: {
          include: {
            post: true,
            replies: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      error: "Internal server error while fetching user details",
    });
  }
}

/**
 * Lista todos os usuários do sistema
 * Inclui posts e comentários de cada usuário
 * Inclui informações dos biomas relacionados aos posts
 * Remove as senhas de todos os usuários
 */
async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: {
          include: {
            comments: true,
            biome: true,
          },
        },
        comments: {
          include: {
            post: true,
            replies: true,
          },
        },
      },
    });

    // Remove password from all users
    const usersWithoutPasswords = users.map((user) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching users" });
  }
}

/**
 * Atualiza dados de um usuário específico
 * Permite atualização parcial (apenas campos fornecidos)
 * Valida novo email e senha se fornecidos
 * Mantém dados existentes se não fornecidos novos
 * Criptografa nova senha se fornecida
 */
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password, adm } = req.body;

    // Verifica se usuário existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Objeto para armazenar apenas os campos que serão atualizados
    let updateData = {};

    // Atualiza nome se fornecido, removendo espaços extras
    if (name) updateData.name = name.trim();

    // Validação e atualização de email
    if (email) {
      // Valida formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Formato de email inválido" });
      }

      // Verifica se email já está em uso por outro usuário
      const existingUser = await prisma.user.findUnique({
        where: { email, NOT: { id } },
      });

      if (existingUser) {
        return res.status(409).json({ error: "Email já está em uso" });
      }

      updateData.email = email.toLowerCase().trim();
    }

    // Validação e atualização de senha
    if (password) {
      // Valida força da senha
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
        });
      }

      // Criptografa nova senha
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(password, salt);
    }

    // Atualiza status de administrador se fornecido
    if (adm !== undefined) updateData.isAdmin = Boolean(adm);

    // Realiza a atualização no banco de dados
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Remove senha dos dados retornados
    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor ao atualizar usuário" });
  }
}

/**
 * Remove um usuário do sistema
 * Verifica existência do usuário antes de remover
 * Remove usuário e todos os dados relacionados (cascade)
 */
async function userDelete(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while deleting user" });
  }
}

/**
 * Atualiza a imagem de perfil do usuário
 * Recebe o arquivo de imagem via upload
 * Verifica existência do usuário
 * Atualiza o caminho da imagem no banco de dados
 */
async function setImgProfile(req, res) {
  try {
    const { filename, path } = req.file;
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        profileImage: filename,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao atualizar imagem de perfil:", error);
    return res.status(500).json({
      error: "Erro interno do servidor ao atualizar imagem de perfil",
    });
  }
}

// Don't forget to add it to the exports
export const userController = {
  userCreate,
  getUserById,
  getAllUsers,
  updateUser,
  userDelete,
  setImgProfile, // Add this line
};
