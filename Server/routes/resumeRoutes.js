import express from "express";
import {
  createResume,
  getPublicResumeById,
  getResumeById,
  updateResume,
  deleteResume,
  getUserResumes,
  computeResumeScore,
  getAdminFeedback,
  submitAdminFeedback,
  markResumeImproved,
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
// COMPUTE RESUME SCORE
resumeRouter.post("/:resumeId/score", protect, computeResumeScore);

// SUBMIT FOR REVIEW
resumeRouter.post("/:resumeId/submit-review", protect, async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { facultyId } = req.body;

    if (!facultyId) {
      return res.status(400).json({ message: "Faculty ID required" });
    }

    const resume = await import("../models/Resume.js").then(m => m.default);
    const Review = await import("../models/Review.js").then(m => m.default);

    const r = await resume.findOne({ _id: resumeId, userId: req.userId });
    if (!r) return res.status(404).json({ message: "Resume not found" });

    // Create review entry
    const review = await Review.create({
      resumeId,
      studentId: req.userId,
      facultyId,
      collegeId: req.user.collegeId,
      status: "pending",
    });

    // Update resume status
    r.reviewStatus = "submitted";
    r.submittedAt = new Date();
    await r.save();

    res.json({ review, resume: r, message: "Resume submitted for review" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN FEEDBACK
resumeRouter.get("/:resumeId/admin-feedback", protect, getAdminFeedback);
resumeRouter.post("/:resumeId/admin-feedback", protect, submitAdminFeedback);

// MARK RESUME AS IMPROVED
resumeRouter.post("/:resumeId/mark-improved", protect, markResumeImproved);

export default resumeRouter;
