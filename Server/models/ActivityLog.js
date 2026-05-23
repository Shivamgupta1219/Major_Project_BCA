import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null,
      index: true,
    },
    action: {
      type: String,
      enum: [
        "user_login",
        "user_logout",
        "resume_created",
        "resume_updated",
        "resume_deleted",
        "resume_submitted",
        "resume_reviewed",
        "student_added",
        "student_deleted",
        "college_created",
        "college_updated",
        "subscription_purchased",
        "subscription_renewed",
        "ai_usage",
        "report_generated",
      ],
      required: true,
    },
    details: { type: String, default: "" },
    metadata: { type: Object, default: {} },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: true, index: { collegeId: 1, createdAt: -1 } }
);

export default mongoose.model("ActivityLog", ActivityLogSchema);
