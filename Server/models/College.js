import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    shortName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    website: { type: String, default: "" },
    logo: { type: String, default: "" },
    accentColor: { type: String, default: "#4f46e5" },
    placementCellName: { type: String, default: "" },

    // Subscription info
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "expired", "trial", "suspended"],
      default: "trial",
      index: true,
    },
    planName: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },
    studentLimit: { type: Number, default: 300 },
    currentStudentCount: { type: Number, default: 0 },
    subscriptionStartDate: { type: Date, default: null },
    subscriptionEndDate: { type: Date, default: null },

    // Settings
    isActive: { type: Boolean, default: true, index: true },
    trialEndsAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
);

export default mongoose.model("College", CollegeSchema);
