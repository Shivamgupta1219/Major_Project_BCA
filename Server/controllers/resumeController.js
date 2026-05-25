// import imageKit from "../configs/imageKit.js";
import { response } from "express";
import Resume from "../models/Resume.js";
import { createNotification } from "./notificationController.js";
import { scoreResume } from "../Services/scoringService.js";
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

    await createNotification(
      userId,
      "resume_created",
      "Resume Created",
      `Your new resume "${title}" has been created successfully.`,
      `/app/builder/${resume._id}`
    );

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
    const User = (await import("../models/User.js")).default;

    const resume = await Resume.findOne({ _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Check if user owns the resume
    if (String(resume.userId) === String(req.userId)) {
      return res.status(200).json({ resume });
    }

    // Check if admin can view (student is in their college)
    if (req.user.role === "admin") {
      const student = await User.findById(resume.userId);
      if (student && String(student.collegeId) === String(req.user.collegeId)) {
        return res.status(200).json({ resume });
      }
    }

    return res.status(403).json({ message: "Not authorized to view this resume" });
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

    resumeData.certifications = ensureArray(resumeData.certifications).map((c) => ({
      name: c?.name || "",
      issuer: c?.issuer || "",
      issue_date: c?.issue_date || "",
      expiry_date: c?.expiry_date || "",
      credential_id: c?.credential_id || "",
      credential_url: c?.credential_url || "",
    }));

    // ---------------------------
    // ✅ UPDATE
    // ---------------------------
    const existing = resumeData;
    resumeData.resumeScore = scoreResume(
      existing,
      existing.resumeScore?.targetRole || ""
    );

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: req.userId },
      { $set: resumeData },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    await createNotification(
      req.userId,
      "resume_updated",
      "Resume Updated",
      `Your resume "${resume.title}" has been updated successfully.`,
      `/app/builder/${resumeId}`
    );

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

// POST /api/resume/:resumeId/score  body: { targetRole? }
export const computeResumeScore = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { targetRole = "" } = req.body || {};

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const score = scoreResume(resume.toObject(), targetRole);
    resume.resumeScore = score;
    await resume.save();

    return res.status(200).json({ score });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

// GET admin feedback for a resume
export const getAdminFeedback = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const AdminFeedback = (await import("../models/AdminFeedback.js")).default;

    // Verify authorization: student can see feedback for their own resume, admin can see any
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Check if user is the resume owner (student) or an admin
    const isOwner = String(resume.userId) === String(req.userId);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view feedback" });
    }

    // For admin, verify college isolation
    if (isAdmin) {
      const User = (await import("../models/User.js")).default;
      const student = await User.findById(resume.userId);
      if (!student || String(student.collegeId) !== String(req.user.collegeId)) {
        return res.status(403).json({ message: "Not authorized to view feedback" });
      }
    }

    const feedback = await AdminFeedback.findOne({ resumeId })
      .populate("adminId", "name email")
      .sort({ updatedAt: -1 });

    res.json({ feedback: feedback || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST/UPDATE admin feedback for a resume
export const submitAdminFeedback = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { comments, sectionComments, status } = req.body;
    const AdminFeedback = (await import("../models/AdminFeedback.js")).default;
    const User = (await import("../models/User.js")).default;

    // Get resume and verify authorization
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Check if admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can provide feedback" });
    }

    // Check if student belongs to admin's college
    const student = await User.findById(resume.userId);
    if (!student || String(student.collegeId) !== String(req.user.collegeId)) {
      return res.status(403).json({ message: "Not authorized to feedback this resume" });
    }

    // Find existing feedback or create new
    let feedback = await AdminFeedback.findOne({ resumeId });

    if (feedback) {
      // Update existing feedback
      feedback.comments = comments || feedback.comments;
      feedback.sectionComments = sectionComments || feedback.sectionComments;
      if (status) {
        feedback.status = status;
        feedback.reviewedAt = new Date();
      }
      await feedback.save();
    } else {
      // Create new feedback
      feedback = await AdminFeedback.create({
        resumeId,
        studentId: resume.userId,
        adminId: req.userId,
        collegeId: req.user.collegeId,
        comments,
        sectionComments: sectionComments || [],
        status: status || "pending",
        reviewedAt: status ? new Date() : null,
      });
    }

    const populated = await feedback.populate("adminId", "name email");
    res.json({ feedback: populated, message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark resume as improved by student
export const markResumeImproved = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const AdminFeedback = (await import("../models/AdminFeedback.js")).default;
    const { createNotification } = await import("./notificationController.js");

    // Get resume and verify ownership
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (String(resume.userId) !== String(req.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get feedback for this resume
    const feedback = await AdminFeedback.findOne({ resumeId });
    if (!feedback) {
      return res.status(404).json({ message: "No feedback found for this resume" });
    }

    // Create notification for admin
    await createNotification(
      feedback.adminId,
      "resume_improved",
      "Resume Improved",
      `Student has improved their resume "${resume.title}" based on your feedback. Status: ${feedback.status}`,
      `/admin/students`
    );

    res.json({ message: "Admin notified about your improvements" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
