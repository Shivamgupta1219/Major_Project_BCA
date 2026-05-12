import { Plus, Trash2 } from "lucide-react";

const generateId = () =>
  crypto?.randomUUID?.() || Date.now().toString();

function Certification({ data = [], onChange }) {
  const addCertification = () => {
    onChange([
      ...data,
      {
        _id: generateId(),
        name: "",
        issuer: "",
        issue_date: "",
        expiry_date: "",
        credential_id: "",
        credential_url: "",
      },
    ]);
  };

  const updateCertification = (id, field, value) => {
    onChange(
      data.map((cert) =>
        cert._id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const removeCertification = (id) => {
    onChange(data.filter((cert) => cert._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Certifications
          </h3>
          <p className="text-sm text-gray-600">
            Add professional certifications that strengthen your profile
          </p>
        </div>

        <button
          type="button"
          onClick={addCertification}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm
            bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="size-4" />
          Add
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <p className="text-sm text-gray-400">
          No certifications added yet.
        </p>
      )}

      {/* Certification List */}
      {data.map((cert) => (
        <div
          key={cert._id}
          className="border rounded-lg p-4 space-y-4 relative"
        >
          {/* Remove */}
          <button
            type="button"
            onClick={() => removeCertification(cert._id)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </button>

          {/* Name & Issuer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Certification Name
              </label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) =>
                  updateCertification(cert._id, "name", e.target.value)
                }
                placeholder="AWS Certified Solutions Architect"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Issuing Organization
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) =>
                  updateCertification(cert._id, "issuer", e.target.value)
                }
                placeholder="Amazon Web Services"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Issue Date
              </label>
              <input
                type="month"
                value={cert.issue_date}
                onChange={(e) =>
                  updateCertification(cert._id, "issue_date", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Expiry Date (optional)
              </label>
              <input
                type="month"
                value={cert.expiry_date}
                onChange={(e) =>
                  updateCertification(cert._id, "expiry_date", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Credential Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Credential ID
              </label>
              <input
                type="text"
                value={cert.credential_id}
                onChange={(e) =>
                  updateCertification(
                    cert._id,
                    "credential_id",
                    e.target.value
                  )
                }
                placeholder="ABC123456"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Credential URL
              </label>
              <input
                type="url"
                value={cert.credential_url}
                onChange={(e) =>
                  updateCertification(
                    cert._id,
                    "credential_url",
                    e.target.value
                  )
                }
                placeholder="https://verify.aws.amazon.com"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Certification;
