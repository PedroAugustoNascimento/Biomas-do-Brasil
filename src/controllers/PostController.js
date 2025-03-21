import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Lista todos os posts com seus comentários
 */
async function getAllPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        biome: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return res.status(500).json({ error: "Erro interno ao buscar posts" });
  }
}

/**
 * Busca um post específico pelo ID
 */
async function getPostById(req, res) {
  try {
    const { id } = req.params;  // Changed from req.body to req.params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        biome: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return res.status(500).json({ error: "Erro interno ao buscar post" });
  }
}

async function getPostsByBiomeId(req, res) {
  try {
    const { biomeId } = req.params;  // biomeId é uma string (UUID)

    // Busca todos os posts que pertencem ao bioma com o ID especificado
    const posts = await prisma.post.findMany({
      where: { biomeId: biomeId },  // biomeId é uma string, não precisa de parseInt
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        biome: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: "Nenhum post encontrado para este bioma" });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts por biomeId:", error);
    return res.status(500).json({ error: "Erro interno ao buscar posts" });
  }
}
/**
 * Cria um novo post
 */
async function createPost(req, res) {
  try {
    const { title, content, biomeId, authorId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
    }

    // Validate biomeId if provided
    if (biomeId) {
      const biomeExists = await prisma.biome.findUnique({
        where: { id: biomeId }
      });
      
      if (!biomeExists) {
        return res.status(404).json({ error: "Bioma não encontrado" });
      }
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorId,
        biomeId: biomeId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          }
        },
        biome: true
      }
    });


    return res.status(201).json(post);
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return res.status(500).json({ error: "Erro interno ao criar post" });
  }
}

/**
 * Atualiza um post existente
 */
async function updatePost(req, res) {
  try {
    const { id, userId, title, content, biomeId } = req.body;

    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    if (existingPost.authorId !== userId) {
      return res.status(403).json({ error: "Sem permissão para atualizar este post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title?.trim(),
        content: content?.trim(),
        biomeId: biomeId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          }
        },
        biome: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              }
            }
          }
        }
      }
    });

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return res.status(500).json({ error: "Erro interno ao atualizar post" });
  }
}

/**
 * Remove um post
 */
async function deletePost(req, res) {
  try {
    const { id, userId } = req.body; // Get both post id and user id from params

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ error: "Sem permissão para deletar este post" });
    }

    await prisma.post.delete({
      where: { id }
    });

    return res.status(200).json({ message: "Post deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    return res.status(500).json({ error: "Erro interno ao deletar post" });
  }
}

export const postController = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByBiomeId
};