import express from "express";
import protect, { requireRole } from "../middlewares/authMiddleware.js";
import {
  listPlacementDrives,
  getPlacementDrive,
  createPlacementDrive,
  updatePlacementDrive,
  registerForDrive,
  selectStudents,
  deletePlacementDrive,
  getMyRegisteredDrives,
  getUpcomingDrives,
} from "../controllers/placementDriveController.js";
import { checkSubscriptionStatus } from "../middlewares/subscriptionMiddleware.js";

const placementDriveRouter = express.Router();

// Public routes (for listed drives)
placementDriveRouter.get("/student/upcoming", protect, getUpcomingDrives);
placementDriveRouter.get("/student/my-drives", protect, getMyRegisteredDrives);

// Protected routes
placementDriveRouter.use(protect, checkSubscriptionStatus);

// Admin routes
placementDriveRouter.get("/", listPlacementDrives);
placementDriveRouter.get("/:driveId", getPlacementDrive);
placementDriveRouter.post("/", requireRole("admin"), createPlacementDrive);
placementDriveRouter.put("/:driveId", requireRole("admin"), updatePlacementDrive);
placementDriveRouter.delete("/:driveId", requireRole("admin"), deletePlacementDrive);
placementDriveRouter.post("/:driveId/select-students", requireRole("admin"), selectStudents);

// Student routes
placementDriveRouter.post("/:driveId/register", registerForDrive);

export default placementDriveRouter;
