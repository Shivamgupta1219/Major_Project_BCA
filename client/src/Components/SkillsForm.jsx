import { X } from "lucide-react";
import { useState } from "react";

function SkillsForm({ data = [], onChange }) {
  const [input, setInput] = useState("");

  const addSkill = (skill) => {
    if (!skill.trim()) return;
    if (data.includes(skill)) return;

    onChange([...data, skill.trim()]);
    setInput("");
  };

  const removeSkill = (skill) => {
    onChange(data.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Skills
        </h3>
        <p className="text-sm text-gray-600">
          Add skills recruiters and ATS systems search for
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addSkill(input);
            }
          }}
          placeholder="React, Node.js, MongoDB, SQL"
          className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => addSkill(input)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Tip: Press Enter or comma to add skill
      </p>

      {/* Skill Chips */}
      <div className="flex flex-wrap gap-2">
        {data.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-full"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-gray-500 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillsForm;
