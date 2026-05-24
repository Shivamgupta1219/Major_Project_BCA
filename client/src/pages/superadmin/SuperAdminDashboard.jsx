import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const StatCard = ({ icon: Icon, label, value, hint, color }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    <p className="text-sm text-slate-600 mt-1">{label}</p>
    {hint && <p className="text-xs text-slate-400 mt-2">{hint}</p>}
  </div>
);

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/super-admin/dashboard");
        setData(data);
      } catch (e) {
        toast.error(e?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <LoaderCircle className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-slate-600">No data available.</p>
      </div>
    );
  }

  const { stats, subscriptionPlans, expiringSoon, recentActivity } = data;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Platform Overview
        </h1>
        <p className="text-slate-600 mt-1">
          Real-time SaaS platform metrics and analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={Building2}
          label="Total Colleges"
          value={stats.totalColleges}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Building2}
          label="Active Colleges"
          value={stats.activeColleges}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents}
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          icon={FileText}
          label="Total Resumes"
          value={stats.totalResumes}
          color="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString()}`}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Subscription Plans */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Active Subscriptions by Plan
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.subscriptionPlans || []}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {(stats.subscriptionPlans || []).map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expiring Subscriptions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Expiring Soon (Next 7 Days)
          </h3>
          {expiringSoon.length === 0 ? (
            <p className="text-sm text-slate-500">No expirations this week.</p>
          ) : (
            <div className="space-y-2">
              {expiringSoon.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-slate-900">
                    {c.name}
                  </span>
                  <span className="text-xs text-amber-700">
                    {new Date(c.subscriptionEndDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Recent Activity</h3>
        </div>
        {recentActivity.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No recent activity.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivity.map((log, i) => (
              <div key={i} className="p-4 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      {log.action.replace(/_/g, " ").toUpperCase()}
                    </p>
                    <p className="text-slate-600 text-xs mt-1">
                      {log.details}
                    </p>
                    {log.collegeId && (
                      <p className="text-slate-500 text-xs mt-1">
                        College: {log.collegeId.name}
                      </p>
                    )}
                  </div>
                  <span className="text-slate-400 text-xs">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
