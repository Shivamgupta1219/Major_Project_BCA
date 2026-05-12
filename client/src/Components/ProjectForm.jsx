import { Plus, Trash2 } from "lucide-react";
import { Sparkles, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import { useState } from "react";
const generateId = () => crypto?.randomUUID?.() || Date.now().toString();

function ProjectForm({ data = [], onChange }) {
  const { token } = useSelector((state) => state.auth);
  const [loadingId, setLoadingId] = useState(null);

  const enhanceDescription = async (id, text) => {
    console.log("ENHANCE JOB DESC HIT"); // 👈 ADD THIS
    if (!text || text.length < 5) return;

    setLoadingId(id);

    try {
      const { data: res } = await api.post(
        "/api/ai/enhance-job-des",
        { userContent: text },
        { headers: { Authorization: token } }
      );

      console.log("AI RESPONSE =>", res); // 👈 ADD THIS
      onChange(
        data.map((p) =>
          p._id === id ? { ...p, description: res.enhancedContent } : p
        )
      );
    } catch (err) {
      console.error("AI Enhance Error:", err.response?.data || err.message);
    } finally {
      setLoadingId(null);
    }
  };
  const addProject = () => {
    if (data.length && !data[data.length - 1].name.trim()) return;

    onChange([
      ...data,
      {
        _id: generateId(),
        name: "",
        type: "",
        description: "",
        technologies: [],
      },
    ]);
  };

  const updateProject = (id, field, value) => {
    onChange(data.map((p) => (p._id === id ? { ...p, [field]: value } : p)));
  };

  const removeProject = (id) => {
    onChange(data.filter((p) => p._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <p className="text-sm text-gray-600">
          Showcase your most impactful work (2–4 projects recommended)
        </p>
      </div>

      {/* Project List */}
      {data.map((project) => (
        <div
          key={project._id}
          className="border rounded-lg p-4 space-y-4 relative"
        >
          {/* Remove */}
          <button
            type="button"
            aria-label="Remove project"
            onClick={() => removeProject(project._id)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              name="project_name"
              type="text"
              value={project.name}
              onChange={(e) =>
                updateProject(project._id, "name", e.target.value)
              }
              placeholder="AI Resume Builder"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Type
            </label>
            <input
              name="project_type"
              type="text"
              value={project.type}
              onChange={(e) =>
                updateProject(project._id, "type", e.target.value)
              }
              placeholder="Web Application / MERN Stack"
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={project.description}
              onChange={(e) =>
                updateProject(project._id, "description", e.target.value)
              }
              placeholder="Built an AI-powered resume builder that improved ATS score by 35%..."
              className="w-full mt-1 px-3 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Use action verbs + measurable impact
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                Tip: Use action verbs + measurable impact
              </p>

              <button
                type="button"
                onClick={() =>
                  enhanceDescription(project._id, project.description)
                }
                disabled={loadingId === project._id}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                {loadingId === project._id ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Enhancing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Enhance with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Technologies Used
            </label>
            <input
              type="text"
              value={(project.technologies || []).join(", ")}
              onChange={(e) =>
                updateProject(
                  project._id,
                  "technologies",
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                )
              }
              placeholder="React, Node.js, MongoDB, OpenAI"
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addProject}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <Plus size={18} /> Add Project
      </button>
    </div>
  );
}

export default ProjectForm;
