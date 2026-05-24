import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, Sparkles, Target } from "lucide-react";
import api from "../../configs/api";

// ─── local completeness checks ────────────────────────────────────────────────
function computeLocalScore(data) {
  const checks = [
    { label: "Full name",        done: !!data.personal_info?.full_name,       points: 10 },
    { label: "Email address",    done: !!data.personal_info?.email,            points: 8  },
    { label: "Phone number",     done: !!data.personal_info?.phone,            points: 5  },
    { label: "Location",         done: !!data.personal_info?.location,         points: 4  },
    { label: "Job title",        done: !!data.personal_info?.profession,       points: 5  },
    { label: "Professional summary", done: (data.professional_summary || "").trim().length > 50, points: 18 },
    { label: "Work experience",  done: (data.experience || []).length > 0,     points: 20 },
    { label: "Education",        done: (data.education || []).length > 0,      points: 12 },
    { label: "Skills (3+)",      done: (data.skills || []).length >= 3,        points: 12 },
    { label: "Projects",         done: (data.project || []).length > 0,        points: 6  },
  ];
  const score = checks.reduce((s, c) => s + (c.done ? c.points : 0), 0);
  return { score, checks };
}

function buildResumeText(data) {
  const p = data.personal_info || {};
  const lines = [
    p.full_name, p.profession, p.location,
    data.professional_summary,
    ...(data.skills || []),
    ...(data.experience || []).map((e) => `${e.position} at ${e.company}. ${e.description}`),
    ...(data.education || []).map((e) => `${e.degree} ${e.field} at ${e.institution}`),
    ...(data.project || []).map((pr) => `${pr.name}: ${pr.description}`),
  ];
  return lines.filter(Boolean).join("\n");
}

function ScoreRing({ score }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = circ - (circ * score) / 100;
  const color =
    score >= 75 ? "#22c55e" :
    score >= 50 ? "#f59e0b" :
    score >= 25 ? "#f97316" : "#ef4444";

  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <circle
        cx="45" cy="45" r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={filled}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
      />
      <text x="45" y="49" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>
        {score}
      </text>
    </svg>
  );
}

// ─── main component ────────────────────────────────────────────────────────────
export default function ATSScoreMeter({ data }) {
  const [expanded, setExpanded] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const { score: localScore, checks } = computeLocalScore(data);

  // If we have an AI score, blend it: 40% local + 60% AI
  const displayScore = aiResult?.score != null
    ? Math.round(localScore * 0.4 + aiResult.score * 0.6)
    : localScore;

  const runAICheck = useCallback(async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setAiError("");
    setAiResult(null);
    try {
      const resumeText = buildResumeText(data);
      const { data: res } = await api.post("/api/ats/score", {
        resumeText,
        jobDescription: jobDescription.trim(),
      });
      if (res.success) {
        setAiResult(res.data);
      } else {
        setAiError("AI analysis failed. Try again.");
      }
    } catch {
      setAiError("Could not reach ATS service. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [data, jobDescription]);

  // Reset AI result when resume changes significantly
  useEffect(() => {
    setAiResult(null);
    setAiError("");
  }, [data.personal_info?.full_name, data.experience?.length, data.skills?.length]);

  const label =
    displayScore >= 75 ? "Great" :
    displayScore >= 50 ? "Average" :
    displayScore >= 25 ? "Weak" : "Incomplete";

  const labelColor =
    displayScore >= 75 ? "text-green-600" :
    displayScore >= 50 ? "text-amber-600" :
    displayScore >= 25 ? "text-orange-600" : "text-red-600";

  const missing = checks.filter((c) => !c.done);
  const done = checks.filter((c) => c.done);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-4 overflow-hidden">
      {/* ── header (always visible) ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Target className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-slate-700">ATS Score</span>
          {aiResult && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
              AI enhanced
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`text-xl font-bold ${labelColor}`}>{displayScore}</div>
            <span className="text-slate-400 text-sm">/100</span>
          </div>
          <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            displayScore >= 75 ? "bg-green-100 text-green-700" :
            displayScore >= 50 ? "bg-amber-100 text-amber-700" :
            displayScore >= 25 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
          }`}>
            {label}
          </div>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {/* progress bar */}
      <div className="h-1 bg-slate-100">
        <div
          className={`h-1 transition-all duration-700 ${
            displayScore >= 75 ? "bg-green-500" :
            displayScore >= 50 ? "bg-amber-500" :
            displayScore >= 25 ? "bg-orange-500" : "bg-red-500"
          }`}
          style={{ width: `${displayScore}%` }}
        />
      </div>

      {/* ── expanded panel ── */}
      {expanded && (
        <div className="px-5 py-4 border-t border-slate-100 space-y-5">
          {/* ring + breakdown */}
          <div className="flex gap-5">
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <ScoreRing score={displayScore} />
              <span className={`text-xs font-semibold ${labelColor}`}>{label}</span>
            </div>

            <div className="flex-1 min-w-0 space-y-1 max-h-44 overflow-y-auto pr-1">
              {done.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                  <span className="text-xs text-slate-600">{c.label}</span>
                </div>
              ))}
              {missing.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <XCircle size={14} className="text-red-400 flex-shrink-0" />
                  <span className="text-xs text-slate-400">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI results */}
          {aiResult && (
            <div className="space-y-3">
              {aiResult.strengths?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-1">Strengths</p>
                  <ul className="space-y-0.5">
                    {aiResult.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                        <span className="text-green-500 mt-0.5">✓</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiResult.missingSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-1">Missing keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {aiResult.missingSkills.map((s, i) => (
                      <span key={i} className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {aiResult.suggestions?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-1">Suggestions</p>
                  <ul className="space-y-0.5">
                    {aiResult.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                        <span className="text-blue-400 mt-0.5">→</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* JD check */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles size={13} className="text-purple-500" />
              Check against a job description
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get an AI-powered ATS score and missing keywords..."
              rows={4}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-slate-700 placeholder-slate-400"
            />
            {aiError && <p className="text-xs text-red-500 mt-1">{aiError}</p>}
            <button
              onClick={runAICheck}
              disabled={loading || !jobDescription.trim()}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {loading ? (
                <><Loader2 size={13} className="animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles size={13} /> Run AI ATS Check</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
