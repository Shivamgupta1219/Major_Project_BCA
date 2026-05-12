import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/Feautes/authSlice";
import {
  LogOut,
  User,
  Settings,
  FileText,
  Bell,
  ChevronDown,
  Sparkles,
  Home,
  Briefcase,
} from "lucide-react";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const logoutUser = () => {
    dispatch(logout());
    navigate("/");
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Gradient line at top */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600"></div>

      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        {/* 🔥 LOGO with enhanced design */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            Campus<span className="font-extrabold">CV</span>
          </span>
        </Link>

        {/* Center Navigation - Desktop Only */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 rounded-full p-1">
          <Link
            to="/app"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all duration-200"
          >
            <Home className="w-4 h-4" />
           Home
          </Link>
          <Link
            to="/app/jobs"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all duration-200"
          >
            <Briefcase className="w-4 h-4" />
            Jobs
          </Link>
          <Link
            to="/app/career-path"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-purple-600 hover:shadow-sm transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            Career Path
          </Link>
        </div>

        {/* 👤 USER SECTION */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-slideDown">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-xs text-purple-100">You have 2 new updates</p>
                </div>
                <div className="p-2 max-h-96 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-slate-800">Resume updated successfully</p>
                    <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <p className="text-sm font-medium text-slate-800">New job matches found</p>
                    <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-100 text-center">
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Section */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-all duration-200 group"
            >
              {/* Username - Desktop Only */}
              <p className="hidden sm:block text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                Hi, <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {user?.name || "User"}
                </span>
              </p>

              {/* Enhanced Avatar */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 text-white flex items-center justify-center rounded-full font-bold shadow-lg text-sm ring-2 ring-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>

              {/* Dropdown Arrow */}
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Enhanced Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-slideDown">
                {/* User Info Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center rounded-full font-bold text-lg ring-2 ring-white/30">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.name || "User"}</p>
                      <p className="text-xs text-purple-100">{user?.email || "user@example.com"}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <Link
                    to="/app/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-purple-600 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">My Profile</p>
                      <p className="text-xs text-slate-500">View and edit profile</p>
                    </div>
                  </Link>

                  <Link
                    to="/app/resumes"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">My Resumes</p>
                      <p className="text-xs text-slate-500">Manage your resumes</p>
                    </div>
                  </Link>

                  <Link
                    to="/app/settings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-green-600 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Settings className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Settings</p>
                      <p className="text-xs text-slate-500">Preferences and privacy</p>
                    </div>
                  </Link>

                  <hr className="my-2 border-slate-200" />

                  <button
                    onClick={logoutUser}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-slate-700 hover:text-red-600 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">Logout</p>
                      <p className="text-xs text-slate-500">Sign out of your account</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Logout Button - Simplified */}
          <button
            onClick={logoutUser}
            className="lg:hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Custom Styles */}
      <style >{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Navbar;