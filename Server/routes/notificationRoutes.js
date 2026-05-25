import express from "express";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from "../controllers/notificationController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:notificationId/read", protect, markAsRead);
router.put("/mark-all-read", protect, markAllAsRead);
router.delete("/:notificationId", protect, deleteNotification);
router.delete("/", protect, deleteAllNotifications);

export default router;
