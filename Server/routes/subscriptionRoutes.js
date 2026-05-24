import express from "express";
import protect, { requireRole } from "../middlewares/authMiddleware.js";
import {
  getPlans,
  getCollegeSubscription,
  createPaymentOrder,
  verifyPayment,
  cancelSubscription,
  getPaymentHistory,
} from "../controllers/subscriptionController.js";

const subscriptionRouter = express.Router();

// Public routes
subscriptionRouter.get("/plans", getPlans);

// Protected routes - require authentication
subscriptionRouter.use(protect);

subscriptionRouter.get("/college-subscription", getCollegeSubscription);
subscriptionRouter.post("/create-order", createPaymentOrder);
subscriptionRouter.post("/verify-payment", verifyPayment);
subscriptionRouter.get("/payment-history", getPaymentHistory);

// Admin only routes
subscriptionRouter.delete("/cancel", requireRole("super_admin"), cancelSubscription);

export default subscriptionRouter;
