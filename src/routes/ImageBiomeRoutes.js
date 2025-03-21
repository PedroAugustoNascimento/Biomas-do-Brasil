import { Router } from "express";
import { imageBiomeController } from "../controllers/BiomeImageController.js";
import multer from "multer";
import multerConfig from "../config/multer.js";

const upload = multer(multerConfig);
const routerImageBiome = Router();

routerImageBiome.post("/createImage", upload.single('file'),imageBiomeController.createImage);
routerImageBiome.post("/imageslist", imageBiomeController.listImages);
routerImageBiome.get("/image/:id", imageBiomeController.getImage);
routerImageBiome.post("/imageupdate",upload.single('file'), imageBiomeController.updateImage);
routerImageBiome.post("/imagedelete", imageBiomeController.deleteImage);

export default routerImageBiome;
