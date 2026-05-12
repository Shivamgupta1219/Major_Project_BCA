import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import configDotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import uploadRoutes from './routes/uploadRoute.js';
import jobRoutes from './routes/jobRoutes.js';

configDotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// data base connection
await connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("server is Live...");
});
app.use("/api/users", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRouter);
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
app.use("/api/upload", uploadRoutes);
app.use("/api/jobs", jobRoutes);
