/**
 * ATS Clean Template
 * - Pure single column, no icons, no coloured boxes
 * - Bold ALL-CAPS section headings with a full-width rule
 * - Skills as plain comma-separated text (ATS parsers love this)
 * - Bullet points for descriptions
 * Maximum ATS compatibility
 */
const ATSCleanTemplate = ({ data }) => {
  const fmt = (d) => {
    if (!d) return "";
    const [y, m] = d.split("-");
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const Divider = () => (
    <hr className="border-t border-gray-800 mt-0.5 mb-3" />
  );

  const SectionTitle = ({ children }) => (
    <div className="mb-1">
      <h2 className="text-[12px] font-black uppercase tracking-[0.15em] text-gray-900">{children}</h2>
      <Divider />
    </div>
  );

  const pi = data.personal_info || {};

  const contactParts = [
    pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website,
  ].filter(Boolean);

  return (
    <div className="w-full bg-white p-10 font-sans text-[12.5px] leading-[1.55] text-gray-900">
      {/* ── NAME ── */}
      <header className="text-center mb-4">
        <h1 className="text-[26px] font-black uppercase tracking-[0.08em] text-gray-900 mb-1">
          {pi.full_name || "YOUR NAME"}
        </h1>
        {pi.profession && (
          <p className="text-[13px] font-semibold text-gray-700 mb-1">{pi.profession}</p>
        )}
        {/* Plain contact line — easiest for ATS to parse */}
        <p className="text-[11px] text-gray-700">
          {contactParts.join("  |  ")}
        </p>
      </header>

      {/* ── SUMMARY ── */}
      {data.professional_summary && (
        <section className="mb-4">
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-gray-800 leading-relaxed">{data.professional_summary}</p>
        </section>
      )}

      {/* ── SKILLS ── plain text = best ATS score ── */}
      {data.skills?.length > 0 && (
        <section className="mb-4">
          <SectionTitle>Technical Skills</SectionTitle>
          <p className="text-gray-800">{data.skills.join(", ")}</p>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {data.experience?.length > 0 && (
        <section className="mb-4">
          <SectionTitle>{data.section_titles?.experience || "Work Experience"}</SectionTitle>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                {/* Row 1: title | dates */}
                <div className="flex justify-between items-baseline">
                  <strong className="text-gray-900 font-bold">{exp.position}</strong>
                  <span className="text-[11px] text-gray-600">
                    {fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}
                  </span>
                </div>
                {/* Row 2: company */}
                {exp.company && (
                  <p className="italic text-gray-700 text-[12px]">{exp.company}</p>
                )}
                {/* Bullets */}
                {exp.description && (
                  <ul className="mt-1 space-y-0.5 pl-5 list-disc text-gray-800">
                    {exp.description.split("\n").filter(Boolean).map((line, j) => (
                      <li key={j}>{line.replace(/^[-•*]\s*/, "")}</li>
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
        <section className="mb-4">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-3">
            {data.project.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <strong className="text-gray-900">{proj.name}</strong>
                  {proj.type && <span className="text-[11px] text-gray-600 italic">{proj.type}</span>}
                </div>
                {proj.description && <p className="text-gray-800 mt-0.5">{proj.description}</p>}
                {proj.technologies?.length > 0 && (
                  <p className="text-[11px] text-gray-600 mt-0.5">
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
        <section className="mb-4">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <strong className="text-gray-900">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </strong>
                  <span className="text-[11px] text-gray-600">
                    {fmt(edu.start_date)} – {edu.is_current ? "Present" : fmt(edu.end_date)}
                  </span>
                </div>
                {edu.institution && <p className="text-gray-700 italic">{edu.institution}</p>}
                {edu.gpa && <p className="text-[11px] text-gray-600">CGPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {data.certifications?.length > 0 && (
        <section className="mb-4">
          <SectionTitle>Certifications</SectionTitle>
          <div className="space-y-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <strong className="text-gray-900">{cert.name}</strong>
                  {cert.issuer && <span className="text-gray-700"> — {cert.issuer}</span>}
                  {cert.credential_id && (
                    <span className="text-[11px] text-gray-500"> (ID: {cert.credential_id})</span>
                  )}
                </div>
                {cert.issue_date && (
                  <span className="text-[11px] text-gray-600">{fmt(cert.issue_date)}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ATSCleanTemplate;
