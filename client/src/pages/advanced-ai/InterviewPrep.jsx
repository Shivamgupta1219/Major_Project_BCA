import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Lightbulb, Loader, AlertCircle, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const InterviewPrep = () => {
  const { token } = useSelector((s) => s.auth);
  const [formData, setFormData] = useState({
    jobTitle: "",
    skills: "",
    experience: "intermediate",
  });

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState("technical");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/generate-interview-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobTitle: formData.jobTitle,
            skills: skillsArray,
            difficulty: formData.experience,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to generate questions");
      }

      const data = await response.json();
      setQuestions(data);
      setExpandedCategory("technical");
      toast.success("Interview questions generated!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const QuestionCard = ({ question, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-4 flex items-start justify-between hover:bg-slate-50"
        >
          <div className="flex gap-3 flex-1 min-w-0">
            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </span>
            <p className="text-slate-700 font-medium">{question}</p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <p className="text-sm text-slate-600 mb-3">
              💡 <strong>Tip:</strong> Take a moment to think about this question before answering.
              Structure your response using the STAR method (Situation, Task, Action, Result) for
              behavioral questions.
            </p>
            <div className="bg-white border border-slate-200 rounded p-3">
              <p className="text-xs text-slate-500">
                Write your answer below and practice it out loud several times before the interview.
              </p>
              <textarea
                placeholder="Type your answer here..."
                className="w-full mt-3 px-3 py-2 border border-slate-200 rounded text-xs resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Lightbulb className="w-6 h-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Interview Preparation</h1>
          </div>
          <p className="text-slate-600">
            Get realistic interview questions tailored to your target role and skill level
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Interview Details</h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g., Frontend Engineer, Data Scientist"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Key Skills (comma-separated) *
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, JavaScript, System Design, Problem Solving"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Experience Level
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="junior">Junior (0-2 years)</option>
                  <option value="intermediate">Intermediate (2-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
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
                className="w-full bg-amber-600 text-white py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  "Generate Interview Questions"
                )}
              </button>
            </form>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Questions Preview</h2>

            {questions ? (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-200">
                  {["technical", "behavioral", "questions_to_ask_interviewer"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setExpandedCategory(cat)}
                      className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                        expandedCategory === cat
                          ? "border-amber-600 text-amber-600"
                          : "border-transparent text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {cat.replace(/_/g, " ").replace("questions to ask interviewer", "Ask Interviewer")}
                    </button>
                  ))}
                </div>

                {/* Questions List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {questions[expandedCategory] && questions[expandedCategory].length > 0 ? (
                    questions[expandedCategory].map((q, idx) => (
                      <QuestionCard key={idx} question={q} index={idx} />
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-8">No questions available</p>
                  )}
                </div>

                {/* Tips */}
                {questions.tips && questions.tips.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-amber-900 mb-3">💡 Interview Tips</h4>
                    <ul className="space-y-2">
                      {questions.tips.slice(0, 3).map((tip, idx) => (
                        <li key={idx} className="text-sm text-amber-700 flex gap-2">
                          <span className="flex-shrink-0">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <Lightbulb className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500">
                  Fill in your job details to generate interview questions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
