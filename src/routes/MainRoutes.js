import { Router } from "express";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import commentRoutes from "./CommentRoutes.js";
import biomeRoutes from "./BiomeRoutes.js";
import routerImageBiome from "./ImageBiomeRoutes.js";

const routes = Router();

routes.use(userRoutes);
routes.use(postRoutes);
routes.use(commentRoutes);
routes.use(biomeRoutes);
routes.use(routerImageBiome)

routes.get("/", (req, res) => {
  res.json({ message: "API de Biomas Brasileiros" });
});


export default routes;
