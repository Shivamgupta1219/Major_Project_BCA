import { Plus, Trash2 } from "lucide-react";

const generateId = () =>
  crypto?.randomUUID?.() || Date.now().toString();

function EducationForm({ data = [], onChange }) {

  const addEducation = () => {
    onChange([
      ...data,
      {
        _id: generateId(),
        institution: "",
        degree: "",
        field: "",
        graduation_date: "",
        gpa: "",
      },
    ]);
  };

  const updateEducation = (id, field, value) => {
    onChange(
      data.map((e) =>
        e._id === id ? { ...e, [field]: value } : e
      )
    );
  };

  const removeEducation = (id) => {
    onChange(data.filter((e) => e._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Education
        </h3>
        <p className="text-sm text-gray-600">
          List your education starting with the most recent
        </p>
      </div>

      {data.map((edu, index) => (
        <div
          key={edu._id}
          className="relative border rounded-xl p-5 space-y-4 bg-white"
        >
          {/* Header Row */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">
              Education {index + 1}
            </span>

            <button
              type="button"
              onClick={() => removeEducation(edu._id)}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Institution Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={edu.institution}
              onChange={(e) =>
                updateEducation(edu._id, "institution", e.target.value)
              }
              placeholder="Meerut Institute of Technology"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Degree & Field */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu._id, "degree", e.target.value)
                }
                placeholder="Bachelor of Computer Applications"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Field of Study
              </label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) =>
                  updateEducation(edu._id, "field", e.target.value)
                }
                placeholder="Computer Science"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Graduation Date & GPA */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Graduation Date
              </label>
              <input
                type="month"
                value={edu.graduation_date}
                onChange={(e) =>
                  updateEducation(edu._id, "graduation_date", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CGPA (optional)
              </label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) =>
                  updateEducation(edu._id, "gpa", e.target.value)
                }
                placeholder="8.5 / 10"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        type="button"
        onClick={addEducation}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <Plus size={18} /> Add Education
      </button>
    </div>
  );
}

export default EducationForm;
