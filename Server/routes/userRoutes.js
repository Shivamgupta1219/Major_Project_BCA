import {
  getUserById,
  getUsersResumes,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import express from "express";
import { createResume } from "../controllers/resumeController.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUsersResumes);
userRouter.post("/create-resume", protect, createResume);
export default userRouter;
