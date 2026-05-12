import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { careerGuidance } from "../controllers/aiController.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-des", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.post("/career-guidance", protect, careerGuidance);

export default aiRouter;
