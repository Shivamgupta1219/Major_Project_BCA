import College from "../models/College.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import ActivityLog from "../models/ActivityLog.js";

// GET /api/super-admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const colleges = await College.countDocuments();
    const activeColleges = await College.countDocuments({
      subscriptionStatus: "active",
    });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalResumes = await Resume.countDocuments();
    const completedResumes = await Resume.countDocuments({
      "resumeScore.overall": { $gt: 0 },
    });

    const subscriptions = await Subscription.find().select("status planName amount");
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === "active"
    ).length;
    const totalRevenue = subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + (s.amount || 0), 0);

    const expiringSoon = await College.find({
      subscriptionEndDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }).select("name subscriptionEndDate");

    const subscriptionPlans = await Subscription.aggregate([
      {
        $group: {
          _id: "$planName",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const recentActivity = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email")
      .populate("collegeId", "name");

    res.json({
      stats: {
        totalColleges: colleges,
        activeColleges,
        totalStudents,
        totalResumes,
        completedResumes,
        resumeCompletion: Math.round((completedResumes / Math.max(1, totalResumes)) * 100),
        activeSubscriptions,
        monthlyRevenue: totalRevenue,
      },
      subscriptionPlans,
      expiringSoon,
      recentActivity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/super-admin/colleges
export const listColleges = async (req, res) => {
  try {
    const { status, plan, sort = "createdAt" } = req.query;
    const filter = {};
    if (status) filter.subscriptionStatus = status;
    if (plan) filter.planName = plan;

    const colleges = await College.find(filter)
      .sort({ [sort]: -1 })
      .select("-password");

    const enriched = await Promise.all(
      colleges.map(async (c) => {
        const studentCount = await User.countDocuments({
          collegeId: c._id,
          role: "student",
        });
        const sub = await Subscription.findOne({ collegeId: c._id });
        return {
          ...c.toObject(),
          studentCount,
          subscription: sub,
        };
      })
    );

    res.json({ colleges: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/super-admin/colleges
export const createCollege = async (req, res) => {
  try {
    const { name, shortName, email, phone, planName = "basic" } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const college = await College.create({
      name,
      shortName,
      email,
      phone,
      planName,
      subscriptionStatus: "trial",
    });

    // Create subscription entry
    const subscription = await Subscription.create({
      collegeId: college._id,
      planName,
      status: "trial",
      studentLimit: planName === "basic" ? 300 : planName === "standard" ? 1000 : 999999,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Log activity
    await ActivityLog.create({
      collegeId: college._id,
      action: "college_created",
      details: `College ${name} created with ${planName} plan`,
    });

    res.status(201).json({ college, subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/super-admin/colleges/:collegeId
export const updateCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { name, email, phone, address, website } = req.body;

    const college = await College.findByIdAndUpdate(
      collegeId,
      { name, email, phone, address, website },
      { new: true }
    );

    if (!college) return res.status(404).json({ message: "College not found" });
    res.json({ college });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/super-admin/colleges/:collegeId/status
export const updateCollegeStatus = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const college = await College.findByIdAndUpdate(
      collegeId,
      { subscriptionStatus: status },
      { new: true }
    );

    if (!college) return res.status(404).json({ message: "College not found" });

    await ActivityLog.create({
      collegeId,
      action: "college_updated",
      details: `Status changed to ${status}`,
    });

    res.json({ college });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/super-admin/colleges/:collegeId/plan
export const updateCollegePlan = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { planName, amount } = req.body;

    if (!["basic", "standard", "premium"].includes(planName)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const studentLimits = { basic: 300, standard: 1000, premium: 999999 };
    const college = await College.findByIdAndUpdate(
      collegeId,
      {
        planName,
        studentLimit: studentLimits[planName],
        subscriptionStatus: "active",
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    if (!college) return res.status(404).json({ message: "College not found" });

    // Update subscription
    await Subscription.findOneAndUpdate(
      { collegeId },
      {
        planName,
        status: "active",
        amount: amount || 0,
        studentLimit: studentLimits[planName],
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    await ActivityLog.create({
      collegeId,
      action: "subscription_purchased",
      details: `Plan upgraded to ${planName}`,
    });

    res.json({ college });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/super-admin/colleges/:collegeId
export const deleteCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;

    await College.findByIdAndDelete(collegeId);
    await Subscription.findOneAndDelete({ collegeId });
    await User.deleteMany({ collegeId });
    await Resume.deleteMany({ collegeId });
    await ActivityLog.deleteMany({ collegeId });

    res.json({ message: "College deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/super-admin/subscriptions
export const listSubscriptions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const subscriptions = await Subscription.find(filter)
      .populate("collegeId", "name email subscriptionStatus")
      .sort({ createdAt: -1 });

    res.json({ subscriptions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/super-admin/plans
export const getPlans = async (req, res) => {
  const plans = [
    {
      name: "basic",
      price: 5000,
      students: 300,
      features: [
        "Resume builder",
        "PDF download",
        "Basic dashboard",
      ],
    },
    {
      name: "standard",
      price: 15000,
      students: 1000,
      features: [
        "All Basic features",
        "AI resume score",
        "Faculty review",
        "Reports",
        "Skill gap analytics",
      ],
    },
    {
      name: "premium",
      price: 40000,
      students: "Unlimited",
      features: [
        "All Standard features",
        "Placement drive matching",
        "White-label branding",
        "Mock interview prep",
        "Advanced analytics",
        "Priority support",
      ],
    },
  ];
  res.json({ plans });
};

// GET /api/super-admin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const collegeCount = await College.countDocuments();
    const studentCount = await User.countDocuments({ role: "student" });
    const resumeCount = await Resume.countDocuments();
    const avgScore = await Resume.aggregate([
      { $match: { "resumeScore.overall": { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: "$resumeScore.overall" } } },
    ]);

    const planDistribution = await College.aggregate([
      { $group: { _id: "$planName", count: { $sum: 1 } } },
    ]);

    const monthlySignups = await College.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      collegeCount,
      studentCount,
      resumeCount,
      avgScore: avgScore[0]?.avg?.toFixed(2) || 0,
      planDistribution,
      monthlySignups,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/super-admin/admin-setup - Create admin account for college
// Used by AdminSetup.jsx - validates college and creates admin
export const adminSetup = async (req, res) => {
  try {
    const { collegeId, name, email, password } = req.body;
    const bcrypt = (await import("bcryptjs")).default;

    // Validate input
    if (!collegeId || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Verify college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // Check if admin already exists for this college
    const existingAdmin = await User.findOne({ collegeId, role: "admin" });
    if (existingAdmin) {
      return res.status(409).json({ message: "College already has an admin account" });
    }

    // Check if email is already used
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      collegeId,
    });

    // Log activity
    await ActivityLog.create({
      collegeId,
      userId: admin._id,
      action: "admin_created",
      details: `Admin ${name} created setup account for college`,
    });

    // Generate token for auto-login
    const jwt = (await import("jsonwebtoken")).default;
    const token = jwt.sign(
      { userId: admin._id, role: "admin", collegeId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    admin.password = undefined;

    res.status(201).json({
      message: "Admin account created successfully",
      token,
      user: admin,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
