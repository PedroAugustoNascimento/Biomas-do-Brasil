import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createImage(req, res) {
  try {
    const { description, biomeId } = req.body;

    const { filename, path } = req.file;

      const biomeExists = await prisma.biome.findUnique({
        where: { id: biomeId },
     });

     if (!biomeExists) {
       return res.status(404).json({ error: "Bioma não encontrado" });
      }
   
    const biomeImage = await prisma.biomeImage.create({
      data: { url: filename, description, biomeId },
    });

    return res.status(201).json(biomeImage);
  } catch (error) {
    console.error("Erro ao criar imagem:", error);
    return res.status(500).json({ error: "Erro ao criar imagem" });
  }
}

async function listImages(req, res) {
  try {
    const images = await prisma.biomeImage.findMany({
      include: { biome: true },
    });
    return res.status(200).json(images);
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    return res.status(500).json({ error: "Erro ao listar imagens" });
  }
}

async function getImage(req, res) {
  try {
    const { id } = req.params;  // Changed from req.body to req.params

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    const image = await prisma.biomeImage.findUnique({
      where: { id },
      include: { biome: true },
    });

    if (!image) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    return res.status(200).json(image);
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    return res.status(500).json({ error: "Erro ao buscar imagem" });
  }
}

async function updateImage(req, res) {
  try {
    const { id, url, description, biomeId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    const imageExists = await prisma.biomeImage.findUnique({
      where: { id },
    });

    if (!imageExists) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    if (biomeId) {
      const biomeExists = await prisma.biome.findUnique({
        where: { id: biomeId },
      });

      if (!biomeExists) {
        return res.status(404).json({ error: "Bioma não encontrado" });
      }
    }

    const updatedImage = await prisma.biomeImage.update({
      where: { id },
      data: { url, description, biomeId },
    });

    return res.status(200).json(updatedImage);
  } catch (error) {
    console.error("Erro ao atualizar imagem:", error);
    return res.status(500).json({ error: "Erro ao atualizar imagem" });
  }
}

async function deleteImage(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    const imageExists = await prisma.biomeImage.findUnique({
      where: { id },
    });

    if (!imageExists) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    await prisma.biomeImage.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    return res.status(500).json({ error: "Erro ao deletar imagem" });
  }
}

export const imageBiomeController = {
  createImage,
  listImages,
  getImage,
  updateImage,
  deleteImage,
};
