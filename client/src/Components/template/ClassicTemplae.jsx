const ClassicTemplate = ({ data, accentColor }) => {
  const fmt = (d) => {
    if (!d) return "";
    const [y, m] = d.split("-");
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const SectionHeading = ({ children }) => (
    <h2
      className="text-xs font-bold uppercase tracking-widest mb-3 pb-1 border-b-2"
      style={{ color: accentColor, borderColor: accentColor }}
    >
      {children}
    </h2>
  );

  return (
    <div className="w-full bg-white p-8 text-gray-800 text-[13px] leading-relaxed font-sans">
      {/* ── HEADER ── */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.profession && (
          <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>
            {data.personal_info.profession}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-600 text-xs">
          {data.personal_info?.email    && <span>{data.personal_info.email}</span>}
          {data.personal_info?.phone    && <span>{data.personal_info.phone}</span>}
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
          {data.personal_info?.linkedin && <span>{data.personal_info.linkedin}</span>}
          {data.personal_info?.github   && <span>{data.personal_info.github}</span>}
          {data.personal_info?.website  && <span>{data.personal_info.website}</span>}
        </div>
      </header>

      {/* ── SUMMARY ── */}
      {data.professional_summary && (
        <section className="mb-5">
          <SectionHeading>Professional Summary</SectionHeading>
          <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <SectionHeading>{data.section_titles?.experience || "Work Experience"}</SectionHeading>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-gray-900">{exp.position}</span>
                    {exp.company && <span className="text-gray-600"> — {exp.company}</span>}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}
                  </span>
                </div>
                {exp.description && (
                  <ul className="mt-1.5 space-y-0.5 pl-4">
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
        <section className="mb-5">
          <SectionHeading>Projects</SectionHeading>
          <div className="space-y-3">
            {data.project.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-900">{proj.name}</span>
                  {proj.type && <span className="text-xs text-gray-500">{proj.type}</span>}
                </div>
                {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
                {proj.technologies?.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Technologies: {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {data.education?.length > 0 && (
        <section className="mb-5">
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-gray-900">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </span>
                  {edu.institution && <p className="text-gray-600">{edu.institution}</p>}
                  {edu.gpa && <p className="text-xs text-gray-500">CGPA: {edu.gpa}</p>}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {fmt(edu.start_date)} – {edu.is_current ? "Present" : fmt(edu.end_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SKILLS ── */}
      {data.skills?.length > 0 && (
        <section className="mb-5">
          <SectionHeading>Skills</SectionHeading>
          <p className="text-gray-700">{data.skills.join(" • ")}</p>
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {data.certifications?.length > 0 && (
        <section className="mb-5">
          <SectionHeading>Certifications</SectionHeading>
          <div className="space-y-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-gray-900">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
                  {cert.credential_id && (
                    <p className="text-xs text-gray-500">ID: {cert.credential_id}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {fmt(cert.issue_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
