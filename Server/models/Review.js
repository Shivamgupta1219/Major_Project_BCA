import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
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
    facultyId: {
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

    // Comments
    comments: { type: String, default: "" },
    sectionComments: [
      {
        section: String,
        comment: String,
      },
    ],

    // Status
    status: {
      type: String,
      enum: ["pending", "under_review", "needs_improvement", "approved"],
      default: "pending",
    },

    // Faculty notes (private)
    privateNotes: { type: String, default: "" },

    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
