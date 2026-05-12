import axios from "axios";

export const analyzeResume = async (resumeText, jobDescription) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
Analyze the resume and return ONLY JSON:

{
  "score": number,
  "missingSkills": [],
  "suggestions": [],
  "strengths": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
                `
              }
            ]
          }
        ]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    // Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};

  } catch (error) {
    console.error("AI ERROR:", error.message);
    throw error;
  }
};