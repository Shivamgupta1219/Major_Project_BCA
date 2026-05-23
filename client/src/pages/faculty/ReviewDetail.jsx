import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Loader,
} from "lucide-react";

const ReviewDetail = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((s) => s.auth);

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    comments: "",
    sectionComments: {
      summary: "",
      experience: "",
      education: "",
      skills: "",
      projects: "",
    },
    status: "under_review",
    privateNotes: "",
  });

  useEffect(() => {
    fetchReviewDetail();
  }, [reviewId, token]);

  const fetchReviewDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/faculty/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch review details");
      }

      const data = await response.json();
      setReview(data.review);

      // Pre-fill form with existing data
      if (data.review) {
        setFormData((prev) => ({
          ...prev,
          comments: data.review.comments || "",
          sectionComments: data.review.sectionComments || prev.sectionComments,
          status: data.review.status || "under_review",
          privateNotes: data.review.privateNotes || "",
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/faculty/reviews/${reviewId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit review");
      }

      // Success message and redirect
      navigate("/faculty/reviews", {
        state: { success: "Review submitted successfully" },
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="space-y-3 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
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

  if (!review) return null;

  const resume = review.resumeId || {};
  const student = review.studentId || {};

  const statusOptions = [
    { value: "under_review", label: "Under Review", color: "text-blue-600" },
    { value: "needs_improvement", label: "Needs Improvement", color: "text-red-600" },
    { value: "approved", label: "Approved", color: "text-green-600" },
  ];

  const resumeSections = [
    { key: "summary", label: "Summary", content: resume.summary },
    { key: "experience", label: "Experience", content: resume.experience },
    { key: "education", label: "Education", content: resume.education },
    { key: "skills", label: "Skills", content: resume.skills },
    { key: "projects", label: "Projects", content: resume.projects },
  ].filter((section) => section.content);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/faculty/reviews")}
          className="text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{resume.title || "Resume Review"}</h1>
          <p className="text-slate-600 mt-1">
            Submitted by {student.name || "Unknown"} on{" "}
            {new Date(resume.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Student Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium text-slate-900">{student.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{student.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Roll Number</p>
                <p className="font-medium text-slate-900">{student.rollNo || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Resume Score</p>
                <p className="font-medium text-purple-600 text-lg">
                  {resume.resumeScore?.overall?.toFixed(1) || "N/A"}/100
                </p>
              </div>
            </div>
          </div>

          {/* Resume Sections with Comments */}
          <div className="space-y-6">
            <h2 className="font-semibold text-slate-900 text-lg">Resume Content & Feedback</h2>

            {resumeSections.map((section) => (
              <div key={section.key} className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-3">{section.label}</h3>

                {/* Resume Content */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200 max-h-48 overflow-y-auto">
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{section.content}</p>
                </div>

                {/* Section Comment */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Add feedback for {section.label}
                  </label>
                  <textarea
                    value={formData.sectionComments[section.key] || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sectionComments: {
                          ...prev.sectionComments,
                          [section.key]: e.target.value,
                        },
                      }))
                    }
                    placeholder={`Provide specific feedback on the ${section.label.toLowerCase()} section...`}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* General Comments */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4">General Comments</h3>
            <textarea
              value={formData.comments}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  comments: e.target.value,
                }))
              }
              placeholder="Add general feedback for the student..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
              rows={5}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4">Review Status</h3>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 font-medium"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-slate-600">Current Status</p>
                <p className={`font-semibold ${statusOptions.find((o) => o.value === review.status)?.color}`}>
                  {statusOptions.find((o) => o.value === review.status)?.label}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <p className="text-slate-600">Reviewed At</p>
                <p className="font-medium text-slate-900">
                  {review.reviewedAt
                    ? new Date(review.reviewedAt).toLocaleDateString()
                    : "Not reviewed yet"}
                </p>
              </div>
            </div>
          </div>

          {/* Private Notes */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Private Notes</h3>
            <p className="text-xs text-slate-500 mb-3">For your reference only (not visible to student)</p>
            <textarea
              value={formData.privateNotes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  privateNotes: e.target.value,
                }))
              }
              placeholder="Add personal notes..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitReview}
            disabled={submitting}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>

          {/* Error Alert */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          )}

          {/* Score Info */}
          {resume.resumeScore && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Score Breakdown</h3>
              <div className="space-y-3 text-sm">
                {Object.entries(resume.resumeScore).map(([key, value]) => {
                  if (key === "overall" || value === undefined) return null;
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-600 capitalize">{key}</span>
                        <span className="font-semibold text-purple-600">{value}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(value / 100) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
