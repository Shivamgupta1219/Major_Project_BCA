import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FilePenIcon, PencilIcon, PlusIcon, TrashIcon,
  XIcon, FileText, Search,
} from "lucide-react";
import { LoaderCircleIcon } from "lucide-react";
import api from "../configs/api";

const COLORS = [
  "#1e40af", "#0f766e", "#4338ca", "#0369a1",
  "#7c3aed", "#0891b2", "#4f46e5", "#0d9488",
];

export default function MyResumesPage() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadResumes = async () => {
    try {
      const { data } = await api.get("/api/resume");
      setResumes(data.resumes);
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadResumes(); }, []);

  const createResume = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Enter a title");
    setIsSaving(true);
    try {
      const { data } = await api.post("/api/resume/create", { title: title.trim() });
      toast.success("Resume created!");
      setShowCreate(false);
      setTitle("");
      navigate(`/app/builder/${data.resume._id}`);
    } catch {
      toast.error("Could not create resume");
    } finally {
      setIsSaving(false);
    }
  };

  const updateTitle = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Enter a title");
    setIsSaving(true);
    try {
      await api.put(`/api/resume/${editId}`, { title: title.trim() });
      setResumes((prev) => prev.map((r) => r._id === editId ? { ...r, title: title.trim() } : r));
      toast.success("Title updated");
      setEditId(null);
      setTitle("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    try {
      await api.delete(`/api/resume/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  const filtered = resumes.filter((r) =>
    r.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
            <p className="text-slate-500 text-sm mt-1">{resumes.length} resume{resumes.length !== 1 ? "s" : ""} total</p>
          </div>
          <button
            onClick={() => { setShowCreate(true); setTitle(""); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            New Resume
          </button>
        </div>

        {/* Search */}
        {resumes.length > 0 && (
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <LoaderCircleIcon className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {search ? "No resumes match your search" : "No resumes yet"}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {search ? "Try a different keyword" : "Create your first resume to get started"}
            </p>
            {!search && (
              <button
                onClick={() => setShowCreate(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Create Resume
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((resume, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <div key={resume._id} className="group">
                  <button
                    onClick={() => navigate(`/app/builder/${resume._id}`)}
                    className="relative w-full h-56 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-5" style={{ backgroundColor: color }} />
                    <div className="relative h-full flex flex-col items-center justify-center p-4">
                      <div className="p-4 rounded-xl mb-3" style={{ backgroundColor: `${color}15` }}>
                        <FilePenIcon className="w-10 h-10" style={{ color }} />
                      </div>
                      <p className="text-sm font-semibold text-center px-2 line-clamp-2 mb-1" style={{ color }}>
                        {resume.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-white rounded-lg p-1 shadow-md border border-slate-200"
                    >
                      <button
                        onClick={() => { setTitle(resume.title); setEditId(resume._id); }}
                        className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                        title="Rename"
                      >
                        <PencilIcon className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => deleteResume(resume._id)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div
          onClick={() => setShowCreate(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={createResume}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Create New Resume</h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Software Engineer Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                required
              />
              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSaving && <LoaderCircleIcon className="animate-spin w-4 h-4" />}
                Create
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg"
            >
              <XIcon className="w-5 h-5 text-slate-400" />
            </button>
          </form>
        </div>
      )}

      {/* Rename Modal */}
      {editId && (
        <div
          onClick={() => setEditId(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={updateTitle}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Rename Resume</h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">New Title</label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                required
              />
              <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
              >
                Save
              </button>
            </div>
            <button
              type="button"
              onClick={() => setEditId(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg"
            >
              <XIcon className="w-5 h-5 text-slate-400" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
