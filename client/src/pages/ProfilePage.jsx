import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { User, Mail, Calendar, FileText, Pencil, Check, X, Shield, LogOut } from "lucide-react";
import api from "../configs/api";
import { login } from "../app/Feautes/authSlice";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [resumeCount, setResumeCount] = useState(0);

  useEffect(() => {
    api.get("/api/resume").then(({ data }) => {
      setResumeCount(data.resumes?.length || 0);
    }).catch(() => {});
  }, []);

  const saveProfile = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");
    setIsSaving(true);
    try {
      const { data } = await api.put("/api/users/update", { name: name.trim() });
      dispatch(login({ token, user: data.user }));
      toast.success("Profile updated!");
      setEditingName(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setName(user?.name || "");
    setEditingName(false);
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-500">Manage your personal information and account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden mb-6">
          {/* Gradient Header */}
          <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>

          {/* Content */}
          <div className="relative px-6 sm:px-8 py-8">
            {/* Avatar - Positioned over gradient */}
            <div className="absolute -top-12 left-6 sm:left-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-50 blur"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl ring-4 ring-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="ml-0 sm:ml-40">
              {/* Name Section */}
              <div className="mb-6">
                {editingName ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveProfile()}
                      className="text-3xl font-bold border-2 border-indigo-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
                    />
                    <button
                      onClick={saveProfile}
                      disabled={isSaving}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      <Check size={20} />
                    </button>
                    <button onClick={cancelEdit} className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-slate-900">{user?.name}</h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                      title="Edit name"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail size={16} />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{resumeCount}</p>
                  <p className="text-xs text-slate-500 mt-1">Resumes Created</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{memberSince}</p>
                  <p className="text-xs text-slate-500 mt-1">Member Since</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Free Plan</p>
                  <p className="text-xs text-slate-500 mt-1">Account Type</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings Cards */}
        <div className="space-y-4">
          {/* Security Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Security & Password</h3>
                  <p className="text-sm text-slate-500">Change your password and manage security settings</p>
                </div>
              </div>
              <Link
                to="/app/settings"
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium text-sm transition-colors"
              >
                Manage
              </Link>
            </div>
          </div>

          {/* Resumes Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">My Resumes</h3>
                  <p className="text-sm text-slate-500">View, edit, and manage all your resumes</p>
                </div>
              </div>
              <Link
                to="/app/resumes"
                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg font-medium text-sm transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
        </div>

        {/* Account Info Section */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200/80 shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Account Information
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-slate-200">
              <span className="text-sm font-medium text-slate-500 mb-1 sm:mb-0">Full Name</span>
              <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-slate-200">
              <span className="text-sm font-medium text-slate-500 mb-1 sm:mb-0">Email Address</span>
              <span className="text-sm font-semibold text-slate-900">{user?.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
              <span className="text-sm font-medium text-slate-500 mb-1 sm:mb-0">Account Status</span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
