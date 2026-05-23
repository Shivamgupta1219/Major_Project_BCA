import PlacementDrive from "../models/PlacementDrive.js";
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import ActivityLog from "../models/ActivityLog.js";

// GET /api/placement-drives
export const listPlacementDrives = async (req, res) => {
  try {
    const collegeId = req.user?.collegeId;
    const { status, sort = "driveDate" } = req.query;

    const filter = { collegeId };
    if (status) filter.status = status;

    const drives = await PlacementDrive.find(filter)
      .sort({ [sort]: -1 })
      .populate("createdBy", "name email")
      .populate("registeredStudents", "name email rollNo")
      .populate("selectedStudents", "name email rollNo");

    res.json({ drives });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placement-drives/:driveId
export const getPlacementDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const collegeId = req.user?.collegeId;

    const drive = await PlacementDrive.findOne({ _id: driveId, collegeId })
      .populate("createdBy", "name email")
      .populate("registeredStudents", "name email rollNo department")
      .populate("selectedStudents", "name email rollNo department");

    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    res.json({ drive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/placement-drives
export const createPlacementDrive = async (req, res) => {
  try {
    const collegeId = req.user?.collegeId;
    const userId = req.userId;
    const {
      title,
      description,
      companyName,
      jobTitle,
      jobDescription,
      ctc,
      noOfPositions,
      driveDate,
      registrationDeadline,
      location,
      rounds,
      eligibilityCriteria,
    } = req.body;

    if (!title || !companyName || !jobTitle || !driveDate || !registrationDeadline) {
      return res
        .status(400)
        .json({ message: "Missing required fields" });
    }

    const drive = await PlacementDrive.create({
      collegeId,
      createdBy: userId,
      title,
      description,
      companyName,
      jobTitle,
      jobDescription,
      ctc,
      noOfPositions,
      driveDate,
      registrationDeadline,
      location,
      rounds: rounds || [],
      eligibilityCriteria: eligibilityCriteria || {},
      status: "draft",
    });

    // Log activity
    await ActivityLog.create({
      userId,
      collegeId,
      action: "placement_drive_created",
      details: `Placement drive created: ${title} by ${companyName}`,
    });

    res.status(201).json({ drive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/placement-drives/:driveId
export const updatePlacementDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const collegeId = req.user?.collegeId;
    const userId = req.userId;

    const drive = await PlacementDrive.findOne({ _id: driveId, collegeId });
    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    // Update allowed fields
    const allowedFields = [
      "title",
      "description",
      "jobDescription",
      "ctc",
      "noOfPositions",
      "driveDate",
      "registrationDeadline",
      "location",
      "rounds",
      "eligibilityCriteria",
      "status",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        drive[field] = req.body[field];
      }
    }

    await drive.save();

    // Log activity
    await ActivityLog.create({
      userId,
      collegeId,
      action: "placement_drive_updated",
      details: `Placement drive updated: ${drive.title}`,
    });

    res.json({ drive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/placement-drives/:driveId/register
export const registerForDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const userId = req.userId;
    const collegeId = req.user?.collegeId;

    const drive = await PlacementDrive.findOne({ _id: driveId, collegeId });
    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    // Check registration deadline
    if (new Date() > new Date(drive.registrationDeadline)) {
      return res.status(400).json({ message: "Registration deadline passed" });
    }

    // Check if already registered
    if (drive.registeredStudents.includes(userId)) {
      return res.status(400).json({ message: "Already registered for this drive" });
    }

    // Check eligibility
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (
      drive.eligibilityCriteria.minCGPA &&
      student.cgpa < drive.eligibilityCriteria.minCGPA
    ) {
      return res
        .status(400)
        .json({
          message: `Minimum CGPA required: ${drive.eligibilityCriteria.minCGPA}`,
        });
    }

    drive.registeredStudents.push(userId);
    await drive.save();

    // Log activity
    await ActivityLog.create({
      userId,
      collegeId,
      action: "drive_registered",
      details: `Registered for ${drive.title} by ${drive.companyName}`,
    });

    res.json({ message: "Registered successfully", drive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/placement-drives/:driveId/select-students
export const selectStudents = async (req, res) => {
  try {
    const { driveId } = req.params;
    const { studentIds } = req.body;
    const collegeId = req.user?.collegeId;
    const userId = req.userId;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "Invalid student list" });
    }

    const drive = await PlacementDrive.findOne({ _id: driveId, collegeId });
    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    // Set selected students
    drive.selectedStudents = studentIds;
    drive.status = "completed";
    await drive.save();

    // Log activity
    await ActivityLog.create({
      userId,
      collegeId,
      action: "students_selected",
      details: `${studentIds.length} students selected for ${drive.title}`,
    });

    res.json({ message: "Students selected successfully", drive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/placement-drives/:driveId
export const deletePlacementDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const collegeId = req.user?.collegeId;
    const userId = req.userId;

    const drive = await PlacementDrive.findOneAndDelete({ _id: driveId, collegeId });
    if (!drive) {
      return res.status(404).json({ message: "Placement drive not found" });
    }

    // Log activity
    await ActivityLog.create({
      userId,
      collegeId,
      action: "placement_drive_deleted",
      details: `Placement drive deleted: ${drive.title}`,
    });

    res.json({ message: "Placement drive deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placement-drives/student/my-drives
export const getMyRegisteredDrives = async (req, res) => {
  try {
    const userId = req.userId;
    const collegeId = req.user?.collegeId;

    const drives = await PlacementDrive.find({
      collegeId,
      registeredStudents: userId,
      status: { $in: ["open", "closed", "completed"] },
    })
      .select("title companyName jobTitle driveDate ctc status")
      .sort({ driveDate: -1 });

    res.json({ drives });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/placement-drives/student/upcoming
export const getUpcomingDrives = async (req, res) => {
  try {
    const collegeId = req.user?.collegeId;

    const drives = await PlacementDrive.find({
      collegeId,
      status: "open",
      registrationDeadline: { $gte: new Date() },
    })
      .select(
        "title companyName jobTitle driveDate registrationDeadline ctc noOfPositions location"
      )
      .sort({ registrationDeadline: 1 });

    res.json({ drives });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
