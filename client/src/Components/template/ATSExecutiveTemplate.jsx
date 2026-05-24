/**
 * ATS Executive Template
 * Inspired by Google / FAANG recruiter-preferred format.
 * - Single column, generous white space
 * - Name left-aligned, contact right-aligned in header
 * - Thin coloured line under name (only decorative accent)
 * - Bold section titles with subtle full-width rule
 * - Bullet-pointed achievements with strong action verbs
 * - Skills as a single comma-separated paragraph (ATS-optimal)
 */
const ATSExecutiveTemplate = ({ data, accentColor }) => {
  const accent = accentColor || "#1d4ed8";

  const fmt = (d) => {
    if (!d) return "";
    const [y, m] = d.split("-");
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const pi = data.personal_info || {};

  return (
    <div className="w-full bg-white px-10 py-8 font-sans text-[12.5px] leading-[1.6] text-gray-900">
      {/* ── HEADER ── */}
      <header className="mb-5">
        <div className="flex justify-between items-end flex-wrap gap-2">
          <div>
            <h1 className="text-[28px] font-extrabold text-gray-900 leading-tight">
              {pi.full_name || "Your Name"}
            </h1>
            {pi.profession && (
              <p className="text-[13px] font-semibold mt-0.5" style={{ color: accent }}>
                {pi.profession}
              </p>
            )}
          </div>
          <div className="text-right text-[11px] text-gray-600 space-y-0.5">
            {pi.email    && <p>{pi.email}</p>}
            {pi.phone    && <p>{pi.phone}</p>}
            {pi.location && <p>{pi.location}</p>}
            {pi.linkedin && <p>{pi.linkedin}</p>}
            {pi.github   && <p>{pi.github}</p>}
            {pi.website  && <p>{pi.website}</p>}
          </div>
        </div>
        {/* Accent rule */}
        <div className="mt-3 h-[3px] rounded-full" style={{ backgroundColor: accent }} />
      </header>

      {/* ── SUMMARY ── */}
      {data.professional_summary && (
        <section className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-700">
              Professional Summary
            </h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <p className="text-gray-800 leading-relaxed">{data.professional_summary}</p>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-700 whitespace-nowrap">
              {data.section_titles?.experience || "Work Experience"}
            </h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="space-y-5">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <span className="font-bold text-gray-900 text-[13px]">{exp.position}</span>
                  <span className="text-[11px] text-gray-500">
                    {fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}
                  </span>
                </div>
                {exp.company && (
                  <p className="font-semibold text-[12px] mb-1.5" style={{ color: accent }}>
                    {exp.company}
                  </p>
                )}
                {exp.description && (
                  <ul className="pl-5 space-y-0.5 list-disc text-gray-800">
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
        <section className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-700">Projects</h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="space-y-3">
            {data.project.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <span className="font-bold text-gray-900">{proj.name}</span>
                  {proj.type && <span className="text-[11px] italic text-gray-500">{proj.type}</span>}
                </div>
                {proj.description && <p className="text-gray-800 mt-0.5">{proj.description}</p>}
                {proj.technologies?.length > 0 && (
                  <p className="text-[11px] mt-0.5" style={{ color: accent }}>
                    {proj.technologies.join(" · ")}
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
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-700">Education</h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <p className="font-bold text-gray-900">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </p>
                  {edu.institution && (
                    <p className="text-[12px]" style={{ color: accent }}>{edu.institution}</p>
                  )}
                  {edu.gpa && <p className="text-[11px] text-gray-500">CGPA: {edu.gpa}</p>}
                </div>
                <span className="text-[11px] text-gray-500 whitespace-nowrap">
                  {fmt(edu.start_date)} – {edu.is_current ? "Present" : fmt(edu.end_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SKILLS ── comma-separated paragraph, best for ATS ── */}
      {data.skills?.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-700">
              Core Competencies
            </h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <p className="text-gray-800">{data.skills.join("  ·  ")}</p>
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {data.certifications?.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-700">
              Certifications
            </h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <div className="space-y-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="flex justify-between items-baseline flex-wrap gap-1">
                <div>
                  <span className="font-semibold text-gray-900">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-700"> — {cert.issuer}</span>}
                </div>
                {cert.issue_date && (
                  <span className="text-[11px] text-gray-500">{fmt(cert.issue_date)}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ATSExecutiveTemplate;
