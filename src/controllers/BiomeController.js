import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function create(req, res) {
  try {
    const {
      name,
      introduction,
      generalCharacteristics,
      naturalResources,
      environmentalProblems,
      conservation,
    } = req.body;

    // Validações básicas
    if (
      !name ||
      !introduction ||
      !generalCharacteristics ||
      !naturalResources ||
      !environmentalProblems ||
      !conservation
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    // Verifica se já existe um bioma com o mesmo nome
    const existingBiome = await prisma.biome.findUnique({
      where: { name },
    });

    if (existingBiome) {
      return res
        .status(400)
        .json({ error: "Já existe um bioma com este nome" });
    }

    // Cria o bioma
    const biome = await prisma.biome.create({
      data: {
        name,
        introduction,
        generalCharacteristics,
        naturalResources,
        environmentalProblems,
        conservation,
      },
    });

    return res.status(201).json(biome);
  } catch (error) {
    console.error("Erro ao criar bioma:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getBiomes(req, res) {
  try {
    const biomes = await prisma.biome.findMany({
      include: {
        images: true,
        posts: true,
      },
    });

    return res.status(200).json(biomes);
  } catch (error) {
    console.error("Erro ao recuperar os biomas:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getBiome(req, res) {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ error: "ID do bioma é obrigatório" });
    }

    const biome = await prisma.biome.findUnique({
      where: { name },
      include: {
        images: true,
        posts: {
          include: {
            comments: {
              include: {
                author: true,
                replies: {
                  include: {
                    author: true
                  }
                }
              }
            },
            author: true
          }
        }
      },
    });

    if (!biome) {
      return res.status(404).json({ error: "Bioma não encontrado" });
    }

    return res.status(200).json(biome);
  } catch (error) {
    console.error("Erro ao recuperar o bioma:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function deleteBioma(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do bioma é obrigatório" });
    }

    const biomeExists = await prisma.biome.findUnique({
      where: { id },
    });

    if (!biomeExists) {
      return res.status(404).json({ error: "Bioma não encontrado" });
    }

    await prisma.biome.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar o bioma:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function updateBioma(req, res) {
  try {
    const {
      id,
      name,
      introduction,
      generalCharacteristics,
      naturalResources,
      environmentalProblems,
      conservation,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do bioma é obrigatório" });
    }

    // Verifica se o bioma existe
    const biomeExists = await prisma.biome.findUnique({
      where: { id },
    });

    if (!biomeExists) {
      return res.status(404).json({ error: "Bioma não encontrado" });
    }

    // Verifica se o novo nome já existe (se estiver sendo atualizado)
    if (name && name !== biomeExists.name) {
      const nameExists = await prisma.biome.findUnique({
        where: { name },
      });

      if (nameExists) {
        return res
          .status(400)
          .json({ error: "Já existe um bioma com este nome" });
      }
    }

    const biome = await prisma.biome.update({
      where: { id },
      data: {
        name,
        introduction,
        generalCharacteristics,
        naturalResources,
        environmentalProblems,
        conservation,
      },
    });

    return res.status(200).json(biome);
  } catch (error) {
    console.error("Erro ao atualizar o bioma:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function getBiomeByName(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nome do bioma é obrigatório" });
    }

    const biome = await prisma.biome.findFirst({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        images: true,
        posts: true,
      },
    });

    if (!biome) {
      return res.status(404).json({ error: "Bioma não encontrado" });
    }

    return res.status(200).json(biome);
  } catch (error) {
    console.error("Erro ao buscar bioma por nome:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export const biomeController = {
  create,
  getBiomes,
  getBiome,
  deleteBioma,
  updateBioma,
  getBiomeByName,
};
