import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:notificationId/read", protect, markAsRead);
router.put("/mark-all-read", protect, markAllAsRead);

export default router;
