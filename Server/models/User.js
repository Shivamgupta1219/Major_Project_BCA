import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["super_admin", "student", "faculty", "admin"],
      default: "student",
      index: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null,
      index: true,
    },
    department: { type: String, default: "", index: true },
    year: { type: String, default: "" },
    rollNo: { type: String, default: "" },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
