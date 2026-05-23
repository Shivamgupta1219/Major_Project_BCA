import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import { LoaderCircle, Target } from "lucide-react";
import { toast } from "react-toastify";

const ROLES = [
  "frontend developer",
  "backend developer",
  "data analyst",
  "python developer",
  "java developer",
];

export default function AdminSkillGap() {
  const [role, setRole] = useState("frontend developer");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(
          `/api/admin/skill-gap?role=${encodeURIComponent(role)}`
        );
        setData(data);
      } catch (e) {
        toast.error(e?.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [role]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Skill Gap Analysis
        </h1>
        <p className="text-slate-600 mt-1">
          See which job-role skills your students still need to develop.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex items-center gap-3">
        <Target className="w-5 h-5 text-indigo-600" />
        <span className="text-sm text-slate-600">Target role:</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm capitalize"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <LoaderCircle className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      ) : !data ? null : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <p className="text-sm text-slate-600">
              Showing skill coverage across{" "}
              <span className="font-semibold text-slate-900">
                {data.totalStudents}
              </span>{" "}
              students for{" "}
              <span className="font-semibold capitalize text-slate-900">
                {data.role}
              </span>
              .
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {data.gap.map((g) => {
              const pct =
                data.totalStudents > 0
                  ? Math.round((g.have / data.totalStudents) * 100)
                  : 0;
              return (
                <div key={g.skill} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize text-slate-900">
                      {g.skill}
                    </span>
                    <span className="text-sm text-slate-500">
                      {g.have} have · {g.missing} missing
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        pct >= 70
                          ? "bg-emerald-500"
                          : pct >= 40
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
