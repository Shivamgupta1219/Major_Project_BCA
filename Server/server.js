import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import configDotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import uploadRoutes from "./routes/uploadRoute.js";
import jobRoutes from "./routes/jobRoutes.js";
import atsRouter from "./routes/atsRoute.js";
import notificationRouter from "./routes/notificationRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import superAdminRouter from "./routes/superAdminRoutes.js";
import facultyRouter from "./routes/facultyRoutes.js";
import subscriptionRouter from "./routes/subscriptionRoutes.js";
import placementDriveRouter from "./routes/placementDriveRoutes.js";

configDotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - must be before routes
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser middleware
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Running");
});
app.use("/api/users", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRouter);

app.use("/api/upload", uploadRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ats", atsRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/super-admin", superAdminRouter);
app.use("/api/faculty", facultyRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/placement-drives", placementDriveRouter);

// Initialize database and start server
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
})();
