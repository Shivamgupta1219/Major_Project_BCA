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

configDotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// data base connection
try {
   await connectDB();
   console.log("Database connected");
} catch (error) {
   console.log("DB Error:", error.message);
}

// routes
app.use(express.json());
app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
