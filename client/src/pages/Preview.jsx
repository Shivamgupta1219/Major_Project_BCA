import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";
import { ArrowLeftIcon, CheckCircle2, XCircle, AlertCircle, Send, Upload } from "lucide-react";
import ResumePreview from "../Components/ResumePreview";
import api from "../configs/api.js";
import { normalizeResume } from "../utils/normalizeResume";
import { useSelector } from "react-redux";

function Preview() {
  const { resumeId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState("pending");
  const [submitting, setSubmitting] = useState(false);
  const [notifyingAdmin, setNotifyingAdmin] = useState(false);

  useEffect(() => {
    if (!resumeId) return;

    const fetchData = async () => {
      try {
        const resumeRes = await api.get(`/api/resume/${resumeId}`);
        const normalized = normalizeResume(resumeRes.data.resume);
        setResumeData(normalized);

        try {
          const feedbackRes = await api.get(`/api/resume/${resumeId}/admin-feedback`);
          if (feedbackRes?.data?.feedback) {
            setFeedback(feedbackRes.data.feedback);
            setComments(feedbackRes.data.feedback.comments || "");
            setStatus(feedbackRes.data.feedback.status || "pending");
          } else {
            setFeedback(null);
          }
        } catch (feedbackError) {
          setFeedback(null);
        }
      } catch (error) {
        setResumeData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resumeId]);

  const handleSubmitFeedback = async () => {
    try {
      setSubmitting(true);
      const { data } = await api.post(`/api/resume/${resumeId}/admin-feedback`, {
        comments,
        status,
      });
      setFeedback(data.feedback);
      toast.success("Feedback submitted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsImproved = async () => {
    try {
      setNotifyingAdmin(true);
      const { data } = await api.post(`/api/resume/${resumeId}/mark-improved`, {});
      toast.success("Teacher notified about your improvements!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to notify teacher");
    } finally {
      setNotifyingAdmin(false);
    }
  };

  const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
    approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
    needs_improvement: { label: "Needs Improvement", color: "bg-orange-100 text-orange-700", icon: AlertCircle },
  };

  if (isLoading) return <Loader text="Loading resume..." />;

  return resumeData ? (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Back Button */}
        <Link
          to={user?.role === "admin" ? "/admin/students" : "/app"}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <ResumePreview
              data={resumeData}
              template={resumeData.template || "classic"}
              accentColor={resumeData.accent_color}
            />
          </div>

          {/* Feedback Panel - Admin Edit Mode */}
          {user?.role === "admin" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg h-fit sticky top-6 overflow-y-auto max-h-[calc(100vh-120px)]">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-t-xl">
                <h2 className="text-xl font-bold">Resume Review</h2>
                <p className="text-indigo-100 text-sm mt-1">Provide feedback to the student</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Review Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(statusConfig).map(([value, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={value}
                          onClick={() => setStatus(value)}
                          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            status === value
                              ? config.color + " border-indigo-500 shadow-md scale-105"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium text-center">{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200"></div>

                {/* Comments Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Your Feedback</label>
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="✓ Specific improvements needed&#10;✓ Missing sections or details&#10;✓ Formatting suggestions&#10;✓ Overall impressions"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={5}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Be specific with suggestions to help the student improve</p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitFeedback}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </button>

                {/* Previous Feedback */}
                {feedback && (
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Previous Review</p>
                    </div>
                    <div className={`p-4 rounded-lg ${statusConfig[feedback.status]?.color || "bg-slate-100"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const Icon = statusConfig[feedback.status]?.icon;
                          return Icon ? <Icon className="w-4 h-4" /> : null;
                        })()}
                        <p className="font-bold text-sm">{statusConfig[feedback.status]?.label}</p>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap mb-3 leading-relaxed">{feedback.comments}</p>
                      <p className="text-xs text-slate-600 font-medium">— {feedback.adminId?.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feedback Panel - Student View Mode */}
          {user?.role === "student" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg h-fit sticky top-6 overflow-y-auto max-h-[calc(100vh-120px)]">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-t-xl">
                <h2 className="text-xl font-bold">Admin Feedback</h2>
                <p className="text-emerald-100 text-sm mt-1">Review your resume performance</p>
              </div>

              <div className="p-6">
                {feedback ? (
                  <div className="space-y-4">
                    {/* Status Card */}
                    <div className={`p-5 rounded-lg border-2 ${statusConfig[feedback.status]?.color || "bg-slate-100"}`}>
                      <div className="flex items-center gap-3 mb-4">
                        {(() => {
                          const Icon = statusConfig[feedback.status]?.icon;
                          return Icon ? <Icon className="w-6 h-6" /> : null;
                        })()}
                        <div>
                          <p className="font-bold text-sm">{statusConfig[feedback.status]?.label}</p>
                          <p className="text-xs opacity-75">From: {feedback.adminId?.name}</p>
                        </div>
                      </div>
                      <div className="border-t border-current border-opacity-20 pt-4">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {feedback.comments}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {feedback.status === "needs_improvement" && (
                      <div className="space-y-3">
                        <button
                          onClick={handleMarkAsImproved}
                          disabled={notifyingAdmin}
                          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                          <Upload className="w-4 h-4" />
                          {notifyingAdmin ? "Notifying Teacher..." : "Mark as Improved"}
                        </button>
                        <p className="text-xs text-slate-600 text-center">
                          Click above to notify your admin that you've made improvements
                        </p>
                      </div>
                    )}

                    {feedback.status === "approved" && (
                      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-emerald-700">Resume Approved!</p>
                            <p className="text-sm text-emerald-600">Great job on your resume</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {feedback.status === "rejected" && (
                      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-red-700">Needs Revision</p>
                            <p className="text-sm text-red-600">Please address the feedback above</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium mb-1">No Feedback Yet</p>
                    <p className="text-xs text-slate-500">
                      Your admin will review your resume and provide feedback here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-3 py-10">
      <p className="text-gray-700">Resume not found</p>
      <Link
        to={user?.role === "admin" ? "/admin/students" : "/"}
        className="inline-flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Go back
      </Link>
    </div>
  );
}

export default Preview;
