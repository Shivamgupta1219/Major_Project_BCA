import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle2, Users, Calendar, DollarSign, MapPin, Edit2, Download } from "lucide-react";
import api from "../../configs/api";

const AdminPlacementDriveDetail = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDrive();
  }, [driveId]);

  const fetchDrive = async () => {
    try {
      const { data } = await api.get(`/api/placement-drives/${driveId}`);
      setDrive(data.drive);
      setSelectedStudents(new Set(data.drive.selectedStudents.map((s) => s._id || s)));
    } catch (err) {
      toast.error("Failed to fetch drive details");
      navigate("/admin/placement-drives");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSaveSelection = async () => {
    try {
      setUpdating(true);
      await api.post(`/api/placement-drives/${driveId}/select-students`, {
        studentIds: Array.from(selectedStudents),
      });
      toast.success("Selected students updated");
      fetchDrive();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save selection");
    } finally {
      setUpdating(false);
    }
  };

  const downloadRegisteredList = () => {
    if (!drive?.registeredStudents?.length) {
      toast.error("No registered students to download");
      return;
    }

    const csv = [
      ["Name", "Email", "Roll No", "Department", "Selected"].join(","),
      ...drive.registeredStudents.map((s) =>
        [
          s.name,
          s.email,
          s.rollNo || "",
          s.department || "",
          selectedStudents.has(s._id) ? "Yes" : "No",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${drive.companyName}-registered-students.csv`;
    a.click();
  };

  const statusConfig = {
    draft: { label: "Draft", color: "bg-slate-100 text-slate-700" },
    open: { label: "Open", color: "bg-green-100 text-green-700" },
    closed: { label: "Closed", color: "bg-yellow-100 text-yellow-700" },
    completed: { label: "Completed", color: "bg-blue-100 text-blue-700" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Drive not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/admin/placement-drives")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Title and Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{drive.title}</h1>
              <p className="text-lg text-slate-600 mt-1">{drive.companyName}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-4 py-2 rounded-full font-semibold ${statusConfig[drive.status].color}`}>
                {statusConfig[drive.status].label}
              </span>
              <Link
                to={`/admin/placement-drives/edit/${driveId}`}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900"
              >
                <Edit2 className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Description */}
          {drive.description && (
            <p className="text-slate-600 mb-6">{drive.description}</p>
          )}

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                <p className="text-sm font-medium text-slate-900">{drive.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Drive Date</p>
                <p className="text-sm font-medium text-slate-900">
                  {new Date(drive.driveDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">CTC</p>
                <p className="text-sm font-medium text-slate-900">
                  ₹{drive.ctc?.base}L {drive.ctc?.bonus && `+ ₹${drive.ctc.bonus}L`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Positions</p>
                <p className="text-sm font-medium text-slate-900">{drive.noOfPositions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        {drive.jobDescription && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Job Description</h2>
            <p className="text-slate-700 whitespace-pre-wrap">{drive.jobDescription}</p>
          </div>
        )}

        {/* Interview Rounds */}
        {drive.rounds && drive.rounds.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Interview Rounds</h2>
            <div className="space-y-3">
              {drive.rounds.map((round, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{round.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      <span className="capitalize">{round.type}</span>
                      {round.date && ` • ${new Date(round.date).toLocaleDateString()}`}
                    </p>
                    {round.description && (
                      <p className="text-sm text-slate-600 mt-2">{round.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registered Students */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Registered Students ({drive.registeredStudents?.length || 0})
              </h2>
              {drive.registeredStudents?.length > 0 && (
                <button
                  onClick={downloadRegisteredList}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  title="Download CSV"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>

            {drive.registeredStudents && drive.registeredStudents.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {drive.registeredStudents.map((student) => (
                  <label
                    key={student._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student._id)}
                      onChange={() => handleSelectStudent(student._id)}
                      className="w-4 h-4 rounded border-slate-300 accent-indigo-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.rollNo}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">No students registered yet</p>
            )}
          </div>

          {/* Selected Students */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Selected Students ({selectedStudents.size})
            </h2>

            {selectedStudents.size > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {drive.registeredStudents
                  ?.filter((s) => selectedStudents.has(s._id))
                  .map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.rollNo}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">No students selected yet</p>
            )}

            {drive.registeredStudents && drive.registeredStudents.length > 0 && (
              <button
                onClick={handleSaveSelection}
                disabled={updating}
                className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save Selection"}
              </button>
            )}
          </div>
        </div>

        {/* Eligibility Criteria */}
        {drive.eligibilityCriteria && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 mt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Eligibility Criteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 uppercase tracking-wider">Minimum CGPA</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{drive.eligibilityCriteria.minCGPA || "No minimum"}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 uppercase tracking-wider">Backlog</p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {drive.eligibilityCriteria.backlogAllowed ? "Allowed" : "Not Allowed"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlacementDriveDetail;
