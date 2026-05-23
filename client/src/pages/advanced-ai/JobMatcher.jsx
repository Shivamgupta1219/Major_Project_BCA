import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Target,
  Loader,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";

const JobMatcher = () => {
  const { token } = useSelector((s) => s.auth);
  const [formData, setFormData] = useState({
    jobDescription: "",
    resumeContent: "",
  });

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/match-job-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobDescription: formData.jobDescription,
            resumeContent: formData.resumeContent,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to analyze job match");
      }

      const data = await response.json();
      setAnalysis(data);
      toast.success("Analysis complete!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Job Matcher</h1>
          </div>
          <p className="text-slate-600">
            Compare your resume against job descriptions to find the best match
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Job Description</h2>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Paste the job description here..."
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={10}
              />
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Resume</h2>
              <textarea
                name="resumeContent"
                value={formData.resumeContent}
                onChange={handleChange}
                placeholder="Paste your resume content here..."
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={10}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  Analyze Match
                </>
              )}
            </button>
          </div>

          {/* Analysis */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Match Analysis</h2>

            {analysis ? (
              <div className="space-y-6">
                {/* Overall Match */}
                <div>
                  <div className="flex items-end justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Overall Match</h3>
                    <span
                      className={`text-4xl font-bold ${getMatchColor(
                        analysis.overall_match_percentage
                      )}`}
                    >
                      {analysis.overall_match_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        analysis.overall_match_percentage >= 80
                          ? "bg-green-600"
                          : analysis.overall_match_percentage >= 60
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${analysis.overall_match_percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Matched Skills */}
                {analysis.matched_skills && analysis.matched_skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Matched Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matched_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {analysis.missing_skills && analysis.missing_skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missing_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {analysis.strength_areas && analysis.strength_areas.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Your Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strength_areas.slice(0, 3).map((strength, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-slate-700">
                          <span className="text-green-600">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">📝 Recommendations</h3>
                    <ul className="space-y-2">
                      {analysis.recommendations.slice(0, 3).map((rec, idx) => (
                        <li key={idx} className="text-sm text-blue-700 flex gap-2">
                          <span className="flex-shrink-0">{idx + 1}.</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Motivation Text */}
                {analysis.motivation_text && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-900 text-sm italic">{analysis.motivation_text}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <Target className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500">
                  Paste a job description and your resume to get a detailed match analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatcher;
