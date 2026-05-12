import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoaderCircleIcon } from "lucide-react";
import { Search, Briefcase, TrendingUp, Lightbulb, Target } from "lucide-react";
import {
  FilePenIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
  FileText,
  Award,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";

export default function Dashboard() {
  const colors = [
    "#1e40af", // blue-700
    "#0f766e", // teal-700
    "#4338ca", // indigo-700
    "#0369a1", // sky-700
    "#7c3aed", // violet-700
    "#0891b2", // cyan-700
    "#4f46e5", // indigo-600
    "#0d9488", // teal-600
    "#2563eb", // blue-600
    "#6366f1", // indigo-500
  ];
  const { user, token } = useSelector((state) => state.auth);
  const [allResumes, setAllResumes] = useState([]);
  const [resume, setResume] = useState(null);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [editResumeId, setEditResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  // load all resume
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/resume", {
        headers: { Authorization: token },
      });
      setAllResumes(data.resumes);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load resumes");
    }
  };

  // create resume /save resume
  const createResume = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.post(
        "/api/resume/create",
        { title },
        {
          headers: { Authorization: token },
        }
      );
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch {
      toast.error("Could not create resume");
    }
  };

  const uploadResume = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/upload/resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data.text);
  };

  const uploadResumeHandler = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error("Select file");
    await uploadResume(resume);
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  // delete function
  const deleteResume = async (id) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this resume?");
      if (confirm) {
        await api.delete(`/api/resume/${id}`, {
          headers: { Authorization: token },
        });
        setAllResumes((prev) => prev.filter((r) => r._id !== id));
        toast.success("Resume deleted");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete resume");
    }
  };

  const editTitle = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put(
        `/api/resume/${editResumeId}`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title } : r))
      );

      setTitle("");
      setEditResumeId(null);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="text-slate-600">Manage your resumes and explore career opportunities</p>
        </div>

        {/* Career Tip Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Lightbulb className="text-blue-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2 text-slate-900">
                💡 Career Tip of the Day
              </h2>
              <p className="text-slate-600 leading-relaxed">
                A strong resume doesn't get you a job — it gets you an interview. 
                Focus on skills + real projects that demonstrate your value.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {/* Resumes Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{allResumes.length}</p>
            <p className="text-sm text-slate-600 font-medium">Resumes</p>
          </div>

          {/* Templates Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">5+</p>
            <p className="text-sm text-slate-600 font-medium">Templates</p>
          </div>

          {/* AI Suggestions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-violet-50 rounded-lg">
                <Target className="w-6 h-6 text-violet-600" />
              </div>
              <Lightbulb className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">AI</p>
            <p className="text-sm text-slate-600 font-medium">Suggestions</p>
          </div>

          {/* Jobs Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <Briefcase className="w-6 h-6 text-teal-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">100+</p>
            <p className="text-sm text-slate-600 font-medium">Jobs</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Create Resume */}
            <button
              onClick={() => setShowCreateResume(true)}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <PlusIcon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                  Create Resume
                </p>
              </div>
            </button>

            {/* Upload Existing */}
            <button
              onClick={() => setShowUploadResume(true)}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                  <UploadCloudIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                  Upload Existing
                </p>
              </div>
            </button>

            {/* Search Jobs */}
            <button
              onClick={() => navigate("/app/jobs")}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-teal-200 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                  <Search className="w-6 h-6 text-teal-600" />
                </div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-teal-600 transition-colors">
                  Search Jobs
                </p>
              </div>
            </button>

            {/* Career Path */}
            <button
              onClick={() => navigate("/app/career-path")}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-violet-200 transition-all duration-200 group"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 bg-violet-50 rounded-lg group-hover:bg-violet-100 transition-colors">
                  <Briefcase className="w-6 h-6 text-violet-600" />
                </div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-violet-600 transition-colors">
                  Career Path
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Resume Cards Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Your Resumes</h3>
            {allResumes.length > 0 && (
              <span className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                {allResumes.length} {allResumes.length === 1 ? 'resume' : 'resumes'}
              </span>
            )}
          </div>

          {allResumes.length === 0 ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
              <div className="p-4 bg-slate-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No resumes yet</h3>
              <p className="text-slate-600 mb-6">Create your first resume to get started</p>
              <button
                onClick={() => setShowCreateResume(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {allResumes.map((resume, index) => {
                const baseColor = colors[index % colors.length];

                return (
                  <div key={index} className="group">
                    <button
                      onClick={() => navigate(`/app/builder/${resume._id}`)}
                      className="relative w-full h-56 bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      {/* Subtle Background */}
                      <div
                        className="absolute inset-0 opacity-5"
                        style={{ backgroundColor: baseColor }}
                      ></div>

                      {/* Content */}
                      <div className="relative h-full flex flex-col items-center justify-center p-4">
                        <div
                          className="p-4 rounded-lg mb-3"
                          style={{ backgroundColor: `${baseColor}15` }}
                        >
                          <FilePenIcon
                            className="w-10 h-10"
                            style={{ color: baseColor }}
                          />
                        </div>

                        <p
                          className="text-sm font-semibold text-center px-2 line-clamp-2 mb-2"
                          style={{ color: baseColor }}
                        >
                          {resume.title}
                        </p>

                        <p className="text-xs text-slate-500 text-center">
                          Updated {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-white rounded-lg p-1 shadow-md border border-slate-200"
                      >
                        <button
                          onClick={() => {
                            setTitle(resume.title);
                            setEditResumeId(resume._id);
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                          title="Edit title"
                        >
                          <PencilIcon className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => deleteResume(resume._id)}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal create resume */}
      {showCreateResume && (
        <div
          onClick={() => setShowCreateResume(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={createResume}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-slideUp"
          >
            {/* Header */}
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Create New Resume</h2>
              <p className="text-sm text-slate-600 mt-1">Start building your professional resume</p>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resume Title
              </label>
              <input
                type="text"
                placeholder="e.g., Software Developer Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
                autoFocus
              />

              <button
                type="submit"
                className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Resume
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowCreateResume(false);
                setTitle("");
              }}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5 text-slate-400" />
            </button>
          </form>
        </div>
      )}

      {/* Modal upload resume */}
      {showUploadResume && (
        <div
          onClick={() => setShowUploadResume(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={uploadResumeHandler}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-slideUp"
          >
            {/* Header */}
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Upload Resume</h2>
              <p className="text-sm text-slate-600 mt-1">Import your existing resume</p>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resume Title
              </label>
              <input
                type="text"
                placeholder="e.g., My Professional Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all mb-4"
              />

              <label htmlFor="resume-file" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group">
                  {resume ? (
                    <>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <FileText className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-green-700 font-medium">{resume.name}</p>
                      <p className="text-xs text-slate-500">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <UploadCloud className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="font-medium text-slate-700">Upload PDF Resume</p>
                      <p className="text-xs text-slate-500">Click to browse files</p>
                    </>
                  )}
                </div>
              </label>

              <input
                id="resume-file"
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => setResume(e.target.files[0])}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <LoaderCircleIcon className="animate-spin w-5 h-5" />}
                {isLoading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowUploadResume(false);
                setTitle("");
                setResume(null);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5 text-slate-400" />
            </button>
          </form>
        </div>
      )}

      {/* Modal edit resume */}
      {editResumeId && (
        <div
          onClick={() => setEditResumeId(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={editTitle}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-slideUp"
          >
            {/* Header */}
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Edit Resume Title</h2>
              <p className="text-sm text-slate-600 mt-1">Update your resume title</p>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resume Title
              </label>
              <input
                type="text"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
                autoFocus
              />

              <button
                type="submit"
                className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Update Resume
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setEditResumeId(null);
                setTitle("");
              }}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5 text-slate-400" />
            </button>
          </form>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}