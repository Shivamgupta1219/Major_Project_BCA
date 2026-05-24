import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
} from "lucide-react";

const statusConfig = {
  none: {
    label: "No Review",
    color: "bg-slate-100",
    textColor: "text-slate-700",
    badgeColor: "bg-slate-200 text-slate-800",
    icon: Users,
  },
  pending: {
    label: "Pending",
    color: "bg-slate-100",
    textColor: "text-slate-700",
    badgeColor: "bg-slate-200 text-slate-800",
    icon: Clock,
  },
  under_review: {
    label: "Under Review",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    badgeColor: "bg-blue-200 text-blue-800",
    icon: Clock,
  },
  needs_improvement: {
    label: "Needs Improvement",
    color: "bg-red-100",
    textColor: "text-red-700",
    badgeColor: "bg-red-200 text-red-800",
    icon: AlertTriangle,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100",
    textColor: "text-green-700",
    badgeColor: "bg-green-200 text-green-800",
    icon: CheckCircle2,
  },
};

const Students = () => {
  const { token } = useSelector((s) => s.auth);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState({});

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/faculty/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data.students || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProgress = async (studentId) => {
    if (studentProgress[studentId]) {
      setExpandedStudent(expandedStudent === studentId ? null : studentId);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/faculty/student-progress/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student progress");
      }

      const data = await response.json();
      setStudentProgress((prev) => ({
        ...prev,
        [studentId]: data,
      }));
      setExpandedStudent(expandedStudent === studentId ? null : studentId);
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.rollNo?.toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return (
      <div className="p-6 md:p-8">
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

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Assigned Students</h1>
        <p className="text-slate-500 mt-1">
          View student information and their resume review status
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Students List */}
      {!loading && filteredStudents.length === 0 ? (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900">No students found</h3>
          <p className="text-sm text-slate-600 mt-1">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No students assigned yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const status = student.reviewStatus || "none";
            const config = statusConfig[status];
            const Icon = config.icon;
            const progress = studentProgress[student._id];
            const isExpanded = expandedStudent === student._id;

            return (
              <div key={student._id} className="border border-slate-200 rounded-lg overflow-hidden">
                {/* Student Card */}
                <button
                  onClick={() => fetchStudentProgress(student._id)}
                  className="w-full text-left bg-white hover:bg-slate-50 transition-colors p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Status Badge */}
                      <div className={`${config.badgeColor} p-2 rounded-lg flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900">{student.name}</h3>
                        <p className="text-sm text-slate-600">{student.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>
                            <strong>Roll No:</strong> {student.rollNo || "N/A"}
                          </span>
                          {student.department && (
                            <span>
                              <strong>Dept:</strong> {student.department}
                            </span>
                          )}
                          <span className={`font-medium ${config.textColor}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <ChevronRight
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Progress Details */}
                {isExpanded && progress && (
                  <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-4">
                    {/* Reviews History */}
                    {progress.reviews && progress.reviews.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Review History</h4>
                        <div className="space-y-2">
                          {progress.reviews.map((review, idx) => (
                            <Link
                              key={review._id}
                              to={`/faculty/reviews/${review._id}`}
                              className="block p-3 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow group"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-slate-900 group-hover:text-purple-600">
                                    {review.resumeId?.title || `Resume ${idx + 1}`}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded ${
                                    statusConfig[review.status]?.badgeColor
                                  }`}
                                >
                                  {statusConfig[review.status]?.label}
                                </span>
                              </div>
                              {review.comments && (
                                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                                  {review.comments}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Latest Resume */}
                    {progress.latestResume && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Latest Resume</h4>
                        <div className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-slate-900">
                                {progress.latestResume.title}
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                Score:{" "}
                                <span className="text-purple-600 font-semibold">
                                  {progress.latestResume.resumeScore?.overall?.toFixed(1) ||
                                    "N/A"}
                                </span>
                                /100
                              </p>
                            </div>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${
                                statusConfig[progress.latestResume.reviewStatus || "none"]
                                  ?.badgeColor
                              }`}
                            >
                              {
                                statusConfig[progress.latestResume.reviewStatus || "none"]
                                  ?.label
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* No Data */}
                    {(!progress.reviews || progress.reviews.length === 0) &&
                      !progress.latestResume && (
                        <p className="text-sm text-slate-600 text-center py-4">
                          No reviews yet for this student
                        </p>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {!loading && filteredStudents.length > 0 && (
        <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-slate-600">Total Students</p>
              <p className="text-2xl font-bold text-slate-900">{filteredStudents.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.reviewStatus === "approved").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Needs Improvement</p>
              <p className="text-2xl font-bold text-red-600">
                {students.filter((s) => s.reviewStatus === "needs_improvement").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Under Review</p>
              <p className="text-2xl font-bold text-blue-600">
                {students.filter((s) => s.reviewStatus === "under_review").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">No Review</p>
              <p className="text-2xl font-bold text-slate-600">
                {students.filter((s) => !s.reviewStatus || s.reviewStatus === "none").length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
