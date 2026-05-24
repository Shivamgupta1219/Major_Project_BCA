import express from "express";
import protect, { requireRole } from "../middlewares/authMiddleware.js";
import {
  getDashboard,
  getReviews,
  getReviewDetail,
  submitReview,
  getAssignedStudents,
  getStudentProgress,
} from "../controllers/facultyController.js";

const facultyRouter = express.Router();

facultyRouter.use(protect, requireRole("faculty"));

facultyRouter.get("/dashboard", getDashboard);
facultyRouter.get("/reviews", getReviews);
facultyRouter.get("/reviews/:reviewId", getReviewDetail);
facultyRouter.post("/reviews/:reviewId/submit", submitReview);
facultyRouter.get("/students", getAssignedStudents);
facultyRouter.get("/student-progress/:studentId", getStudentProgress);

export default facultyRouter;
