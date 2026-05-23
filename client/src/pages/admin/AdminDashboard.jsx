import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import {
  Users,
  FileCheck2,
  TrendingUp,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-toastify";

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

const ScoreBar = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-slate-700">{label}</span>
        <span className="font-medium text-slate-900">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/admin/dashboard");
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
        <LoaderCircle className="w-8 h-8 animate-spin text-indigo-600" />
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

  const readinessMax = Math.max(
    1,
    data.ranges.excellent + data.ranges.good + data.ranges.fair + data.ranges.weak
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Placement Readiness Dashboard
        </h1>
        <p className="text-slate-600 mt-1">
          Real-time view of student resume readiness across departments.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Total Students"
          value={data.totalStudents}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={FileCheck2}
          label="Resume Completed"
          value={data.resumeCompleted}
          hint={`${Math.round(
            (data.resumeCompleted / Math.max(1, data.totalStudents)) * 100
          )}% completion`}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Average Score"
          value={`${data.averageScore}/100`}
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          icon={AlertCircle}
          label="Placement Ready"
          value={data.ranges.excellent + data.ranges.good}
          hint="Score ≥ 65"
          color="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Readiness distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Score Distribution
          </h3>
          <div className="space-y-4">
            <ScoreBar
              label="Excellent (80-100)"
              value={data.ranges.excellent}
              max={readinessMax}
              color="bg-emerald-500"
            />
            <ScoreBar
              label="Good (65-79)"
              value={data.ranges.good}
              max={readinessMax}
              color="bg-blue-500"
            />
            <ScoreBar
              label="Fair (45-64)"
              value={data.ranges.fair}
              max={readinessMax}
              color="bg-amber-500"
            />
            <ScoreBar
              label="Weak (0-44)"
              value={data.ranges.weak}
              max={readinessMax}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Top skills */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Top Skills Across Students
          </h3>
          {data.topSkills.length === 0 ? (
            <p className="text-sm text-slate-500">No skills data yet.</p>
          ) : (
            <div className="space-y-2">
              {data.topSkills.map((s) => (
                <div
                  key={s.skill}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-700 capitalize">{s.skill}</span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Department breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            Department-wise Breakdown
          </h3>
        </div>
        {data.departments.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            No departments configured.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Resume Ready</th>
                  <th className="px-6 py-3 font-medium">Completion</th>
                  <th className="px-6 py-3 font-medium">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {data.departments.map((d) => {
                  const pct = d.total
                    ? Math.round((d.completed / d.total) * 100)
                    : 0;
                  return (
                    <tr key={d.name} className="border-t border-slate-100">
                      <td className="px-6 py-3 font-medium text-slate-900">
                        {d.name}
                      </td>
                      <td className="px-6 py-3 text-slate-700">{d.total}</td>
                      <td className="px-6 py-3 text-slate-700">
                        {d.completed}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[120px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            d.avgScore >= 65
                              ? "bg-emerald-50 text-emerald-700"
                              : d.avgScore >= 45
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {d.avgScore}/100
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
