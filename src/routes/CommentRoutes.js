import { Router } from "express";
import { commentController } from "../controllers/CommentController.js";

const commentRoutes = Router();

// Get all comments for a post
commentRoutes.get("/coments/", commentController.getPostComments);

// Create a new comment
commentRoutes.post("/commentcreate", commentController.createComment);

// Update a comment
commentRoutes.put("/comment", commentController.updateComment);

// Delete a comment
commentRoutes.delete("/comment/", commentController.deleteComment);

export default commentRoutes;