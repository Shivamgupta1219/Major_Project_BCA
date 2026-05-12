import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../configs/api.js";

function ExperienceForm({ data = [], onChange, title, onTitleChange }) {
  const { token } = useSelector((state) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const addExperience = () => {
    onChange([
      ...data,
      {
        _id: Date.now().toString(),
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      },
    ]);
  };

  const updateExperience = (id, field, value) => {
    const updated = data.map((exp) =>
      exp._id === id ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  const removeExperience = (id) => {
    onChange(data.filter((exp) => exp._id !== id));
  };

  const generatingDescription = async (index) => {
    setGeneratingIndex(index);

    const experience = data[index];
    const prompt = `Enhance this job description and make it ATS-friendly:\n\nPosition: ${experience.position}\nCompany: ${experience.company}\nDescription: ${experience.description}`;

    try {
      const { data: res } = await api.post(
        "/api/ai/enhance-job-des",
        { userContent: prompt },
        { headers: { Authorization: token } }
      );

      updateExperience(experience._id, "description", res.enhancedContent);
    } catch (err) {
      console.log(err);
    } finally {
      setGeneratingIndex(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Section Heading
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Work Experience / Internships"
            className="w-full px-3 py-2 border rounded-md text-lg font-semibold"
          />

          <p className="text-sm text-gray-600 mt-1">
            Examples: Work Experience, Internships, Professional Experience
          </p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="size-4" />
          Add
        </button>
      </div>

      {data.length === 0 && (
        <p className="text-sm text-gray-400">No experience added yet.</p>
      )}

      {data.map((exp, index) => (
        <div key={exp._id} className="border rounded-lg p-4 space-y-4 relative">
          <button
            type="button"
            onClick={() => removeExperience(exp._id)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </button>

          {/* Position & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) =>
                  updateExperience(exp._id, "position", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(exp._id, "company", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="month"
                value={exp.start_date}
                onChange={(e) =>
                  updateExperience(exp._id, "start_date", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            {!exp.is_current && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="month"
                  value={exp.end_date}
                  onChange={(e) =>
                    updateExperience(exp._id, "end_date", e.target.value)
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
            )}

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={exp.is_current}
                onChange={(e) =>
                  updateExperience(exp._id, "is_current", e.target.checked)
                }
              />
              <label className="text-sm text-gray-700">
                Currently working here
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={4}
              value={exp.description}
              onChange={(e) =>
                updateExperience(exp._id, "description", e.target.value)
              }
              className="w-full mt-1 px-3 py-2 border rounded-md resize-none"
            />

            <button
              type="button"
              onClick={() => generatingDescription(index)}
              disabled={
                generatingIndex === index || !exp.position || !exp.company
              }
              className="mt-2 text-sm text-blue-600 hover:underline disabled:opacity-60"
            >
              {generatingIndex === index ? "Generating..." : "Enhance with AI"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExperienceForm;
