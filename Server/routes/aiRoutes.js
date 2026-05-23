import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  careerGuidance,
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
  generateCoverLetter,
  optimizeLinkedInProfile,
  generateInterviewQuestions,
  matchJobDescription,
} from "../controllers/aiController.js";
import { checkFeatureAccess } from "../middlewares/subscriptionMiddleware.js";

const aiRouter = express.Router();

// Basic AI features
aiRouter.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhance-job-des", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.post("/career-guidance", protect, careerGuidance);

// Advanced AI features (require subscription features to be enabled)
aiRouter.post(
  "/generate-cover-letter",
  protect,
  checkFeatureAccess("aiScore"),
  generateCoverLetter
);
aiRouter.post(
  "/optimize-linkedin",
  protect,
  checkFeatureAccess("aiScore"),
  optimizeLinkedInProfile
);
aiRouter.post(
  "/generate-interview-questions",
  protect,
  checkFeatureAccess("aiInterviewPrep"),
  generateInterviewQuestions
);
aiRouter.post(
  "/match-job-description",
  protect,
  checkFeatureAccess("aiScore"),
  matchJobDescription
);

export default aiRouter;
