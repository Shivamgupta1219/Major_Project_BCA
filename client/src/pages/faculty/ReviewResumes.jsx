import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-slate-100",
    textColor: "text-slate-700",
    badgeColor: "bg-slate-200 text-slate-800",
  },
  under_review: {
    label: "Under Review",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    badgeColor: "bg-blue-200 text-blue-800",
  },
  needs_improvement: {
    label: "Needs Improvement",
    color: "bg-red-100",
    textColor: "text-red-700",
    badgeColor: "bg-red-200 text-red-800",
  },
  approved: {
    label: "Approved",
    color: "bg-green-100",
    textColor: "text-green-700",
    badgeColor: "bg-green-200 text-green-800",
  },
};

const ReviewResumes = () => {
  const { token } = useSelector((s) => s.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, [token, statusFilter, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/faculty/reviews`);
      url.searchParams.append("status", statusFilter);
      url.searchParams.append("sort", sortBy);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      review.studentId?.name?.toLowerCase().includes(searchLower) ||
      review.studentId?.email?.toLowerCase().includes(searchLower) ||
      review.resumeId?.title?.toLowerCase().includes(searchLower)
    );
  });

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "under_review":
        return <AlertCircle className="w-4 h-4" />;
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

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
        <h1 className="text-3xl font-bold text-slate-900">Resume Reviews</h1>
        <p className="text-slate-500 mt-1">Review and provide feedback on student resumes</p>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Search and Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or resume title..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="needs_improvement">Needs Improvement</option>
            <option value="approved">Approved</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="createdAt">Newest First</option>
            <option value="submittedAt">Submission Date</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Filter className="w-4 h-4" />
          <span>
            {filteredReviews.length} {filteredReviews.length === 1 ? "resume" : "resumes"}{" "}
            {searchTerm && `matching "${searchTerm}"`}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Resumes List */}
      {!loading && filteredReviews.length === 0 ? (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900">No resumes found</h3>
          <p className="text-sm text-slate-600 mt-1">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No resumes to review in this category"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedReviews.map((review) => {
            const status = review.status || "pending";
            const config = statusConfig[status];

            return (
              <Link
                key={review._id}
                to={`/faculty/reviews/${review._id}`}
                className="block bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div className={`${config.badgeColor} p-2 rounded-lg flex-shrink-0 mt-1`}>
                        {getStatusIcon(status)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                              {review.resumeId?.title || "Untitled Resume"}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              {review.studentId?.name || "Unknown Student"} ({review.studentId?.email})
                            </p>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Score:</span>
                            <span className="text-purple-600 font-semibold">
                              {review.resumeId?.resumeScore?.overall?.toFixed(1) || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Status:</span>
                            <span className={config.textColor}>{config.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Submitted:</span>
                            <span>
                              {new Date(review.resumeId?.submittedAt || review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 flex-shrink-0 ml-4" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-sm font-medium"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                currentPage === i + 1
                  ? "bg-purple-600 text-white"
                  : "border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-sm font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewResumes;
