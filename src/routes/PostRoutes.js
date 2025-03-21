import { Router } from "express";
import { postController } from "../controllers/PostController.js";

const postRoutes = Router();

// Public routes
postRoutes.get("/posts", postController.getAllPosts);
postRoutes.get("/post/:id", postController.getPostById);
postRoutes.get("/posts/:biomeId",postController.getPostsByBiomeId);

// Protected routes - require authentication
postRoutes.post("/postcreate/", postController.createPost);
postRoutes.put("/postupdate", postController.updatePost);
postRoutes.delete("/postdelete", postController.deletePost);

export default postRoutes;