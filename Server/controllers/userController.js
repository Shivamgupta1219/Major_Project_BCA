import User from "../models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId, role, collegeId) => {
  return jwt.sign({ userId, role, collegeId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST : /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, year, rollNo, collegeId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists. Please login." });
    }

    // Only allow self-registration as student.
    // super_admin must be created separately via super admin panel.
    // admin must be created via admin setup URL
    // Faculty must be created by an admin.
    const safeRole = "student"; // Always enforce student role for self-registration

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
      collegeId: collegeId || null, // Admin can provide collegeId during registration
      department: department || "",
      year: year || "",
      rollNo: rollNo || "",
    });

    const token = generateToken(newUser._id, newUser.role, newUser.collegeId);

    newUser.password = undefined;

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// POST : /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role, user.collegeId);
    user.password = undefined;

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};

// GET : /api/users/data
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// controller for getting user resumes
// GET : /api/users/resumes

// export const getUsersResumes = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const user = await Resume.find({ userId });

//     return res.status(200).json({ user });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

export const getUsersResumes = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ userId }).select("-__v");

    return res.status(200).json({ resumes });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// PUT : /api/users/update
export const updateUser = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: name.trim() },
      { new: true, select: "-password" }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT : /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
