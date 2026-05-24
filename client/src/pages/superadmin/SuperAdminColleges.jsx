import React, { useEffect, useState } from "react";
import api from "../../configs/api";
import { Plus, Edit2, Trash2, LoaderCircle, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function SuperAdminColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCollegeId, setNewCollegeId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    planName: "basic",
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/super-admin/colleges");
      setColleges(data.colleges || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/super-admin/colleges/${editingId}`, formData);
        toast.success("College updated");
        setEditingId(null);
      } else {
        const { data } = await api.post("/api/super-admin/colleges", formData);
        toast.success("College created successfully!");
        // Show the college ID for copying
        setNewCollegeId(data.college._id);
        setShowForm(false);
      }
      setFormData({ name: "", email: "", phone: "", planName: "basic" });
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this college and all its data?")) return;
    try {
      await api.delete(`/api/super-admin/colleges/${id}`);
      setColleges((c) => c.filter((x) => x._id !== id));
      toast.success("College deleted");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setFormData({
      name: c.name,
      email: c.email,
      phone: c.phone,
      planName: c.planName,
    });
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700";
      case "trial":
        return "bg-blue-50 text-blue-700";
      case "expired":
        return "bg-red-50 text-red-700";
      case "suspended":
        return "bg-slate-50 text-slate-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "basic":
        return "bg-slate-100 text-slate-700";
      case "standard":
        return "bg-blue-100 text-blue-700";
      case "premium":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Colleges
          </h1>
          <p className="text-slate-600 mt-1">Manage all colleges on the platform.</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: "", email: "", phone: "", planName: "basic" });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New College
        </button>
      </div>

      {/* College ID Display Modal */}
      {newCollegeId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <h2 className="text-xl font-bold text-slate-900">College Created Successfully! ✅</h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900 mb-3">
                <strong>📋 College Admin Setup URL:</strong>
              </p>
              <div className="flex items-center gap-2 mb-3">
                <code className="flex-1 bg-white px-3 py-2 rounded border border-blue-200 font-mono text-xs text-blue-600 break-all">
                  {`${window.location.origin}/admin-setup?id=${newCollegeId}`}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/admin-setup?id=${newCollegeId}`
                    );
                    toast.success("Setup URL copied!");
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm"
                >
                  Copy
                </button>
              </div>

              <div className="bg-white border border-blue-100 rounded p-2 mt-2">
                <p className="text-xs text-blue-800">
                  <strong>College ID:</strong> {newCollegeId}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">📲 How to Share with College Admin:</p>
              <ol className="text-sm text-amber-900 space-y-2 list-decimal list-inside">
                <li>Copy the setup URL (button above)</li>
                <li>Send to college admin via:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>✓ Email</li>
                    <li>✓ WhatsApp / Message</li>
                    <li>✓ Any communication channel</li>
                  </ul>
                </li>
                <li>College admin clicks the link</li>
                <li>Fills in:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>✓ Their full name</li>
                    <li>✓ Their email address</li>
                    <li>✓ Create a strong password</li>
                  </ul>
                </li>
                <li>Clicks: <strong>"Complete Setup & Login"</strong></li>
                <li>They're logged in and can use the dashboard!</li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-green-800">
                <strong>✅ After setup:</strong> College admin logs in with their email + password (no need for college ID every time!)
              </p>
            </div>

            <button
              onClick={() => setNewCollegeId(null)}
              className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingId ? "Edit College" : "Create College"}
            </h2>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="College name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
              <select
                value={formData.planName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, planName: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              >
                <option value="basic">Basic (300 students)</option>
                <option value="standard">Standard (1000 students)</option>
                <option value="premium">Premium (Unlimited)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Colleges Table */}
      {loading ? (
        <div className="flex justify-center p-12">
          <LoaderCircle className="w-6 h-6 animate-spin text-red-600" />
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No colleges yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">College ID</th>
                  <th className="px-6 py-3 font-medium">Students</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Expires</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((c) => (
                  <tr key={c._id} className="border-t border-slate-100">
                    <td className="px-6 py-3">
                      <p className="font-medium text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600 truncate max-w-xs">
                          {c._id}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(c._id);
                            toast.success("College ID copied!");
                          }}
                          className="text-slate-400 hover:text-slate-600 text-sm"
                          title="Copy College ID"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      {c.studentCount}/{c.studentLimit}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPlanColor(
                          c.planName
                        )}`}
                      >
                        {c.planName}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          c.subscriptionStatus
                        )}`}
                      >
                        {c.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {c.subscriptionEndDate
                        ? new Date(c.subscriptionEndDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-1.5 hover:bg-slate-100 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
