import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/Feautes/authSlice";
import api from "../configs/api";
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
  CheckCircle2,
  Trash2,
} from "lucide-react";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotif, setIsLoadingNotif] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const logoutUser = () => {
    dispatch(logout());
    navigate("/");
    setShowDropdown(false);
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setIsLoadingNotif(true);
    try {
      const { data } = await api.get("/api/notifications");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoadingNotif(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications when notification bell is clicked
  useEffect(() => {
    if (showNotifications && notifications.length === 0) {
      fetchNotifications();
    }
  }, [showNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "resume_created":
      case "resume_updated":
        return "📄";
      case "job_match":
        return "🎯";
      case "achievement":
        return "🏆";
      default:
        return "🔔";
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Gradient line at top */}
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600"></div>

      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            Campus<span className="font-extrabold">CV</span>
          </span>
        </Link>

        {/* Center Navigation - Desktop Only */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 rounded-full p-1">
          <Link
            to="/app"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to="/app/jobs"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all duration-200"
          >
            <Briefcase className="w-4 h-4" />
            Jobs
          </Link>
          <Link
            to="/app/career-path"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            Career Path
          </Link>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-slideDown max-h-[500px] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Notifications</h3>
                      <p className="text-xs text-indigo-100">
                        {unreadCount > 0 ? `${unreadCount} new update${unreadCount !== 1 ? "s" : ""}` : "All caught up"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          const unreadIds = notifications
                            .filter((n) => !n.read)
                            .map((n) => n._id);
                          unreadIds.forEach((id) => markAsRead(id));
                        }}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {isLoadingNotif ? (
                    <div className="p-6 text-center text-slate-500">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      <p className="mt-2 text-sm">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`border-b border-slate-100 p-3 hover:bg-slate-50 transition-colors cursor-pointer group ${
                          !notif.read ? "bg-indigo-50/30" : ""
                        }`}
                        onClick={() => !notif.read && markAsRead(notif._id)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl flex-shrink-0">
                            {getNotificationIcon(notif.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 line-clamp-1">
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                              {notif.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatTime(notif.createdAt)}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-slate-100 text-center flex-shrink-0 bg-slate-50">
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      View all notifications
                    </button>
                  </div>
                )}
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
                Hi,{" "}
                <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {user?.name || "User"}
                </span>
              </p>

              {/* Avatar */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-500 text-white flex items-center justify-center rounded-full font-bold shadow-lg text-sm ring-2 ring-white">
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

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-slideDown">
                {/* User Info Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center rounded-full font-bold text-lg ring-2 ring-white/30">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.name || "User"}</p>
                      <p className="text-xs text-indigo-100">{user?.email || "user@example.com"}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <Link
                    to="/app/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">My Profile</p>
                      <p className="text-xs text-slate-500">View and edit profile</p>
                    </div>
                  </Link>

                  <Link
                    to="/app/resumes"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-purple-600 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">My Resumes</p>
                      <p className="text-xs text-slate-500">Manage your resumes</p>
                    </div>
                  </Link>

                  <Link
                    to="/app/settings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-cyan-600 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                      <Settings className="w-4 h-4 text-cyan-600" />
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

          {/* Mobile Logout Button */}
          <button
            onClick={logoutUser}
            className="lg:hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Custom Styles */}
      <style>{`
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
