import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AlertCircle, TrendingUp, Users, FileText, Zap } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SuperAdminAnalytics = () => {
  const { token } = useSelector((s) => s.auth);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Try to fetch analytics endpoint first
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/super-admin/analytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDashboard(data);
          return;
        }
      } catch (analyticsErr) {
        console.warn("Analytics endpoint failed, trying dashboard fallback", analyticsErr);
      }

      // Fallback to dashboard data
      const dashboardResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/super-admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!dashboardResponse.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await dashboardResponse.json();
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
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

  const stats = dashboard?.stats || {};
  const subscriptionPlans = dashboard?.subscriptionPlans || [];

  // Sample data for charts (in real app, this would come from backend)
  const chartData = [
    { name: "Week 1", resumes: 45, colleges: 12 },
    { name: "Week 2", resumes: 52, colleges: 15 },
    { name: "Week 3", resumes: 48, colleges: 14 },
    { name: "Week 4", resumes: 61, colleges: 18 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">System-wide statistics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Colleges</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats.totalColleges || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Colleges</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.activeColleges || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Students</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.totalStudents || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Resumes</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {stats.totalResumes || 0}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Resume Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="resumes" stroke="#7c3aed" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">College Onboarding</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="colleges" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan Distribution */}
      {subscriptionPlans.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Subscription Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan._id} className="border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 capitalize">{plan._id} Plan</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{plan.count}</p>
                <p className="text-xs text-slate-500 mt-2">
                  Revenue: ₹{(plan.totalAmount / 100).toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Resume Completion</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-slate-600">Completion Rate</p>
                <p className="text-sm font-semibold text-slate-900">
                  {stats.resumeCompletion || 0}%
                </p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${stats.resumeCompletion || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Revenue</h3>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-green-600">
              ₹{(stats.monthlyRevenue / 100000).toFixed(1)}L
            </p>
            <p className="text-sm text-slate-600">
              From {stats.activeSubscriptions || 0} active subscriptions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAnalytics;
