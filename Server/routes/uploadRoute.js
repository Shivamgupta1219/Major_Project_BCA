import express from "express";
import upload from "../configs/multer.js"; 
import { extractTextFromPDF } from "../Services/pdfService.js";


const router = express.Router();

router.post("/resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = await extractTextFromPDF(req.file.buffer);

    res.json({
      success: true,
      text
    });

  } catch (err) {
    console.error("PDF parsing error:", err);
    res.status(500).json({ error: "PDF parsing failed" });
  }
});

export default router;