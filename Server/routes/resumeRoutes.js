import express from "express";
import {
  createResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
  deleteResume,
  getUserResumes,
} from "../controllers/resumeController.js";
import upload from "../configs/multer.js";
import protect from "../middlewares/authMiddleware.js";
const resumeRouter = express.Router();

// GET ALL USERS RESUMES
resumeRouter.get("/", protect, getUserResumes);
// create
resumeRouter.post("/create", protect, createResume);
// DELETE RESUME
resumeRouter.delete("/:resumeId", protect, deleteResume);
// PUBLIC RESUME
resumeRouter.get("/public/:resumeId", getPublicResumeById);
// get single resume private
resumeRouter.get("/:resumeId", protect, getResumeById);
// UPDATE RESUME
resumeRouter.put("/:resumeId", protect, updateResume);
export default resumeRouter;
