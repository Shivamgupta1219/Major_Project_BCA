import Resume from "../models/Resume.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";

// GET /api/faculty/dashboard
export const getDashboard = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const facultyId = req.userId;

    // Get assigned students
    const assignedStudents = await User.countDocuments({
      collegeId,
      _id: { $in: [] }, // This will be populated via faculty assignment
    });

    // Get reviews data
    const pendingReviews = await Review.countDocuments({
      facultyId,
      status: "pending",
    });

    const approvedResumes = await Review.countDocuments({
      facultyId,
      status: "approved",
    });

    const needsImprovement = await Review.countDocuments({
      facultyId,
      status: "needs_improvement",
    });

    // Get all students in college, then their resumes
    const collegeStudentIds = await User.find({ collegeId, role: "student" })
      .select("_id")
      .lean();
    const studentIds = collegeStudentIds.map((s) => s._id);

    const avgScore = await Resume.aggregate([
      {
        $match: {
          userId: { $in: studentIds },
          "resumeScore.overall": { $gt: 0 },
        },
      },
      { $group: { _id: null, avg: { $avg: "$resumeScore.overall" } } },
    ]);

    res.json({
      assignedStudents,
      pendingReviews,
      approvedResumes,
      needsImprovement,
      avgScore: avgScore[0]?.avg?.toFixed(2) || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/faculty/reviews?status=pending
export const getReviews = async (req, res) => {
  try {
    const facultyId = req.userId;
    const collegeId = req.user.collegeId;
    const { status = "pending", sort = "createdAt" } = req.query;

    const filter = { facultyId, collegeId };
    if (status) filter.status = status;

    const reviews = await Review.find(filter)
      .populate("studentId", "name email")
      .populate("resumeId", "title resumeScore submittedAt")
      .sort({ [sort]: -1 });

    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/faculty/reviews/:reviewId
export const getReviewDetail = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const facultyId = req.userId;

    const review = await Review.findOne({ _id: reviewId, facultyId })
      .populate("studentId", "name email rollNo")
      .populate("resumeId")
      .populate("facultyId", "name email");

    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/faculty/reviews/:reviewId/submit
export const submitReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comments, sectionComments, status, privateNotes } = req.body;
    const facultyId = req.userId;

    if (!["under_review", "needs_improvement", "approved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const review = await Review.findOne({ _id: reviewId, facultyId });
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.comments = comments || review.comments;
    review.sectionComments = sectionComments || review.sectionComments;
    review.status = status;
    review.privateNotes = privateNotes || review.privateNotes;
    review.reviewedAt = new Date();

    await review.save();

    // Update resume status based on review
    const updateData = { reviewStatus: status };
    if (status === "approved") {
      updateData.isPlacementReady = true;
    }

    await Resume.findByIdAndUpdate(review.resumeId, updateData);

    // Log activity
    await ActivityLog.create({
      userId: facultyId,
      collegeId: review.collegeId,
      action: "resume_reviewed",
      details: `Resume reviewed and marked as ${status}`,
    });

    res.json({ review, message: "Review submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/faculty/students
export const getAssignedStudents = async (req, res) => {
  try {
    const facultyId = req.userId;
    const collegeId = req.user.collegeId;

    // Get all resumes submitted by students to this faculty
    const reviews = await Review.find({ facultyId, collegeId })
      .populate("studentId", "name email rollNo department")
      .distinct("studentId");

    const students = await User.find({
      _id: { $in: reviews },
      collegeId,
    }).select("name email rollNo department");

    // Enrich with review status
    const enriched = await Promise.all(
      students.map(async (s) => {
        const review = await Review.findOne({
          studentId: s._id,
          facultyId,
        }).select("status");
        return { ...s.toObject(), reviewStatus: review?.status || "none" };
      })
    );

    res.json({ students: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/faculty/student-progress/:studentId
export const getStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const facultyId = req.userId;
    const collegeId = req.user.collegeId;

    // Verify student belongs to this college
    const student = await User.findById(studentId);
    if (!student || student.collegeId.toString() !== collegeId.toString()) {
      return res.status(403).json({ message: "Not authorized to view this student" });
    }

    const reviews = await Review.find({
      studentId,
      facultyId,
    })
      .populate("resumeId", "title resumeScore reviewStatus")
      .sort({ createdAt: -1 });

    const latestResume = await Resume.findOne({
      userId: studentId,
    })
      .select("title resumeScore reviewStatus")
      .sort({ createdAt: -1 });

    res.json({ reviews, latestResume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
