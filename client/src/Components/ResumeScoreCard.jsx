import React, { useState } from "react";
import api from "../configs/api";
import { Sparkles, LoaderCircle, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";

const ROLES = [
  "",
  "frontend developer",
  "backend developer",
  "fullstack developer",
  "data analyst",
  "python developer",
  "java developer",
  "bpo executive",
  "hr executive",
  "digital marketing intern",
];

const Bar = ({ label, value, max }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color =
    pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">
          {value}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default function ResumeScoreCard({ resumeId, initialScore }) {
  const [score, setScore] = useState(initialScore || null);
  const [targetRole, setTargetRole] = useState(
    initialScore?.targetRole || ""
  );
  const [loading, setLoading] = useState(false);

  const compute = async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/api/resume/${resumeId}/score`, {
        targetRole,
      });
      setScore(data.score);
      toast.success("Score updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const overall = score?.overall || 0;
  const ring =
    overall >= 80
      ? "text-emerald-600"
      : overall >= 65
      ? "text-blue-600"
      : overall >= 45
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Resume Score</h3>
        </div>
        <button
          onClick={compute}
          disabled={loading || !resumeId}
          className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1 disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle className="w-3 h-3 animate-spin" />
          ) : (
            <TrendingUp className="w-3 h-3" />
          )}
          {score ? "Recalculate" : "Calculate"}
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-slate-500 mb-1">
          Target role (optional)
        </label>
        <select
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm capitalize"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r || "— None —"}
            </option>
          ))}
        </select>
      </div>

      {!score ? (
        <p className="text-sm text-slate-500 text-center py-6">
          Click <strong>Calculate</strong> to score your resume.
        </p>
      ) : (
        <>
          <div className="flex items-center justify-center my-4">
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  className={ring}
                  strokeWidth="10"
                  strokeDasharray={`${(overall / 100) * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-3xl font-bold ${ring}`}>{overall}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <Bar label="ATS readability" value={score.ats} max={15} />
            <Bar label="Keywords" value={score.keywords} max={20} />
            <Bar label="Grammar" value={score.grammar} max={15} />
            <Bar label="Projects" value={score.projects} max={20} />
            <Bar label="Skills" value={score.skills} max={15} />
            <Bar label="Formatting" value={score.formatting} max={15} />
          </div>

          {score.suggestions?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-700 mb-2">
                How to improve
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {score.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-indigo-500 flex-shrink-0">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
