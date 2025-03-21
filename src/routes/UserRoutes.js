import { Router } from "express";
import { userController } from "../controllers/UserController.js";
import multer from "multer";
import multerConfig from "../config/multer.js";

const upload = multer(multerConfig);
const userRoutes = Router();

// GET ALL USERS
userRoutes.get("/users", userController.getAllUsers);

// GET USER
userRoutes.get("/user/:id", userController.getUserById);

// CREATE USER
userRoutes.post("/usercreate", userController.userCreate);

// UPDATE USER
userRoutes.put("/userupdate/", userController.updateUser);

// SET PROFILE IMAGE
userRoutes.put("/userimage/:id", upload.single('file'), userController.setImgProfile);

// DELETE USER
userRoutes.delete("/user/", userController.userDelete);



export default userRoutes;