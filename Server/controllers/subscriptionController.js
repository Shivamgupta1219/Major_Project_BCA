import Subscription from "../models/Subscription.js";
import Payment from "../models/Payment.js";
import College from "../models/College.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan configurations
const planConfigurations = {
  basic: {
    name: "Basic Plan",
    studentLimit: 300,
    aiUsageLimit: 1000,
    amount: 9999, // in paise (₹99.99)
    duration: 12, // months
    features: {
      resumeBuilder: true,
      aiScore: false,
      aiInterviewPrep: false,
      facultyReview: false,
      placementDrives: false,
      whiteLabelBranding: false,
      advancedReports: false,
    },
  },
  standard: {
    name: "Standard Plan",
    studentLimit: 1000,
    aiUsageLimit: 5000,
    amount: 29999, // in paise (₹299.99)
    duration: 12,
    features: {
      resumeBuilder: true,
      aiScore: true,
      aiInterviewPrep: true,
      facultyReview: true,
      placementDrives: false,
      whiteLabelBranding: false,
      advancedReports: false,
    },
  },
  premium: {
    name: "Premium Plan",
    studentLimit: 999999, // Unlimited
    aiUsageLimit: 99999, // Unlimited
    amount: 99999, // in paise (₹999.99)
    duration: 12,
    features: {
      resumeBuilder: true,
      aiScore: true,
      aiInterviewPrep: true,
      facultyReview: true,
      placementDrives: true,
      whiteLabelBranding: true,
      advancedReports: true,
    },
  },
};

// GET /api/subscription/plans
export const getPlans = async (req, res) => {
  try {
    res.json({
      plans: Object.entries(planConfigurations).map(([key, plan]) => ({
        id: key,
        ...plan,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/subscription/college-subscription
export const getCollegeSubscription = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const subscription = await Subscription.findOne({ collegeId });
    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }

    // Check if subscription has expired
    const isExpired = subscription.endDate && new Date(subscription.endDate) < new Date();
    const daysUntilExpiry = subscription.endDate
      ? Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    res.json({
      subscription: {
        ...subscription.toObject(),
        isExpired,
        daysUntilExpiry,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/subscription/create-order
export const createPaymentOrder = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const { planName } = req.body;

    if (!planConfigurations[planName]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const planConfig = planConfigurations[planName];

    // Create Razorpay order
    const orderOptions = {
      amount: planConfig.amount, // Amount in paise
      currency: "INR",
      receipt: `college_${collegeId}_${Date.now()}`,
      notes: {
        collegeId: collegeId.toString(),
        collegeName: college.name,
        planName,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Create Payment record
    const payment = await Payment.create({
      collegeId,
      razorpayOrderId: order.id,
      planName,
      amount: planConfig.amount,
      status: "pending",
      paymentMethod: "razorpay",
    });

    res.json({
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      payment: payment,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/subscription/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const collegeId = req.user.collegeId;

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Find and update payment
    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (payment.collegeId.toString() !== collegeId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = "completed";
    payment.completedAt = new Date();
    await payment.save();

    // Update or create subscription
    const planConfig = planConfigurations[payment.planName];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + planConfig.duration);

    let subscription = await Subscription.findOne({ collegeId });

    if (subscription) {
      // Update existing subscription
      subscription.planName = payment.planName;
      subscription.amount = payment.amount;
      subscription.paymentId = razorpayPaymentId;
      subscription.status = "active";
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      subscription.studentLimit = planConfig.studentLimit;
      subscription.aiUsageLimit = planConfig.aiUsageLimit;
      subscription.features = planConfig.features;
      subscription.aiUsageCount = 0; // Reset usage count on new payment
    } else {
      // Create new subscription
      subscription = await Subscription.create({
        collegeId,
        planName: payment.planName,
        amount: payment.amount,
        paymentId: razorpayPaymentId,
        status: "active",
        startDate,
        endDate,
        studentLimit: planConfig.studentLimit,
        aiUsageLimit: planConfig.aiUsageLimit,
        features: planConfig.features,
      });
    }

    await subscription.save();

    // Update college
    await College.findByIdAndUpdate(collegeId, {
      subscriptionStatus: "active",
      planName: payment.planName,
      studentLimit: planConfig.studentLimit,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      trialEndsAt: null,
    });

    res.json({
      success: true,
      message: "Payment verified and subscription activated",
      subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/subscription/cancel
export const cancelSubscription = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const role = req.user.role;

    // Only super admin can cancel subscriptions
    if (role !== "super_admin") {
      return res.status(403).json({ message: "Only super admin can cancel subscriptions" });
    }

    const subscription = await Subscription.findOne({ collegeId });
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.status = "inactive";
    subscription.endDate = new Date();
    await subscription.save();

    // Update college
    await College.findByIdAndUpdate(collegeId, {
      subscriptionStatus: "inactive",
    });

    res.json({ message: "Subscription cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/subscription/payment-history
export const getPaymentHistory = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const payments = await Payment.find({ collegeId }).sort({ createdAt: -1 });

    res.json({ payments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
