import mongoose from "mongoose";

const PlacementDriveSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      default: "",
    },
    eligibilityCriteria: {
      minCGPA: { type: Number, default: 0 },
      specializations: [String],
      graduationYear: [Number],
      backlogAllowed: { type: Boolean, default: false },
    },
    ctc: {
      base: { type: Number, default: 0 },
      bonus: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },
    noOfPositions: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ["draft", "open", "closed", "completed"],
      default: "draft",
    },
    driveDate: {
      type: Date,
      required: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      default: "Online",
    },
    rounds: [
      {
        name: { type: String, default: "" },
        type: { type: String, enum: ["screening", "written", "technical", "hr", "group_discussion"], default: "technical" },
        date: Date,
        description: String,
      },
    ],
    registeredStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    selectedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PlacementDrive", PlacementDriveSchema);
