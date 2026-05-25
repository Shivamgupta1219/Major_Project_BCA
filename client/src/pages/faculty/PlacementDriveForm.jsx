import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import api from "../../configs/api";

const PlacementDriveForm = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(driveId ? true : false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    ctc: { base: 0, bonus: 0, currency: "INR" },
    noOfPositions: 1,
    driveDate: "",
    registrationDeadline: "",
    location: "Online",
    eligibilityCriteria: {
      minCGPA: 0,
      specializations: [],
      graduationYear: [],
      backlogAllowed: false,
    },
    rounds: [],
  });

  const [newRound, setNewRound] = useState({
    name: "",
    type: "technical",
    description: "",
    date: "",
  });

  useEffect(() => {
    if (driveId) {
      fetchDrive();
    }
  }, [driveId]);

  const fetchDrive = async () => {
    try {
      const { data } = await api.get(`/api/placement-drives/${driveId}`);
      setFormData(data.drive);
    } catch (err) {
      toast.error("Failed to fetch drive details");
      navigate("/faculty/placement-drives");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddRound = () => {
    if (!newRound.name || !newRound.type) {
      toast.error("Please fill in round name and type");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      rounds: [...prev.rounds, newRound],
    }));

    setNewRound({ name: "", type: "technical", description: "", date: "" });
    toast.success("Round added");
  };

  const handleRemoveRound = (index) => {
    setFormData((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.companyName || !formData.jobTitle) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      if (driveId) {
        await api.put(`/api/placement-drives/${driveId}`, formData);
        toast.success("Placement drive updated successfully");
      } else {
        await api.post("/api/placement-drives", formData);
        toast.success("Placement drive created successfully");
      }
      navigate("/faculty/placement-drives");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save drive");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/faculty/placement-drives")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">
            {driveId ? "Edit Placement Drive" : "Create Placement Drive"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Drive Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Campus Placement Drive 2024"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Corp"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Bangalore, India"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the drive..."
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Section: Job Details */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Job Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed job description..."
                    rows="4"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Number of Positions
                  </label>
                  <input
                    type="number"
                    name="noOfPositions"
                    value={formData.noOfPositions}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Base CTC (in Lakhs)
                  </label>
                  <input
                    type="number"
                    name="ctc.base"
                    value={formData.ctc.base}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bonus (in Lakhs)
                  </label>
                  <input
                    type="number"
                    name="ctc.bonus"
                    value={formData.ctc.bonus}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Section: Dates */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Drive Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="driveDate"
                    value={formData.driveDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Registration Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Eligibility Criteria */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Eligibility Criteria</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Minimum CGPA
                  </label>
                  <input
                    type="number"
                    name="eligibilityCriteria.minCGPA"
                    value={formData.eligibilityCriteria.minCGPA}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="eligibilityCriteria.backlogAllowed"
                      checked={formData.eligibilityCriteria.backlogAllowed}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    <span className="text-sm font-medium text-slate-700">Backlog Allowed</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section: Interview Rounds */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Interview Rounds</h2>

              {formData.rounds.length > 0 && (
                <div className="space-y-2 mb-6">
                  {formData.rounds.map((round, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{round.name}</p>
                        <p className="text-sm text-slate-500">
                          {round.type} {round.date && `• ${new Date(round.date).toLocaleDateString()}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRound(idx)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Round Name
                  </label>
                  <input
                    type="text"
                    value={newRound.name}
                    onChange={(e) => setNewRound({ ...newRound, name: e.target.value })}
                    placeholder="e.g., Coding Test"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Round Type
                  </label>
                  <select
                    value={newRound.type}
                    onChange={(e) => setNewRound({ ...newRound, type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="screening">Screening</option>
                    <option value="written">Written Test</option>
                    <option value="technical">Technical</option>
                    <option value="hr">HR</option>
                    <option value="group_discussion">Group Discussion</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newRound.description}
                    onChange={(e) => setNewRound({ ...newRound, description: e.target.value })}
                    placeholder="Brief description of this round"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    value={newRound.date}
                    onChange={(e) => setNewRound({ ...newRound, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddRound}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Round
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/faculty/placement-drives")}
                className="flex-1 px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
              >
                {submitting ? "Saving..." : driveId ? "Update Drive" : "Create Drive"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlacementDriveForm;
