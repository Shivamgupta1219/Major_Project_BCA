import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/Feautes/authSlice";
import {
  BarChart3,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/super-admin", label: "Dashboard", icon: BarChart3, end: true },
  { to: "/super-admin/colleges", label: "Colleges", icon: Building2 },
  { to: "/super-admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/super-admin/analytics", label: "Analytics", icon: TrendingUp },
  { to: "/super-admin/settings", label: "Settings", icon: Settings },
];

export default function SuperAdminLayout() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <Link
          to="/super-admin"
          className="flex items-center gap-2 px-6 py-5 border-b border-slate-100"
        >
          <div className="bg-gradient-to-br from-red-600 to-pink-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">CampusCV</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </Link>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.name || "Super Admin"}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 py-3">
        <Link to="/super-admin" className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-red-600 to-pink-600 p-1.5 rounded-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm">Super Admin</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-red-600"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 inset-x-0 bg-white border-b border-slate-200 z-30 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              onLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors mt-2 border-t border-slate-200 pt-3"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 md:pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  );
}
