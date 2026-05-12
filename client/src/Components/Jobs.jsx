import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  LoaderCircle,
  ArrowLeft,
  Heart,
  ExternalLink,
  Building2,
  Clock,
  DollarSign,
  Filter,
  Bookmark,
  TrendingUp,
  Sparkles,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../configs/api";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [country, setCountry] = useState("in");
  const [location, setLocation] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [showSaved, setShowSaved] = useState(false);

  const toggleSaveJob = (job) => {
    const exists = savedJobs.find((j) => j.title === job.title);

    if (exists) {
      setSavedJobs(savedJobs.filter((j) => j.title !== job.title));
    } else {
      setSavedJobs([...savedJobs, job]);
    }
  };

  useEffect(() => {
    if (query || location) {
      handleSearch();
    }
  }, [page]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setShowSaved(false);

      const { data } = await api.get("/api/jobs", {
        params: {
          query: query || "developer",
          location: location || "india",
          country: country,
          page: page,
        },
      });

      setJobs(data.jobs || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const popularSearches = [
    { title: "Frontend Developer", icon: "💻" },
    { title: "Full Stack", icon: "🚀" },
    { title: "Data Analyst", icon: "📊" },
    { title: "Python Developer", icon: "🐍" },
  ];

  const displayedJobs = showSaved ? savedJobs : jobs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header Section */}
        <button
          onClick={() => navigate("/app")}
          className="mb-6 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp size={16} />
            {jobs.length > 0 ? `${jobs.length}+ Opportunities` : "Job Search"}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Find Your Dream Job
          </h1>

          <p className="text-slate-600 text-lg">
            Discover opportunities that match your skills and aspirations
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Job Title Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Job Title or Skills
              </label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 focus-within:border-purple-500 transition-colors bg-slate-50">
                <Search className="text-slate-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="e.g., React Developer, Data Analyst..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl px-4 py-3 focus-within:border-purple-500 transition-colors bg-slate-50">
                <MapPin className="text-slate-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="City or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Country Selector & Search Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 pl-12 outline-none focus:border-purple-500 transition-colors bg-slate-50 text-slate-700 appearance-none cursor-pointer"
                >
                  <option value="in">🇮🇳 India</option>
                  <option value="us">🇺🇸 United States</option>
                  <option value="uk">🇬🇧 United Kingdom</option>
                  <option value="ca">🇨🇦 Canada</option>
                  <option value="au">🇦🇺 Australia</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={20} />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Search Jobs
                </>
              )}
            </button>
          </div>

          {/* Popular Searches */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-600 mb-3">Popular Searches:</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(search.title);
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <span>{search.icon}</span>
                  {search.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: All Jobs vs Saved Jobs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
            <button
              onClick={() => setShowSaved(false)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                !showSaved
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              All Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setShowSaved(true)}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                showSaved
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Heart size={16} fill={showSaved ? "white" : "none"} />
              Saved ({savedJobs.length})
            </button>
          </div>

          {jobs.length > 0 && !showSaved && (
            <p className="text-sm text-slate-500">
              Showing page {page}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 bg-white animate-pulse rounded-2xl h-48 shadow-md border border-slate-200"
              >
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && displayedJobs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4">
              {showSaved ? (
                <Heart className="text-purple-600" size={32} />
              ) : (
                <Search className="text-blue-600" size={32} />
              )}
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {showSaved ? "No Saved Jobs Yet" : "Start Your Job Search"}
            </h3>
            <p className="text-slate-500 mb-6">
              {showSaved
                ? "Save jobs you're interested in to view them here"
                : "Enter your desired role and location to find opportunities"}
            </p>
            {showSaved && (
              <button
                onClick={() => setShowSaved(false)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Browse All Jobs
              </button>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && displayedJobs.length > 0 && (
          <div className="grid gap-6">
            {displayedJobs.map((job, index) => {
              const isSaved = savedJobs.find((j) => j.title === job.title);
              const isRemote = job.location?.toLowerCase().includes("remote");

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Company Logo */}
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-xl shadow-lg flex-shrink-0">
                            {job.company?.charAt(0) || "J"}
                          </div>

                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors mb-1">
                              {job.title}
                            </h2>

                            <div className="flex items-center gap-2 text-slate-600 mb-2">
                              <Building2 size={16} />
                              <span className="font-medium">{job.company}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {isRemote && (
                                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                  <Sparkles size={12} />
                                  Remote
                                </span>
                              )}
                              
                              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                <MapPin size={12} />
                                {job.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => toggleSaveJob(job)}
                        className={`p-3 rounded-xl transition-all ${
                          isSaved
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        <Heart
                          size={20}
                          fill={isSaved ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <DollarSign size={18} />
                        <span>{job.salary || "Not disclosed"}</span>
                      </div>

                      <button
                        onClick={() => window.open(job.apply_link, "_blank")}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-blue-700 font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all group"
                      >
                        Apply Now
                        <ExternalLink
                          size={16}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && !showSaved && jobs.length > 0 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => {
                setPage((p) => Math.max(p - 1, 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={page === 1}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-md">
              Page {page}
            </div>

            <button
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        {savedJobs.length > 0 && !showSaved && (
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Bookmark size={24} />
                  You have {savedJobs.length} saved job{savedJobs.length > 1 ? "s" : ""}
                </h3>
                <p className="text-purple-100">
                  Review your saved opportunities and apply when you're ready
                </p>
              </div>
              <button
                onClick={() => setShowSaved(true)}
                className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                View Saved Jobs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}