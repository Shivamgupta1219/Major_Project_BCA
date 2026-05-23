import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  BarChart3
} from "lucide-react";

const FacultyDashboard = () => {
  const { token } = useSelector((s) => s.auth);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const stats = [
    {
      label: "Pending Reviews",
      value: dashboard.pendingReviews || 0,
      icon: Clock,
      color: "bg-amber-50",
      textColor: "text-amber-700",
      iconColor: "text-amber-600",
      trend: "Waiting for your action",
    },
    {
      label: "Assigned Students",
      value: dashboard.assignedStudents || 0,
      icon: Users,
      color: "bg-blue-50",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
      trend: "Students submitting resumes",
    },
    {
      label: "Approved Resumes",
      value: dashboard.approvedResumes || 0,
      icon: CheckCircle2,
      color: "bg-green-50",
      textColor: "text-green-700",
      iconColor: "text-green-600",
      trend: "Ready for placement",
    },
    {
      label: "Needs Improvement",
      value: dashboard.needsImprovement || 0,
      icon: AlertCircle,
      color: "bg-red-50",
      textColor: "text-red-700",
      iconColor: "text-red-600",
      trend: "Resumes being improved",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Faculty Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's your review overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, textColor, iconColor, trend }) => (
          <div
            key={label}
            className={`${color} rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{label}</p>
                <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
                <p className="text-xs text-slate-500 mt-3">{trend}</p>
              </div>
              <div className={`${iconColor} p-3 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Average Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Average Resume Score</h3>
              <p className="text-sm text-slate-500">Among your assigned students</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-bold text-purple-600">
              {dashboard.avgScore || "0.0"}
            </div>
            <p className="text-sm text-slate-600 mt-2">out of 100</p>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((parseFloat(dashboard.avgScore || 0) / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/faculty/reviews?status=pending"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900">Review Pending</p>
                <p className="text-xs text-slate-500">View resumes awaiting your review</p>
              </div>
            </a>

            <a
              href="/faculty/students"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900">View Students</p>
                <p className="text-xs text-slate-500">Check assigned students and their progress</p>
              </div>
            </a>

            <a
              href="/faculty/reviews"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="bg-green-100 p-2 rounded-lg">
                <BarChart3 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900">View All Reviews</p>
                <p className="text-xs text-slate-500">See your complete review history</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Empty State Message */}
      {dashboard.pendingReviews === 0 && dashboard.assignedStudents === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-900 font-medium">No resumes to review yet</p>
          <p className="text-sm text-blue-700 mt-1">
            Resumes will appear here once students submit them for your review.
          </p>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
