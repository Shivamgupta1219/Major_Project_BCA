import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import College from "../models/College.js";
import Department from "../models/Department.js";

const buildStudentScope = (req) => {
  const scope = { role: "student" };
  if (req.user.collegeId) scope.collegeId = req.user.collegeId;
  return scope;
};

// GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const scope = buildStudentScope(req);
    const totalStudents = await User.countDocuments(scope);
    const totalFaculty = await User.countDocuments({
      ...scope,
      role: "faculty",
    });

    const students = await User.find(scope).select("_id department year");
    const studentIds = students.map((s) => s._id);

    const resumes = await Resume.find({ userId: { $in: studentIds } }).select(
      "userId resumeScore skills"
    );

    const completedSet = new Set(
      resumes
        .filter((r) => (r.resumeScore?.overall || 0) > 0)
        .map((r) => String(r.userId))
    );

    const scores = resumes
      .map((r) => r.resumeScore?.overall || 0)
      .filter((n) => n > 0);
    const averageScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    const ranges = { excellent: 0, good: 0, fair: 0, weak: 0 };
    for (const s of scores) {
      if (s >= 80) ranges.excellent++;
      else if (s >= 65) ranges.good++;
      else if (s >= 45) ranges.fair++;
      else ranges.weak++;
    }

    const byDept = {};
    for (const stu of students) {
      const d = stu.department || "Unspecified";
      byDept[d] = byDept[d] || { total: 0, completed: 0, scoreSum: 0, scoreCount: 0 };
      byDept[d].total++;
      if (completedSet.has(String(stu._id))) byDept[d].completed++;
    }
    const userIndex = Object.fromEntries(students.map((s) => [String(s._id), s]));
    for (const r of resumes) {
      const stu = userIndex[String(r.userId)];
      if (!stu) continue;
      const d = stu.department || "Unspecified";
      const sc = r.resumeScore?.overall || 0;
      if (sc > 0) {
        byDept[d].scoreSum += sc;
        byDept[d].scoreCount++;
      }
    }
    const departments = Object.entries(byDept).map(([name, v]) => ({
      name,
      total: v.total,
      completed: v.completed,
      avgScore: v.scoreCount ? Math.round(v.scoreSum / v.scoreCount) : 0,
    }));

    // skill frequencies
    const skillFreq = {};
    for (const r of resumes) {
      const skills = (r.skills || []).map((s) =>
        typeof s === "string" ? s : s?.name || ""
      );
      for (const sk of skills) {
        const k = String(sk).trim().toLowerCase();
        if (!k) continue;
        skillFreq[k] = (skillFreq[k] || 0) + 1;
      }
    }
    const topSkills = Object.entries(skillFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    res.json({
      totalStudents,
      totalFaculty,
      resumeCompleted: completedSet.size,
      averageScore,
      ranges,
      departments,
      topSkills,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/students  ?department=&year=&sort=score|score_asc&q=
export const listStudents = async (req, res) => {
  try {
    const { department, year, sort = "score", q = "" } = req.query;
    const scope = buildStudentScope(req);
    if (department) scope.department = department;
    if (year) scope.year = year;
    if (q) {
      scope.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { rollNo: { $regex: q, $options: "i" } },
      ];
    }

    const students = await User.find(scope)
      .select("name email department year rollNo createdAt")
      .lean();

    const studentIds = students.map((s) => s._id);
    const resumes = await Resume.find({ userId: { $in: studentIds } })
      .select("userId title resumeScore updatedAt")
      .lean();

    const bestByUser = {};
    for (const r of resumes) {
      const uid = String(r.userId);
      const sc = r.resumeScore?.overall || 0;
      if (!bestByUser[uid] || sc > (bestByUser[uid].resumeScore?.overall || 0)) {
        bestByUser[uid] = r;
      }
    }

    const enriched = students.map((s) => {
      const r = bestByUser[String(s._id)];
      return {
        ...s,
        resumeScore: r?.resumeScore?.overall || 0,
        resumeTitle: r?.title || null,
        resumeUpdatedAt: r?.updatedAt || null,
        ready: (r?.resumeScore?.overall || 0) >= 70,
      };
    });

    if (sort === "score_asc") {
      enriched.sort((a, b) => a.resumeScore - b.resumeScore);
    } else {
      enriched.sort((a, b) => b.resumeScore - a.resumeScore);
    }

    res.json({ students: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/skill-gap?role=
const ROLE_REQUIRED = {
  "frontend developer": ["react", "javascript", "html", "css", "git", "rest api"],
  "backend developer": ["node", "express", "mongodb", "sql", "rest api", "git"],
  "data analyst": ["sql", "excel", "python", "pandas", "tableau", "statistics"],
  "python developer": ["python", "django", "sql", "git", "oop", "rest api"],
  "java developer": ["java", "spring boot", "sql", "git", "oop", "rest api"],
};

export const getSkillGap = async (req, res) => {
  try {
    const role = String(req.query.role || "frontend developer").toLowerCase();
    const required = ROLE_REQUIRED[role] || ROLE_REQUIRED["frontend developer"];

    const scope = buildStudentScope(req);
    const students = await User.find(scope).select("_id").lean();
    const studentIds = students.map((s) => s._id);
    const resumes = await Resume.find({ userId: { $in: studentIds } })
      .select("userId skills")
      .lean();

    const studentSkills = {};
    for (const r of resumes) {
      const uid = String(r.userId);
      studentSkills[uid] = studentSkills[uid] || new Set();
      for (const sk of r.skills || []) {
        const s = (typeof sk === "string" ? sk : sk?.name || "")
          .trim()
          .toLowerCase();
        if (s) studentSkills[uid].add(s);
      }
    }

    const gap = required.map((skill) => {
      const have = Object.values(studentSkills).filter((set) =>
        [...set].some((s) => s.includes(skill))
      ).length;
      const missing = students.length - have;
      return { skill, have, missing };
    });

    res.json({
      role,
      totalStudents: students.length,
      requiredSkills: required,
      gap,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/students/bulk  body: { students: [{name,email,rollNo,department,year}] }
export const bulkCreateStudents = async (req, res) => {
  try {
    const { students = [] } = req.body || {};
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "No students provided" });
    }

    const created = [];
    const skipped = [];

    for (const row of students) {
      const email = (row.email || "").trim().toLowerCase();
      const name = (row.name || "").trim();
      if (!email || !name) {
        skipped.push({ row, reason: "Missing name or email" });
        continue;
      }
      const exists = await User.findOne({ email });
      if (exists) {
        skipped.push({ row, reason: "Email already exists" });
        continue;
      }
      const defaultPassword = (row.rollNo || email.split("@")[0] || "student").trim();
      const hashed = await bcrypt.hash(defaultPassword, 10);
      const user = await User.create({
        name,
        email,
        password: hashed,
        role: "student",
        collegeId: req.user.collegeId || null,
        department: (row.department || "").trim(),
        year: (row.year || "").trim(),
        rollNo: (row.rollNo || "").trim(),
      });
      created.push({ id: user._id, email, defaultPassword });
    }

    res.json({
      createdCount: created.length,
      skippedCount: skipped.length,
      created,
      skipped,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/students/export.csv
export const exportStudentsCsv = async (req, res) => {
  try {
    const scope = buildStudentScope(req);
    const students = await User.find(scope)
      .select("name email department year rollNo")
      .lean();
    const ids = students.map((s) => s._id);
    const resumes = await Resume.find({ userId: { $in: ids } })
      .select("userId resumeScore")
      .lean();

    const bestByUser = {};
    for (const r of resumes) {
      const uid = String(r.userId);
      const sc = r.resumeScore?.overall || 0;
      if (!bestByUser[uid] || sc > bestByUser[uid]) bestByUser[uid] = sc;
    }

    const escape = (v) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const lines = ["Name,Email,RollNo,Department,Year,ResumeScore,PlacementReady"];
    for (const s of students) {
      const score = bestByUser[String(s._id)] || 0;
      lines.push(
        [
          escape(s.name),
          escape(s.email),
          escape(s.rollNo),
          escape(s.department),
          escape(s.year),
          score,
          score >= 70 ? "Yes" : "No",
        ].join(",")
      );
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="students.csv"'
    );
    res.send(lines.join("\n"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/colleges - list (admin can pick or create one)
export const listColleges = async (_req, res) => {
  try {
    const colleges = await College.find().sort({ name: 1 });
    res.json({ colleges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/colleges - also auto-links the creating admin
export const createCollege = async (req, res) => {
  try {
    const { name, shortName, accentColor, placementCellName } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const college = await College.create({
      name,
      shortName: shortName || "",
      accentColor: accentColor || "#4f46e5",
      placementCellName: placementCellName || "",
    });
    await User.findByIdAndUpdate(req.userId, { collegeId: college._id });
    res.status(201).json({ college });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/me/link-college - link admin to existing college
export const linkCollegeToAdmin = async (req, res) => {
  try {
    const { collegeId } = req.body;
    if (!collegeId)
      return res.status(400).json({ message: "collegeId required" });
    const college = await College.findById(collegeId);
    if (!college)
      return res.status(404).json({ message: "College not found" });
    await User.findByIdAndUpdate(req.userId, { collegeId });
    res.json({ message: "Linked", collegeId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/me - admin's current college + profile
export const getAdminContext = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("name email role collegeId")
      .populate("collegeId");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/departments
export const listDepartments = async (req, res) => {
  try {
    const filter = {};
    if (req.user.collegeId) filter.collegeId = req.user.collegeId;
    const departments = await Department.find(filter).sort({ name: 1 });
    res.json({ departments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/departments
export const createDepartment = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    if (!req.user.collegeId) {
      return res
        .status(400)
        .json({ message: "Admin must be linked to a college first" });
    }
    const dept = await Department.create({
      collegeId: req.user.collegeId,
      name,
      code: code || "",
    });
    res.status(201).json({ department: dept });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Department already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/students/:studentId/resumes - get student's resumes
export const getStudentResumes = async (req, res) => {
  try {
    const { studentId } = req.params;
    const AdminFeedback = (await import("../models/AdminFeedback.js")).default;

    // Verify the student belongs to the admin's college
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure college isolation
    if (String(student.collegeId) !== String(req.user.collegeId)) {
      return res.status(403).json({ message: "Not authorized to view this student's resumes" });
    }

    // Get all resumes for this student
    const resumes = await Resume.find({ userId: studentId })
      .select("_id title resumeScore createdAt updatedAt")
      .sort({ createdAt: -1 });

    // Get feedback for each resume
    const resumeIds = resumes.map(r => r._id);
    const feedbacks = await AdminFeedback.find({ resumeId: { $in: resumeIds } })
      .select("resumeId status");

    const feedbackMap = {};
    feedbacks.forEach(f => {
      feedbackMap[String(f.resumeId)] = f.status;
    });

    // Add feedback status to each resume
    const enriched = resumes.map(r => ({
      ...r.toObject(),
      feedbackStatus: feedbackMap[String(r._id)] || null
    }));

    res.json({ resumes: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/students/:id - delete single student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the student belongs to the admin's college
    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure college isolation
    if (String(student.collegeId) !== String(req.user.collegeId)) {
      return res.status(403).json({ message: "Not authorized to delete this student" });
    }

    // Delete student's resumes first
    await Resume.deleteMany({ userId: id });

    // Delete the student
    await User.findByIdAndDelete(id);

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/students - delete multiple students (bulk)
// body: { studentIds: ["id1", "id2", ...] }
export const deleteStudentsBulk = async (req, res) => {
  try {
    const { studentIds = [] } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "No students provided" });
    }

    // Verify all students belong to the admin's college
    const students = await User.find({ _id: { $in: studentIds } });

    for (const student of students) {
      if (String(student.collegeId) !== String(req.user.collegeId)) {
        return res.status(403).json({ message: "Not authorized to delete some students" });
      }
    }

    // Delete all resumes for these students
    await Resume.deleteMany({ userId: { $in: studentIds } });

    // Delete all students
    const result = await User.deleteMany({ _id: { $in: studentIds } });

    res.json({
      message: "Students deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
