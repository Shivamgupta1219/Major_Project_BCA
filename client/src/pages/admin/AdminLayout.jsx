import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/Feautes/authSlice";
import {
  BarChart3,
  Users,
  Target,
  Upload,
  LogOut,
  Sparkles,
  Settings,
  CreditCard,
  Briefcase,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/placement-drives", label: "Placement Drives", icon: Briefcase },
  { to: "/admin/skill-gap", label: "Skill Gap", icon: Target },
  { to: "/admin/bulk-upload", label: "Bulk Upload", icon: Upload },
  { to: "/admin/subscription", label: "Subscription", icon: CreditCard },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <Link
          to="/admin"
          className="flex items-center gap-2 px-6 py-5 border-b border-slate-100"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">CampusCV</p>
            <p className="text-xs text-slate-500">Admin Console</p>
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
                    ? "bg-indigo-50 text-indigo-700"
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
              {user?.name}
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
        <Link to="/admin" className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-1.5 rounded-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">Admin</span>
        </Link>
        <button
          onClick={onLogout}
          className="p-2 text-slate-600 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 md:pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  );
}
