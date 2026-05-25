import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/Feautes/authSlice";
import { BarChart3, Users, CheckCircle, LogOut, Sparkles, Briefcase } from "lucide-react";

const navItems = [
  { to: "/faculty", label: "Dashboard", icon: BarChart3, end: true },
  { to: "/faculty/reviews", label: "Reviews", icon: CheckCircle },
  { to: "/faculty/placement-drives", label: "Placement Drives", icon: Briefcase },
  { to: "/faculty/students", label: "Students", icon: Users },
];

export default function FacultyLayout() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <Link
          to="/faculty"
          className="flex items-center gap-2 px-6 py-5 border-b border-slate-100"
        >
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">CampusCV</p>
            <p className="text-xs text-slate-500">Faculty</p>
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
                    ? "bg-purple-50 text-purple-700"
                    : "text-slate-600 hover:bg-slate-50"
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
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
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

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
