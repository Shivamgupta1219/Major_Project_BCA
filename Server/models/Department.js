import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    code: { type: String, default: "" },
  },
  { timestamps: true }
);

DepartmentSchema.index({ collegeId: 1, name: 1 }, { unique: true });

export default mongoose.model("Department", DepartmentSchema);
