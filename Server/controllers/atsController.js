import { analyzeResume } from "../Services/aiService.js";

export const getATSScore = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Resume text required" });
    }

    const result = await analyzeResume(resumeText, jobDescription);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to analyze resume"
    });
  }
};