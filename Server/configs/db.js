import mongoose from "mongoose";
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("MONGO_URI:", process.env.MONGO_URI ? "SET" : "NOT SET");
    process.exit(1);
  }
};

export default connectDB;
