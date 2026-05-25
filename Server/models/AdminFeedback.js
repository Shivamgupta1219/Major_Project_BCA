import mongoose from "mongoose";

const AdminFeedbackSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    // Feedback content
    comments: { type: String, default: "" },
    sectionComments: [
      {
        section: String,
        comment: String,
      },
    ],

    // Status/Approval
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "needs_improvement"],
      default: "pending",
    },

    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("AdminFeedback", AdminFeedbackSchema);
