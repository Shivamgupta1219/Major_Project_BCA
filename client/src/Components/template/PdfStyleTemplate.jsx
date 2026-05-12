import { Mail, Phone, MapPin } from "lucide-react";

const PdfStyleTemplate = ({ data }) => {
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 text-gray-900 text-sm leading-relaxed font-sans">
      {/* ===== HEADER ===== */}
      <div className="text-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase">
          {data?.personal_info?.full_name}
        </h1>

        <p className="mt-2 text-sm">
          {[
            data?.personal_info?.location,
            data?.personal_info?.phone,
            data?.personal_info?.email,
            data?.personal_info?.github,
          ]
            .filter(Boolean)
            .join(" | ")}
        </p>
      </div>

      {/* ===== PROFESSIONAL SUMMARY ===== */}
      {data?.professional_summary && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b mb-2">
            Professional Summary
          </h2>

          <p className="text-sm whitespace-pre-line">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* ===== WORK EXPERIENCE ===== */}
      {Array.isArray(data?.experience) && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b mb-2">
            Work Experience
          </h2>

          {data.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">
                {exp.position} – {exp.company}
              </p>

              <p className="text-xs text-gray-600">
                {formatDate(exp.start_date)} –{" "}
                {exp.is_current ? "Present" : formatDate(exp.end_date)}
              </p>

              {exp.description && (
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  {exp.description
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => (
                      <li key={idx}>{line.replace("•", "").trim()}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ===== PROJECTS ===== */}
      {Array.isArray(data?.project) && data.project.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b mb-2">
            Projects
          </h2>

          {data.project.map((proj, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">{proj.name}</p>

              {proj.description && (
                <ul className="list-disc ml-5 mt-2">
                  {proj.description
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                </ul>
              )}

              {proj.technologies?.length > 0 && (
                <p className="text-xs mt-1">
                  <strong>Technologies:</strong>{" "}
                  {proj.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ===== EDUCATION ===== */}
      {Array.isArray(data?.education) && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b mb-2">
            Education
          </h2>

          {data.education.map((edu, i) => (
            <div key={i} className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{edu.degree}</p>
                <p>{edu.institution}</p>
              </div>

              <span className="text-xs text-gray-600">
                {formatDate(edu.start_date)} –{" "}
                {edu.is_current ? "Present" : formatDate(edu.end_date)}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* ===== SKILLS ===== */}
      {Array.isArray(data?.skills) && data.skills.length > 0 && (
        <section>
          <h2 className="text-base font-bold uppercase border-b mb-2">
            Technical Skills
          </h2>

          <p>{data.skills.join(", ")}</p>
        </section>
      )}
    </div>
  );
};

export default PdfStyleTemplate;
