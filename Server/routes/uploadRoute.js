import express from "express";
import upload from "../configs/multer.js"; 
import { extractTextFromPDF } from "../Services/pdfService.js";


const router = express.Router();

router.post("/resume", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const text = await extractTextFromPDF(filePath);

    res.json({
      success: true,
      text
    });

  } catch (err) {
    res.status(500).json({ error: "PDF parsing failed" });
  }
});

export default router;