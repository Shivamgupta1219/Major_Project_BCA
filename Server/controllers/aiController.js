// controller for enhancing a resume summary
// post: /api/ai/enhance-pro-sum
import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";
import genAI from "../configs/gemini.js";
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `
            You are an expert resume writer.
            Rewrite and enhance the user's professional summary.

            Rules:
            - Keep it between 2–6 sentences.
            - Make it ATS-friendly, clear, and professional.
            - Highlight key skills naturally in sentences.
            - Do NOT add bullet points, headings, options, or explanations.
            - Return ONLY the improved summary text.
          `,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content.trim();
    return res.status(200).json({ enhancedContent });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// contoller for job des.
// post : /api/ai/enhance-job-des
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `
You are an expert resume writer.

Rewrite and enhance the job description as strong resume bullet points.

Rules:
- 3-4 bullets
- Start each bullet with a strong action verb
- Be concise and ATS-friendly
- Add impact (numbers if possible)
- Do NOT explain anything
- Return ONLY the bullet points
`,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });
    let enhancedContent = response.choices[0].message.content;

    // Safety cleanup (guarantees ATS-friendly text)
    enhancedContent = enhancedContent
      .replace(/[*•\-]/g, "")
      .replace(/\*\*/g, "")
      .trim();

    return res.status(200).json({ enhancedContent });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// comtroller to upload a resume to data base
// POST /api/ai/upload-resume

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;
    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields " });
    }

    const systemPrompt =
      "you are an expert ai agent to extract data from resume ";

    const userPrompt = `extract data from this : ${resumeText} Provide data in the following JSON format with no additonal text before or after 
    { professional_summary: { type: String, default: "" },

    experience: [
      {
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        start_date: { type: String, default: "" },
        end_date: { type: String, default: "" },
        description: { type: String, default: "" },
        is_current: { type: Boolean, default: false },
      },
    ],
    project: [
      {
        name: { type: String, default: "" },
        type: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        gpa: { type: String, default: "" },
        start_date: { type: String, default: "" },
        end_date: { type: String, default: "" },
        description: { type: String, default: "" },
        is_current: { type: Boolean, default: false },
      },
    ],    skills: { type: Array, default: [] },} `;
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });
    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({ userId, title, ...parsedData });
    return res.json({ resumeId: newResume._id });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// controller for career guidance
// POST: /api/ai/career-guidance
// export const careerGuidance = async (req, res) => {
//   try {
//     const { userProfile } = req.body;

//     if (!userProfile) {
//       return res.status(400).json({ message: "User profile is required" });
//     }

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// const result = await model.generateContent(prompt);

// // ✅ correct way
// const response = await result.response;
// const text = response.text();

// return res.status(200).json({
//   careerAdvice: text,
// });

//     const prompt = `
// You are an expert career advisor.

// Based on the user's profile, suggest:
// 1. Best career paths (2-3 options)
// 2. Skills they should learn
// 3. Recommended tools/technologies
// 4. Short roadmap (step-by-step)

// Rules:
// - Keep it concise and practical
// - Make it beginner-friendly
// - Focus on real-world jobs
// - Do NOT add unnecessary explanations

// User Profile:
// ${userProfile}
// `;

//     const result = await model.generateContent(prompt);
//     const response = result.response.text();

//     return res.status(200).json({
//       careerAdvice: response.trim(),
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: err.message,
//     });
//   }
// };

export const careerGuidance = async (req, res) => {
  try {
    const { userProfile } = req.body;

    if (!userProfile) {
      return res.status(400).json({ message: "User profile is required" });
    }

    const prompt = `
You are an expert career advisor.

Based on the user's profile, suggest:
1. Best career paths (2-3 options)
2. Skills they should learn
3. Recommended tools/technologies
4. Short roadmap (step-by-step)

Rules:
- Keep it concise and practical
- Make it beginner-friendly
- Focus on real-world jobs
- Do NOT add unnecessary explanations

User Profile:
${userProfile}
`;

    const model = genAI.getGenerativeModel({
      model: process.env.OPENAI_MODEL,
    });

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();
   let cleanedText = text
  .replace(/[*#]/g, "")
  .replace(/\n{2,}/g, "\n")
  .trim();

    return res.status(200).json({
      careerAdvice: cleanedText,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Cover Letter Generator
// POST: /api/ai/generate-cover-letter
export const generateCoverLetter = async (req, res) => {
  try {
    const { jobTitle, companyName, resumeSummary, skills } = req.body;

    if (!jobTitle || !companyName || !resumeSummary) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const skillsText = Array.isArray(skills) ? skills.join(", ") : skills;

    const prompt = `
You are an expert cover letter writer.

Generate a professional cover letter for the following:
- Job Title: ${jobTitle}
- Company: ${companyName}
- My Resume Summary: ${resumeSummary}
- My Skills: ${skillsText}

Rules:
- Keep it to 3-4 paragraphs
- Professional and engaging tone
- Highlight relevant skills and achievements
- Include a call to action
- Make it ATS-friendly
- Do NOT add formatting with * or # symbols
- Return ONLY the cover letter text
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert cover letter writer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const coverLetter = response.choices[0].message.content.trim();
    return res.status(200).json({ coverLetter });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// LinkedIn Profile Optimizer
// POST: /api/ai/optimize-linkedin
export const optimizeLinkedInProfile = async (req, res) => {
  try {
    const { headline, summary, skills, experience } = req.body;

    if (!summary) {
      return res.status(400).json({ message: "Summary is required" });
    }

    const prompt = `
You are a LinkedIn optimization expert.

Help optimize this LinkedIn profile:
- Current Headline: ${headline || "Not provided"}
- Summary: ${summary}
- Skills: ${skills ? skills.join(", ") : "Not provided"}
- Experience: ${experience || "Not provided"}

Provide suggestions in JSON format:
{
  "optimized_headline": "...",
  "optimized_summary": "...",
  "suggested_skills": [...],
  "tips": [...]
}

Rules:
- Keep it professional and engaging
- Make it keyword-rich for recruiters
- Be concise but impactful
- Focus on achievements and impact
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a LinkedIn optimization expert.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const suggestions = JSON.parse(response.choices[0].message.content);
    return res.status(200).json(suggestions);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Mock Interview Questions Generator
// POST: /api/ai/generate-interview-questions
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobTitle, skills, experience, difficulty = "intermediate" } = req.body;

    if (!jobTitle || !skills) {
      return res.status(400).json({ message: "Job title and skills are required" });
    }

    const skillsText = Array.isArray(skills) ? skills.join(", ") : skills;

    const prompt = `
You are an expert interview coach.

Generate mock interview questions for:
- Job Title: ${jobTitle}
- Key Skills: ${skillsText}
- Experience Level: ${difficulty}

Provide questions in JSON format:
{
  "technical_questions": [...],
  "behavioral_questions": [...],
  "questions_to_ask_interviewer": [...],
  "tips": [...]
}

Rules:
- Generate 5 questions per category
- Make them realistic and relevant
- Include follow-up hints
- Provide tips for answering well
- ${difficulty === "junior" ? "Focus on basics and learning attitude" : difficulty === "intermediate" ? "Balance theory and practical experience" : "Focus on advanced concepts and problem-solving"}
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const questions = JSON.parse(response.choices[0].message.content);
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Job Description Matcher
// POST: /api/ai/match-job-description
export const matchJobDescription = async (req, res) => {
  try {
    const { jobDescription, resumeContent } = req.body;

    if (!jobDescription || !resumeContent) {
      return res.status(400).json({ message: "Job description and resume content are required" });
    }

    const prompt = `
You are an expert resume matcher and career advisor.

Analyze how well this resume matches the job description:

JOB DESCRIPTION:
${jobDescription}

RESUME CONTENT:
${resumeContent}

Provide analysis in JSON format:
{
  "overall_match_percentage": 0-100,
  "matched_skills": [...],
  "missing_skills": [...],
  "strength_areas": [...],
  "improvement_areas": [...],
  "recommendations": [...],
  "motivation_text": "..."
}

Rules:
- Be honest but constructive
- Focus on key requirements
- Identify transferable skills
- Provide actionable recommendations
- Be encouraging but realistic
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert resume matcher and career advisor.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    return res.status(200).json(analysis);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
