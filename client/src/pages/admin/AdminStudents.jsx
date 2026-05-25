import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import { Search, Download, LoaderCircle, Trash2, AlertCircle, Eye, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ScoreChip = ({ score }) => {
  if (!score) {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500">
        Not scored
      </span>
    );
  }
  const cls =
    score >= 80
      ? "bg-emerald-50 text-emerald-700"
      : score >= 65
      ? "bg-blue-50 text-blue-700"
      : score >= 45
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-700";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {score}/100
    </span>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading && <LoaderCircle className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("score");
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // "single" or "bulk"
    studentId: null,
    studentName: null,
    isLoading: false,
  });
  const [resumeModal, setResumeModal] = useState({
    isOpen: false,
    studentId: null,
    studentName: null,
    resumes: [],
    loading: false,
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (department) params.set("department", department);
      if (year) params.set("year", year);
      params.set("sort", sort);
      const { data } = await api.get(`/api/admin/students?${params.toString()}`);
      setStudents(data.students || []);
      setSelectedStudents(new Set());
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [department, year, sort]);

  const departments = [...new Set(students.map((s) => s.department).filter(Boolean))];
  const years = [...new Set(students.map((s) => s.year).filter(Boolean))];

  const downloadCsv = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/students/export.csv`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to download");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const toggleSelectStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s) => s._id)));
    }
  };

  const openDeleteModal = (type, studentId = null, studentName = null) => {
    setDeleteModal({
      isOpen: true,
      type,
      studentId,
      studentName,
      isLoading: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      type: null,
      studentId: null,
      studentName: null,
      isLoading: false,
    });
  };

  const openResumeModal = async (studentId, studentName) => {
    setResumeModal({
      isOpen: true,
      studentId,
      studentName,
      resumes: [],
      loading: true,
    });

    try {
      const { data } = await api.get(`/api/admin/students/${studentId}/resumes`);
      setResumeModal((prev) => ({
        ...prev,
        resumes: data.resumes || [],
        loading: false,
      }));
    } catch (err) {
      toast.error("Failed to load resumes");
      setResumeModal((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const closeResumeModal = () => {
    setResumeModal({
      isOpen: false,
      studentId: null,
      studentName: null,
      resumes: [],
      loading: false,
    });
  };

  const handleDeleteSingle = async () => {
    const { studentId, studentName } = deleteModal;
    setDeleteModal((prev) => ({ ...prev, isLoading: true }));

    try {
      await api.delete(`/api/admin/students/${studentId}`);
      toast.success(`${studentName} deleted successfully`);
      fetchStudents();
      closeDeleteModal();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete student");
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteBulk = async () => {
    const studentIds = Array.from(selectedStudents);
    setDeleteModal((prev) => ({ ...prev, isLoading: true }));

    try {
      await api.delete("/api/admin/students/bulk", {
        data: { studentIds },
      });
      toast.success(`${studentIds.length} student(s) deleted successfully`);
      fetchStudents();
      closeDeleteModal();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete students");
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Students
          </h1>
          <p className="text-slate-600 mt-1">
            View and shortlist students by resume readiness.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedStudents.size > 0 && (
            <button
              onClick={() =>
                openDeleteModal(
                  "bulk",
                  null,
                  `${selectedStudents.size} student${selectedStudents.size > 1 ? "s" : ""}`
                )
              }
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Delete {selectedStudents.size}
            </button>
          )}
          <button
            onClick={downloadCsv}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="grid md:grid-cols-4 gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchStudents();
            }}
            className="md:col-span-2 relative"
          >
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, roll no"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </form>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <span className="text-slate-500">Sort by:</span>
          <button
            onClick={() => setSort("score")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              sort === "score"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Top scores
          </button>
          <button
            onClick={() => setSort("score_asc")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              sort === "score_asc"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Needs help
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <LoaderCircle className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No students found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedStudents.size === students.length && students.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Roll No</th>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Year</th>
                  <th className="px-6 py-3 font-medium">Resume Score</th>
                  <th className="px-6 py-3 font-medium">Ready</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(s._id)}
                        onChange={() => toggleSelectStudent(s._id)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {s.name}
                    </td>
                    <td className="px-6 py-3 text-slate-600">{s.email}</td>
                    <td className="px-6 py-3 text-slate-600">
                      {s.rollNo || "-"}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {s.department || "-"}
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {s.year || "-"}
                    </td>
                    <td className="px-6 py-3">
                      <ScoreChip score={s.resumeScore} />
                    </td>
                    <td className="px-6 py-3">
                      {s.ready ? (
                        <span className="text-emerald-600 text-xs font-medium">
                          ● Ready
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">— Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => openResumeModal(s._id, s.name)}
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded inline-flex"
                        title="View resumes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal("single", s._id, s.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded inline-flex"
                        title="Delete student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resume Modal */}
      {resumeModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl max-h-96 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">
                Resumes - {resumeModal.studentName}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {resumeModal.loading ? (
                <div className="flex justify-center py-8">
                  <LoaderCircle className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              ) : resumeModal.resumes.length === 0 ? (
                <div className="text-center py-8 text-slate-600">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p>No resumes found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumeModal.resumes.map((resume) => {
                    const statusConfig = {
                      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
                      approved: { label: "Approved", color: "bg-green-100 text-green-700" },
                      rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
                      needs_improvement: { label: "Needs Improvement", color: "bg-orange-100 text-orange-700" },
                    };
                    const status = statusConfig[resume.feedbackStatus] || null;

                    return (
                      <Link
                        key={resume._id}
                        to={`/view/${resume._id}`}
                        target="_blank"
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 group-hover:text-indigo-700">
                              {resume.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-slate-500">
                                Score: {resume.resumeScore?.overall || "Not scored"}
                              </p>
                              {status && (
                                <span className={`text-xs font-medium px-2 py-1 rounded ${status.color}`}>
                                  {status.label}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={closeResumeModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.type === "bulk" ? "Delete Multiple Students?" : "Delete Student?"}
        message={
          deleteModal.type === "bulk"
            ? `Are you sure you want to delete ${deleteModal.studentName}? This action cannot be undone.`
            : `Are you sure you want to delete ${deleteModal.studentName}? This action cannot be undone and will also remove their resume data.`
        }
        onConfirm={
          deleteModal.type === "bulk" ? handleDeleteBulk : handleDeleteSingle
        }
        onCancel={closeDeleteModal}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}
