import express from "express";
import { getATSScore } from "../controllers/atsController.js";

const router = express.Router();

router.post("/score", getATSScore);

export default router;