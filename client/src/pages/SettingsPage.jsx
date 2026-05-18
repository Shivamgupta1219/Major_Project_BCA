import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Lock, Shield, LogOut, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import api from "../configs/api";
import { logout } from "../app/Feautes/authSlice";
import { useNavigate } from "react-router-dom";

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-11 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match");
    }
    if (passwords.new.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    setIsSaving(true);
    try {
      const { data } = await api.put("/api/users/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      toast.success(data.message);
      setPasswords({ current: "", new: "", confirm: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Manage your account security and preferences</p>
        </div>

        {/* Account Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Account Information</h2>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
              <span className="text-sm font-medium text-slate-500 mb-1 sm:mb-0">Full Name</span>
              <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
              <span className="text-sm font-medium text-slate-500 mb-1 sm:mb-0">Email Address</span>
              <span className="text-sm font-semibold text-slate-900">{user?.email}</span>
            </div>

            {/* Plan */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-slate-500 mb-1 sm:mb-0">Plan</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                Free Plan
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
          </div>

          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Password changed successfully!
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <PasswordField
              label="Current Password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              placeholder="Enter your current password"
            />

            <PasswordField
              label="New Password"
              value={passwords.new}
              onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
              placeholder="At least 6 characters"
            />

            <PasswordField
              label="Confirm New Password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="Re-enter your new password"
            />

            <button
              type="submit"
              disabled={isSaving || !passwords.current || !passwords.new || !passwords.confirm}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Updating Password..." : "Update Password"}
            </button>

            <p className="text-xs text-slate-500 text-center">
              Make sure your password is at least 6 characters long and contains a mix of letters and numbers.
            </p>
          </form>
        </div>

        {/* Logout Card */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200/80 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-900">Logout</h2>
          </div>

          <p className="text-sm text-red-700 mb-4">
            Sign out of your account on this device. You can log back in at any time with your email and password.
          </p>

          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
