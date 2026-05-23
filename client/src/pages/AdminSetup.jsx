import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../app/Feautes/authSlice";
import api from "../configs/api";
import { toast } from "react-toastify";
import { AlertCircle, CheckCircle2, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function AdminSetup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const collegeId = searchParams.get("id");
  const [collegeName, setCollegeName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Verify college exists
  useEffect(() => {
    if (!collegeId) {
      setError("No College ID provided. Please use the link from your super admin.");
      setLoading(false);
      return;
    }

    const verifyCollege = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/super-admin/colleges`);
        const college = data.colleges?.find((c) => c._id === collegeId);

        if (!college) {
          setError("College ID not found. Please check and try again.");
          return;
        }

        setCollegeName(college.name);
        setError(null);
      } catch (err) {
        setError("Failed to verify college. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    verifyCollege();
  }, [collegeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      // Create admin account via dedicated setup endpoint
      const { data } = await api.post("/api/super-admin/admin-setup", {
        collegeId: collegeId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Auto-login
      dispatch(loginAction(data));
      localStorage.setItem("token", data.token);

      toast.success("Account created! Welcome to your admin dashboard.");

      // Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create account");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying college...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black p-4">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-200 mb-6"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Setup Failed</h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => navigate("/")}
                  className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-700/60 rounded-2xl px-8 py-10 shadow-2xl shadow-black/40"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-green-50 rounded-lg mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-white text-3xl font-semibold tracking-wide">
            Complete Setup
          </h1>
          <p className="text-gray-400 text-sm mt-2">Create your admin account</p>
        </div>

        {/* College Info */}
        <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-400 mb-1">College</p>
          <p className="text-gray-200 font-semibold">{collegeName}</p>
          <p className="text-xs text-gray-500 mt-1 font-mono break-all">{collegeId}</p>
        </div>

        {/* Name */}
        <div className="flex items-center mt-6 w-full bg-gray-800/70 border border-gray-700 h-12 rounded-full pl-6 gap-2 focus-within:ring-2 focus-within:ring-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-green-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            className="bg-transparent w-full text-gray-200 placeholder-gray-500 outline-none border-none"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center mt-4 w-full bg-gray-800/70 border border-gray-700 h-12 rounded-full pl-6 gap-2 focus-within:ring-2 focus-within:ring-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-gray-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
          </svg>
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            className="bg-transparent w-full text-gray-200 placeholder-gray-500 outline-none border-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center mt-4 w-full bg-gray-800/70 border border-gray-700 h-12 rounded-full pl-6 pr-4 gap-2 focus-within:ring-2 focus-within:ring-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-gray-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create strong password (min 8 chars)"
            className="bg-transparent w-full text-gray-200 placeholder-gray-500 outline-none border-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex items-center mt-4 w-full bg-gray-800/70 border border-gray-700 h-12 rounded-full pl-6 pr-4 gap-2 focus-within:ring-2 focus-within:ring-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-gray-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            className="bg-transparent w-full text-gray-200 placeholder-gray-500 outline-none border-none"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full h-11 rounded-full bg-linear-to-r from-green-500 to-emerald-600 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-green-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Creating Account...
            </>
          ) : (
            "Complete Setup & Login"
          )}
        </button>

        {/* Help Text */}
        <p className="text-gray-400 text-xs mt-4 text-center">
          After setup, you can login with your email and password anytime at{" "}
          <span className="text-green-400">/login</span>
        </p>
      </form>
    </div>
  );
}
