import express from "express";
import protect, { requireRole } from "../middlewares/authMiddleware.js";
import {
  getDashboard,
  listStudents,
  getSkillGap,
  bulkCreateStudents,
  exportStudentsCsv,
  deleteStudent,
  deleteStudentsBulk,
  listColleges,
  createCollege,
  listDepartments,
  createDepartment,
  linkCollegeToAdmin,
  getAdminContext,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.use(protect, requireRole("admin"));

adminRouter.get("/dashboard", getDashboard);
adminRouter.get("/students", listStudents);
adminRouter.get("/students/export.csv", exportStudentsCsv);
adminRouter.post("/students/bulk", bulkCreateStudents);
adminRouter.delete("/students/bulk", deleteStudentsBulk);
adminRouter.delete("/students/:id", deleteStudent);
adminRouter.get("/skill-gap", getSkillGap);
adminRouter.get("/colleges", listColleges);
adminRouter.post("/colleges", createCollege);
adminRouter.get("/departments", listDepartments);
adminRouter.post("/departments", createDepartment);
adminRouter.get("/me", getAdminContext);
adminRouter.put("/me/link-college", linkCollegeToAdmin);

export default adminRouter;
