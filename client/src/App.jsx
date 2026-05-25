import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Preview from "./pages/Preview";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/Resumebuilder";
import Login from "./pages/Login";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import CareerPath from "./Components/CareerPath";
import Jobs from "./Components/Jobs";
import ProfilePage from "./pages/ProfilePage";
import MyResumesPage from "./pages/MyResumesPage";
import SettingsPage from "./pages/SettingsPage";
import api from "./configs/api";
import { login, setLoading } from "./app/Feautes/authSlice";
import RequireRole from "./Components/RequireRole";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminSkillGap from "./pages/admin/AdminSkillGap";
import AdminBulkUpload from "./pages/admin/AdminBulkUpload";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSubscription from "./pages/admin/AdminSubscription";
import SuperAdminLayout from "./pages/superadmin/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminColleges from "./pages/superadmin/SuperAdminColleges";
import SuperAdminSubscriptions from "./pages/superadmin/SuperAdminSubscriptions";
import SuperAdminAnalytics from "./pages/superadmin/SuperAdminAnalytics";
import SuperAdminSettings from "./pages/superadmin/SuperAdminSettings";
import FacultyLayout from "./pages/faculty/FacultyLayout";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import ReviewResumes from "./pages/faculty/ReviewResumes";
import ReviewDetail from "./pages/faculty/ReviewDetail";
import Students from "./pages/faculty/Students";
import FacultyPlacementDrives from "./pages/faculty/PlacementDrives";
import PlacementDriveForm from "./pages/faculty/PlacementDriveForm";
import PlacementDriveDetail from "./pages/faculty/PlacementDriveDetail";
import AdminPlacementDrives from "./pages/admin/AdminPlacementDrives";
import AdminPlacementDriveDetail from "./pages/admin/AdminPlacementDriveDetail";
import CoverLetterGenerator from "./pages/advanced-ai/CoverLetterGenerator";
import LinkedInOptimizer from "./pages/advanced-ai/LinkedInOptimizer";
import InterviewPrep from "./pages/advanced-ai/InterviewPrep";
import JobMatcher from "./pages/advanced-ai/JobMatcher";
import PlacementDrives from "./pages/PlacementDrives";
import AdminSetup from "./pages/AdminSetup";

export default function App() {
  const dispatch = useDispatch();
  const getUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    try {
      const { data } = await api.get("/api/users/data", {
        headers: { Authorization: token },
      });

      if (data.user) {
        dispatch(login({ token, user: data.user }));
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        closeOnClick
        draggable
        theme="light"
      />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
           <Route path="career-path" element={<CareerPath />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="resumes" element={<MyResumesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="cover-letter" element={<CoverLetterGenerator />} />
          <Route path="linkedin-optimizer" element={<LinkedInOptimizer />} />
          <Route path="interview-prep" element={<InterviewPrep />} />
          <Route path="job-matcher" element={<JobMatcher />} />
          <Route path="placement-drives" element={<PlacementDrives />} />
        </Route>

       

        <Route
          path="/super-admin"
          element={
            <RequireRole roles={["super_admin"]}>
              <SuperAdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="colleges" element={<SuperAdminColleges />} />
          <Route path="subscriptions" element={<SuperAdminSubscriptions />} />
          <Route path="analytics" element={<SuperAdminAnalytics />} />
          <Route path="settings" element={<SuperAdminSettings />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireRole roles={["admin"]}>
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="placement-drives" element={<AdminPlacementDrives />} />
          <Route path="placement-drives/create" element={<PlacementDriveForm />} />
          <Route path="placement-drives/edit/:driveId" element={<PlacementDriveForm />} />
          <Route path="placement-drives/:driveId" element={<AdminPlacementDriveDetail />} />
          <Route path="skill-gap" element={<AdminSkillGap />} />
          <Route path="bulk-upload" element={<AdminBulkUpload />} />
          <Route path="subscription" element={<AdminSubscription />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route
          path="/faculty"
          element={
            <RequireRole roles={["faculty"]}>
              <FacultyLayout />
            </RequireRole>
          }
        >
          <Route index element={<FacultyDashboard />} />
          <Route path="reviews" element={<ReviewResumes />} />
          <Route path="reviews/:reviewId" element={<ReviewDetail />} />
          <Route path="students" element={<Students />} />
          <Route path="placement-drives" element={<FacultyPlacementDrives />} />
          <Route path="placement-drives/create" element={<PlacementDriveForm />} />
          <Route path="placement-drives/edit/:driveId" element={<PlacementDriveForm />} />
          <Route path="placement-drives/:driveId" element={<PlacementDriveDetail />} />
        </Route>

        <Route path="/view/:resumeId" element={<Preview />} />

        <Route path="/admin-setup" element={<AdminSetup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
