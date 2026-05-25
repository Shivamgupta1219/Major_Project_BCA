import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Users,
  Building2,
  Filter,
  Search,
  Briefcase,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../configs/api";

const statusConfig = {
  draft: { label: "Draft", color: "bg-slate-100", textColor: "text-slate-700" },
  open: { label: "Open", color: "bg-green-100", textColor: "text-green-700" },
  closed: { label: "Closed", color: "bg-yellow-100", textColor: "text-yellow-700" },
  completed: { label: "Completed", color: "bg-blue-100", textColor: "text-blue-700" },
};

const AdminPlacementDrives = () => {
  const { token } = useSelector((s) => s.auth);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDrives();
  }, [token, statusFilter]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const url = `/api/placement-drives${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`;
      const { data } = await api.get(url);
      setDrives(data.drives || []);
    } catch (err) {
      toast.error("Failed to fetch placement drives");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (driveId) => {
    if (!confirm("Are you sure you want to delete this placement drive?")) return;

    try {
      await api.delete(`/api/placement-drives/${driveId}`);
      setDrives((prev) => prev.filter((d) => d._id !== driveId));
      toast.success("Placement drive deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  const filteredDrives = drives.filter(
    (drive) =>
      drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDrives = filteredDrives.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDrives.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-8 h-8 text-indigo-600" />
                Placement Drives
              </h1>
              <p className="text-slate-600 mt-1">Manage all placement drives in your college</p>
            </div>
            <Link
              to="/admin/placement-drives/create"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Drive
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by company, job title, or creator..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-slate-600">Loading...</p>
          </div>
        ) : paginatedDrives.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">
              {searchTerm ? "No drives found matching your search" : "No placement drives yet"}
            </p>
            <Link
              to="/admin/placement-drives/create"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create your first drive →
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Total Drives</p>
                <p className="text-2xl font-bold text-slate-900">{drives.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Open</p>
                <p className="text-2xl font-bold text-green-600">{drives.filter(d => d.status === "open").length}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Closed</p>
                <p className="text-2xl font-bold text-yellow-600">{drives.filter(d => d.status === "closed").length}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{drives.filter(d => d.status === "completed").length}</p>
              </div>
            </div>

            {/* Drives Grid */}
            <div className="grid gap-4">
              {paginatedDrives.map((drive) => (
                <div
                  key={drive._id}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{drive.companyName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[drive.status].color} ${statusConfig[drive.status].textColor}`}>
                          {statusConfig[drive.status].label}
                        </span>
                      </div>
                      <p className="text-slate-600">{drive.jobTitle}</p>
                      <p className="text-xs text-slate-500 mt-1">Created by: {drive.createdBy?.name || "Unknown"}</p>
                      {drive.description && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{drive.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/placement-drives/${drive._id}`}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/admin/placement-drives/edit/${drive._id}`}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(drive._id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-slate-600 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Drive Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Company</p>
                      <p className="text-sm font-medium text-slate-900">{drive.companyName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Drive Date
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        {new Date(drive.driveDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-4 h-4" /> Registered
                      </p>
                      <p className="text-sm font-medium text-slate-900">{drive.registeredStudents?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">CTC</p>
                      <p className="text-sm font-medium text-slate-900">
                        {drive.ctc?.base ? `₹${drive.ctc.base}L` : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPlacementDrives;
