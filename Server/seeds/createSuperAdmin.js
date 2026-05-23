import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../configs/db.js";
import dotenv from "dotenv";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await connectDB();

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: "super_admin" });
    if (existingAdmin) {
      console.log("✅ Super admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash("SuperAdmin@123", 10);
    const superAdmin = await User.create({
      name: "Super Administrator",
      email: "superadmin@campuscv.com",
      password: hashedPassword,
      role: "super_admin",
      isVerified: true,
    });

    console.log("✅ Super Admin Created Successfully!");
    console.log("📧 Email: superadmin@campuscv.com");
    console.log("🔐 Password: SuperAdmin@123");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating super admin:", err.message);
    process.exit(1);
  }
};

createSuperAdmin();
