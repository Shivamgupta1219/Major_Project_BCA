// import imageKit from "../configs/imageKit.js";
import { response } from "express";
import Resume from "../models/Resume.js";
// import fs from 'fs;
// /controllers for creating new resume
//  post : /api/resume/create

export const createResume = async (req, res) => {
  try {
    const userId = req.userId; // added by auth middleware
    const { title } = req.body;

    const resume = await Resume.create({
      userId,
      title,
    });

    return res.status(201).json({
      message: "Resume created successfully",
      resume: resume,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create resume", error });
  }
};

// controllers for delte a resume
// delete : /api/resume/:id

export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId; // added by auth middleware
    const { resumeId } = req.params;

    const resume = await Resume.findOneAndDelete({
      userId,
      _id: resumeId,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete resume", error });
  }
};

// get user  resume by id
//get : /api/resume/:id

// export const getResumeById = async (req, res) => {
//   try {
//     const userId = req.userId; // added by auth middleware
//     const { resumeId } = req.params;

//     const resume = await Resume.findOne({
//       userId,
//       _id: resumeId,
//     });

//     if (!resume) {
//       res.status(404).json({ message: "Resume not found " });
//     }
//     resume.__v = undefined;
//     resume.createdAt = undefined;
//     resume.updatedAt = undefined;
//     return res.status(200).json({
//       resume,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get resume by id public
// get : /api/resume/public/:id

export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      public: true,
      _id: resumeId,
    });

    if (!resume) {
      res.status(404).json({ message: "Resume not found " });
    }
    return res.status(200).json({
      resume,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update resume by id
// put: /api/resume/:id
// GET ALL USER RESUME

// export const updateResume = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { resumeId, resumeData } = req.body;
//     const data = JSON.parse(resumeData);

//     const resume = await Resume.findOneAndUpdate(
//       { _id: resumeId, userId },
//       { $set: resumeData },
//       { new: true }
//     );

//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     return res.status(200).json({
//       message: "Resume updated successfully",
//       resume,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const updateResume = async (req, res) => {
//   try {
//     const { resumeId } = req.params;
//     const resumeData = req.body;

//     const resume = await Resume.findOneAndUpdate(
//       { _id: resumeId, userId: req.userId },
//       { $set: resumeData },
//       { new: true, runValidators: true }
//     );

//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     return res.status(200).json({
//       message: "Resume updated successfully",
//       resume,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
export const updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    let resumeData = req.body;

    const ensureArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

    // ---------------------------
    // 🔐 NORMALIZE ALL ARRAYS
    // ---------------------------
    resumeData.project = ensureArray(resumeData.project).map((p) => ({
      name: p?.name || "",
      type: p?.type || "",
      description: p?.description || "",
      technologies: Array.isArray(p?.technologies) ? p.technologies : [],
    }));

    resumeData.education = ensureArray(resumeData.education).map((e) => ({
      institution: e?.institution || "",
      degree: e?.degree || "",
      field: e?.field || "",
      gpa: e?.gpa || "",
      start_date: e?.start_date || "",
      end_date: e?.end_date || "",
      description: e?.description || "",
      is_current: Boolean(e?.is_current),
    }));

    resumeData.experience = ensureArray(resumeData.experience).map((e) => ({
      company: e?.company || "",
      position: e?.position || "",
      start_date: e?.start_date || "",
      end_date: e?.end_date || "",
      description: e?.description || "",
      is_current: Boolean(e?.is_current),
    }));

    resumeData.skills = ensureArray(resumeData.skills);

    resumeData.certifications = ensureArray(resumeData.certifications);

    // ---------------------------
    // ✅ UPDATE
    // ---------------------------
    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: req.userId },
      { $set: resumeData },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Update Resume Error:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });

    res.status(200).json({ resumes });
  } catch (err) {
    res.status(500).json({ message: "Error loading resumes" });
  }
};

export const saveResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    let resume;

    // 🔹 UPDATE EXISTING RESUME
    if (resumeId) {
      resume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        { $set: resumeData },
        { new: true, runValidators: true }
      );

      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
    }
    // 🔹 CREATE NEW RESUME
    else {
      resume = await Resume.create({
        userId,
        ...resumeData,
      });
    }

    return res.status(200).json({
      message: "Resume saved successfully",
      resume,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save resume",
      error: error.message,
    });
  }
};
