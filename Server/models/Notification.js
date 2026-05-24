import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["resume_updated", "resume_created", "job_match", "achievement"],
      required: true,
    },
    title: String,
    message: String,
    metadata: mongoose.Schema.Types.Mixed,
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    actionUrl: String,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
