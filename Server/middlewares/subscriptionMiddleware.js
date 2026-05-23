import Subscription from "../models/Subscription.js";
import College from "../models/College.js";

// Check if college has active subscription and has not exceeded student limit
export const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const collegeId = req.user?.collegeId;
    if (!collegeId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const subscription = await Subscription.findOne({ collegeId });
    const college = await College.findById(collegeId);

    if (!subscription || !college) {
      return res.status(404).json({ message: "College or subscription not found" });
    }

    // Check if subscription is active
    if (subscription.status === "suspended") {
      return res.status(403).json({
        message: "Subscription suspended",
        reason: "Your subscription has been suspended",
      });
    }

    // Check if subscription has expired
    const now = new Date();
    if (subscription.status === "active" && subscription.endDate && new Date(subscription.endDate) < now) {
      subscription.status = "expired";
      await subscription.save();
      college.subscriptionStatus = "expired";
      await college.save();

      return res.status(403).json({
        message: "Subscription expired",
        reason: "Your subscription has expired. Please renew your plan.",
      });
    }

    // Check if in trial period
    if (subscription.status === "trial") {
      if (college.trialEndsAt && new Date(college.trialEndsAt) < now) {
        subscription.status = "inactive";
        college.subscriptionStatus = "inactive";
        await subscription.save();
        await college.save();

        return res.status(403).json({
          message: "Trial expired",
          reason: "Your trial period has ended. Please purchase a subscription.",
        });
      }
    }

    // Attach subscription to request
    req.subscription = subscription;
    req.college = college;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check student limit for the college
export const checkStudentLimit = async (req, res, next) => {
  try {
    if (!req.subscription || !req.college) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // If student limit is unlimited (999999), skip check
    if (req.subscription.studentLimit >= 999999) {
      return next();
    }

    const currentStudentCount = req.college.currentStudentCount || 0;
    if (currentStudentCount >= req.subscription.studentLimit) {
      return res.status(403).json({
        message: "Student limit exceeded",
        reason: `Your plan allows up to ${req.subscription.studentLimit} students`,
        limit: req.subscription.studentLimit,
        current: currentStudentCount,
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check AI usage limit
export const checkAIUsageLimit = async (req, res, next) => {
  try {
    if (!req.subscription) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // If AI usage limit is unlimited (99999), skip check
    if (req.subscription.aiUsageLimit >= 99999) {
      return next();
    }

    if (req.subscription.aiUsageCount >= req.subscription.aiUsageLimit) {
      return res.status(403).json({
        message: "AI usage limit exceeded",
        reason: `Your plan allows up to ${req.subscription.aiUsageLimit} AI requests per month`,
        limit: req.subscription.aiUsageLimit,
        current: req.subscription.aiUsageCount,
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Increment AI usage count
export const incrementAIUsage = async (collegeId) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { collegeId },
      { $inc: { aiUsageCount: 1 } },
      { new: true }
    );
    return subscription;
  } catch (err) {
    console.error("Error incrementing AI usage:", err);
  }
};

// Check if feature is available in current plan
export const checkFeatureAccess = (feature) => {
  return async (req, res, next) => {
    try {
      if (!req.subscription) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!req.subscription.features[feature]) {
        return res.status(403).json({
          message: "Feature not available",
          reason: `The ${feature} feature is not available in your current plan`,
          feature,
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

export default checkSubscriptionStatus;
