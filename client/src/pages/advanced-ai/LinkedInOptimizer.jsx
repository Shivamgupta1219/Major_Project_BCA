import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Zap, Loader, Copy, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const LinkedInOptimizer = () => {
  const { token } = useSelector((s) => s.auth);
  const [formData, setFormData] = useState({
    headline: "",
    summary: "",
    skills: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptimize = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/optimize-linkedin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            headline: formData.headline,
            summary: formData.summary,
            skills: skillsArray,
            experience: formData.experience,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to optimize profile");
      }

      const data = await response.json();
      setSuggestions(data);
      toast.success("Profile optimized!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHeadline = () => {
    navigator.clipboard.writeText(suggestions.optimized_headline);
    toast.success("Headline copied!");
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(suggestions.optimized_summary);
    toast.success("Summary copied!");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">LinkedIn Profile Optimizer</h1>
          </div>
          <p className="text-slate-600">
            Get AI-powered suggestions to make your LinkedIn profile stand out to recruiters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Your Profile</h2>

            <form onSubmit={handleOptimize} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer at Google"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Summary *
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Paste your current LinkedIn summary..."
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, AWS"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Recent Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Brief description of your recent role and achievements..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Get Optimization Suggestions"
                )}
              </button>
            </form>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Optimization Suggestions</h2>

            {suggestions ? (
              <div className="space-y-6">
                {/* Headline */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Optimized Headline
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-700 mb-3">{suggestions.optimized_headline}</p>
                    <button
                      onClick={handleCopyHeadline}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Optimized Summary
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-48 overflow-y-auto">
                    <p className="text-slate-700 whitespace-pre-wrap text-sm mb-3">
                      {suggestions.optimized_summary}
                    </p>
                    <button
                      onClick={handleCopySummary}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>

                {/* Suggested Skills */}
                {suggestions.suggested_skills && suggestions.suggested_skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Suggested Skills to Add
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.suggested_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {suggestions.tips && suggestions.tips.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Pro Tips</h3>
                    <ul className="space-y-2">
                      {suggestions.tips.map((tip, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-blue-600 font-bold flex-shrink-0">{idx + 1}.</span>
                          <span className="text-slate-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <Zap className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500">
                  Submit your profile details to get personalized optimization suggestions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInOptimizer;
