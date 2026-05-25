const MinimalTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
<div className="max-w-4xl mx-auto p-6 bg-white text-gray-900 leading-tight text-sm">

  {/* Header */}
  <header className="mb-4 border-b pb-3">
    <h1 className="text-2xl font-semibold tracking-wide mb-1">
      {data.personal_info?.full_name || "Your Name"}
    </h1>

    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
      {data.personal_info?.email && <span>Email: {data.personal_info.email}</span>}
      {data.personal_info?.phone && <span>Phone: {data.personal_info.phone}</span>}
      {data.personal_info?.location && <span>{data.personal_info.location}</span>}
      {data.personal_info?.linkedin && (
        <span className="break-all">LinkedIn: {data.personal_info.linkedin}</span>
      )}
      {data.personal_info?.website && (
        <span className="break-all">Portfolio: {data.personal_info.website}</span>
      )}
    </div>
  </header>

      {/* Professional Summary */}
      {data.professional_summary && (
<section className="mb-8 pb-4 border-b">
  <h2    className="text-base font-semibold uppercase tracking-wide mb-3"
            style={{ color: accentColor }}>
            {data.section_titles?.professional_summary || "Professional Summary"}
          </h2>
          <p className=" text-gray-700">{data.professional_summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
      <section className="mb-8 pb-4 border-b">
          <h2
           className="text-base font-semibold uppercase tracking-wide mb-3"
            style={{ color: accentColor }}
          >
            Skills
          </h2>

          <ul className="flex flex-wrap gap-2 text-gray-700">
            {data.skills.map((skill, index) => (
              <li key={index} className="border px-2 py-1 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      )}
      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
   <section className="mb-8 pb-4 border-b">
          <h2   className="text-base font-semibold uppercase tracking-wide mb-3"
            style={{ color: accentColor }}>
            {data.section_titles?.experience || "Work Experience"}
          </h2>

          <div className="space-y-3">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium">{exp.position}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{exp.company}</p>
                {exp.description && (
                  // <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  //   {exp.description}
                  // </div>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {exp.description?.split("\n").map((point, i) => (
                      <li key={i}>
                        {point.includes("React") ? (
                          <strong>{point}</strong>
                        ) : (
                          point
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.project && data.project.length > 0 && (
<section className="mb-8 pb-4 border-b">
          <h2
         className="text-base font-semibold uppercase tracking-wide mb-3"
            style={{ color: accentColor }}
          >
            Projects
          </h2>

          <div className="space-y-4">
            {data.project.map((proj, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 justify-between items-baseline"
              >
                <h3 className="text-lg font-medium ">{proj.name}</h3>
                <p className="text-gray-700">{proj.description}</p>

                {proj.tech_stack && (
                  <p className="text-sm text-gray-500">
                    Tech: {proj.tech_stack.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
      <section className="mb-8 pb-4 border-b">
          <h2
             className="text-base font-semibold uppercase tracking-wide mb-3"
            style={{ color: accentColor }}
          >
            Education
          </h2>

          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(edu.graduation_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {/* {data.certifications && data.certifications.length > 0 && (
    <section className="mb-8 pb-4 border-b">
          <h2
            className="text-base font-semibold uppercase tracking-wide mb-3"
            style={{ color: accentColor }}
          >
            Certifications
          </h2>

          <div className="space-y-2">
            {data.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                </div>
                {cert.date && (
                  <span className="text-sm text-gray-500">
                    {formatDate(cert.date)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )} */}
      {data.certifications && data.certifications.length > 0 && (
  <section className="mb-8 pb-4 border-b">
    <h2
      className="text-base font-semibold uppercase tracking-wide mb-3"
      style={{ color: accentColor }}
    >
      Certifications
    </h2>

    <div className="space-y-3">
      {data.certifications.map((cert, index) => (
        <div key={index} className="flex justify-between items-start">
          
          {/* Left Side */}
          <div>
            <h3 className="font-medium">{cert.name}</h3>
            <p className="text-gray-600">{cert.issuer}</p>

            {/* Credential ID */}
            {cert.credential_id && (
              <p className="text-sm text-gray-500">
                ID: {cert.credential_id}
              </p>
            )}

            {/* URL */}
            {cert.credential_url && (
              <a
                href={cert.credential_url}
                target="_blank"
                className="text-sm text-blue-500 underline"
              >
                View Credential
              </a>
            )}
          </div>

          {/* Right Side (Dates) */}
          <div className="text-sm text-gray-500 text-right">
            {cert.issue_date && <p>{formatDate(cert.issue_date)}</p>}
            {cert.expiry_date && (
              <p>Exp: {formatDate(cert.expiry_date)}</p>
            )}
          </div>

        </div>
      ))}
    </div>
  </section>
)}
    </div>
  );
};

export default MinimalTemplate;
