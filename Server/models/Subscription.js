import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      unique: true,
      index: true,
    },
    planName: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },
    amount: { type: Number, default: 0 },
    paymentId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "inactive", "expired", "suspended", "trial"],
      default: "trial",
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    autoRenewal: { type: Boolean, default: true },
    studentLimit: { type: Number, default: 0 },
    aiUsageLimit: { type: Number, default: 1000 },
    aiUsageCount: { type: Number, default: 0 },
    features: {
      resumeBuilder: { type: Boolean, default: true },
      aiScore: { type: Boolean, default: false },
      aiInterviewPrep: { type: Boolean, default: false },
      facultyReview: { type: Boolean, default: false },
      placementDrives: { type: Boolean, default: false },
      whiteLabelBranding: { type: Boolean, default: false },
      advancedReports: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", SubscriptionSchema);
