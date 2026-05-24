import express from "express";
import protect, { requireRole } from "../middlewares/authMiddleware.js";
import {
  getDashboard,
  listColleges,
  createCollege,
  updateCollege,
  updateCollegeStatus,
  updateCollegePlan,
  deleteCollege,
  listSubscriptions,
  getPlans,
  getAnalytics,
  adminSetup,
} from "../controllers/superAdminController.js";

const superAdminRouter = express.Router();

// Public endpoint for admin setup (no auth required - validated via college ID)
superAdminRouter.post("/admin-setup", adminSetup);

// Protected routes - require super_admin role
superAdminRouter.use(protect, requireRole("super_admin"));

superAdminRouter.get("/dashboard", getDashboard);
superAdminRouter.get("/colleges", listColleges);
superAdminRouter.post("/colleges", createCollege);
superAdminRouter.put("/colleges/:collegeId", updateCollege);
superAdminRouter.put("/colleges/:collegeId/status", updateCollegeStatus);
superAdminRouter.put("/colleges/:collegeId/plan", updateCollegePlan);
superAdminRouter.delete("/colleges/:collegeId", deleteCollege);
superAdminRouter.get("/subscriptions", listSubscriptions);
superAdminRouter.get("/plans", getPlans);
superAdminRouter.get("/analytics", getAnalytics);

export default superAdminRouter;
