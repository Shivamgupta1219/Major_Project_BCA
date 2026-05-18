const ModernTemplate = ({ data, accentColor }) => {
  const fmt = (d) => {
    if (!d) return "";
    const [y, m] = d.split("-");
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const accent = accentColor || "#6366f1";

  return (
    <div className="w-full bg-white font-sans text-[13px] text-gray-800 leading-relaxed">
      {/* ── HEADER ── */}
      <header className="px-8 pt-8 pb-6" style={{ borderBottom: `4px solid ${accent}` }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.profession && (
          <p className="text-base font-medium mb-3" style={{ color: accent }}>
            {data.personal_info.profession}
          </p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
          {data.personal_info?.email    && <span>✉ {data.personal_info.email}</span>}
          {data.personal_info?.phone    && <span>✆ {data.personal_info.phone}</span>}
          {data.personal_info?.location && <span>⌖ {data.personal_info.location}</span>}
          {data.personal_info?.linkedin && <span>in {data.personal_info.linkedin}</span>}
          {data.personal_info?.github   && <span>⌥ {data.personal_info.github}</span>}
          {data.personal_info?.website  && <span>⌘ {data.personal_info.website}</span>}
        </div>
      </header>

      <div className="px-8 py-6 space-y-6">
        {/* ── SUMMARY ── */}
        {data.professional_summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
          </section>
        )}

        {/* ── EXPERIENCE ── */}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              {data.section_titles?.experience || "Work Experience"}
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i} className="pl-4" style={{ borderLeft: `2px solid ${accent}` }}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <span className="font-semibold text-gray-900">{exp.position}</span>
                    <span className="text-xs text-gray-500">
                      {fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}
                    </span>
                  </div>
                  {exp.company && (
                    <p className="text-sm font-medium mb-1.5" style={{ color: accent }}>{exp.company}</p>
                  )}
                  {exp.description && (
                    <ul className="space-y-0.5 pl-3">
                      {exp.description.split("\n").filter(Boolean).map((line, j) => (
                        <li key={j} className="text-gray-700 list-disc">{line.replace(/^[-•]\s*/, "")}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {data.project?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Projects
            </h2>
            <div className="space-y-4">
              {data.project.map((proj, i) => (
                <div key={i} className="pl-4" style={{ borderLeft: `2px solid ${accent}` }}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <span className="font-semibold text-gray-900">{proj.name}</span>
                    {proj.type && <span className="text-xs text-gray-500">{proj.type}</span>}
                  </div>
                  {proj.description && <p className="text-gray-700 mt-1">{proj.description}</p>}
                  {proj.technologies?.length > 0 && (
                    <p className="text-xs mt-1" style={{ color: accent }}>
                      Stack: {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EDUCATION ── */}
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                    </p>
                    <p style={{ color: accent }}>{edu.institution}</p>
                    {edu.gpa && <p className="text-xs text-gray-500">CGPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-xs text-gray-500">
                    {fmt(edu.start_date)} – {edu.is_current ? "Present" : fmt(edu.end_date)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SKILLS ── */}
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium rounded-full text-white"
                  style={{ backgroundColor: accent }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── CERTIFICATIONS ── */}
        {data.certifications?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <span className="font-semibold text-gray-900">{cert.name}</span>
                    {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
                  </div>
                  {cert.issue_date && (
                    <span className="text-xs text-gray-500">{fmt(cert.issue_date)}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
