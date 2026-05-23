const ROLE_KEYWORDS = {
  "frontend developer": [
    "react", "javascript", "typescript", "html", "css", "tailwind",
    "redux", "next.js", "rest api", "responsive", "git", "es6", "hooks",
  ],
  "backend developer": [
    "node", "express", "mongodb", "sql", "rest api", "authentication",
    "jwt", "docker", "git", "redis", "postgres", "microservices",
  ],
  "fullstack developer": [
    "react", "node", "express", "mongodb", "rest api", "javascript",
    "git", "html", "css", "jwt", "deployment",
  ],
  "data analyst": [
    "sql", "excel", "python", "pandas", "tableau", "power bi", "statistics",
    "data visualization", "etl", "numpy",
  ],
  "python developer": [
    "python", "django", "flask", "rest api", "sql", "oop", "git",
    "pandas", "numpy", "postgres",
  ],
  "java developer": [
    "java", "spring", "spring boot", "hibernate", "sql", "rest api",
    "git", "maven", "junit", "oop",
  ],
  "bpo executive": [
    "communication", "customer service", "email", "ms office",
    "problem solving", "english", "typing",
  ],
  "hr executive": [
    "recruitment", "onboarding", "communication", "ms office",
    "employee engagement", "payroll", "hr policies",
  ],
  "digital marketing intern": [
    "seo", "social media", "google analytics", "content writing",
    "canva", "ads", "email marketing", "copywriting",
  ],
  general: [
    "communication", "teamwork", "leadership", "problem solving",
    "git", "github", "ms office", "english",
  ],
};

const normalize = (s) => (typeof s === "string" ? s.toLowerCase() : "");

const flatten = (resume) => {
  const personal = resume.personal_info || {};
  const parts = [
    personal.profession,
    resume.professional_summary,
    ...(resume.experience || []).flatMap((e) => [
      e.company, e.position, e.description,
    ]),
    ...(resume.project || []).flatMap((p) => [
      p.name, p.type, p.description, ...(p.technologies || []),
    ]),
    ...(resume.education || []).flatMap((e) => [
      e.institution, e.degree, e.field, e.description,
    ]),
    ...(resume.skills || []).map((s) =>
      typeof s === "string" ? s : s?.name || ""
    ),
    ...(resume.certifications || []).flatMap((c) => [c.name, c.issuer]),
  ];
  return parts.filter(Boolean).map(normalize).join(" \n ");
};

const countWords = (s) => (s ? s.trim().split(/\s+/).length : 0);

export function scoreResume(resume, targetRole = "") {
  const suggestions = [];
  const personal = resume.personal_info || {};
  const summary = resume.professional_summary || "";
  const projects = resume.project || [];
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = (resume.skills || []).map((s) =>
    typeof s === "string" ? s : s?.name || ""
  );
  const text = flatten(resume);

  // 1) ATS readability (15 pts) — essential contact + structure
  let ats = 0;
  const atsFields = [
    ["full_name", "Add your full name in the header."],
    ["email", "Add a contact email."],
    ["phone", "Add a phone number."],
    ["location", "Add your location (city, country)."],
  ];
  for (const [key, msg] of atsFields) {
    if (personal[key] && String(personal[key]).trim().length > 1) ats += 3;
    else suggestions.push(msg);
  }
  if (education.length > 0) ats += 3;
  else suggestions.push("Add at least one education entry.");

  // 2) Keywords (20 pts)
  let keywords = 10;
  const roleKey = normalize(targetRole).trim();
  const bank = ROLE_KEYWORDS[roleKey] || ROLE_KEYWORDS.general;
  const matched = bank.filter((k) => text.includes(k));
  const missing = bank.filter((k) => !text.includes(k));
  if (roleKey && ROLE_KEYWORDS[roleKey]) {
    keywords = Math.min(20, Math.round((matched.length / bank.length) * 20));
    if (missing.length > 0) {
      suggestions.push(
        `Missing keywords for ${targetRole}: ${missing.slice(0, 6).join(", ")}.`
      );
    }
  } else {
    keywords = Math.min(20, 8 + matched.length);
  }

  // 3) Grammar (15 pts) — basic heuristics
  let grammar = 15;
  const allCapsBlocks = (
    (summary + " " + (experience.map((e) => e.description).join(" ")) + " " +
      projects.map((p) => p.description).join(" ")).match(/\b[A-Z]{6,}\b/g) || []
  );
  if (allCapsBlocks.length > 0) {
    grammar -= Math.min(5, allCapsBlocks.length);
    suggestions.push("Avoid ALL-CAPS words — use sentence case.");
  }
  const repeatedChars = /(.)\1{3,}/.test(summary);
  if (repeatedChars) {
    grammar -= 2;
    suggestions.push("Fix typos with repeated characters in summary.");
  }
  if (summary && !/[.!?]$/.test(summary.trim())) {
    grammar -= 2;
    suggestions.push("End your professional summary with a period.");
  }
  if (summary && !/^[A-Z]/.test(summary.trim())) {
    grammar -= 2;
    suggestions.push("Capitalize the first letter of your summary.");
  }
  grammar = Math.max(0, grammar);

  // 4) Projects (20 pts) — count, description depth, tech stack
  let projectScore = 0;
  if (projects.length >= 2) projectScore += 8;
  else if (projects.length === 1) projectScore += 4;
  else suggestions.push("Add at least 2 projects to strengthen your resume.");

  const wellDescribed = projects.filter(
    (p) => (p.description || "").trim().length >= 60
  ).length;
  projectScore += Math.min(6, wellDescribed * 3);
  if (projects.length > 0 && wellDescribed < projects.length) {
    suggestions.push(
      "Expand project descriptions — explain what you built, tech used, and impact."
    );
  }
  const withTech = projects.filter(
    (p) => (p.technologies || []).length > 0
  ).length;
  projectScore += Math.min(6, withTech * 2);
  if (projects.length > 0 && withTech < projects.length) {
    suggestions.push("List the tech stack for each project.");
  }
  projectScore = Math.min(20, projectScore);

  // 5) Skills (15 pts)
  let skillScore = Math.min(15, skills.length * 2);
  if (skills.length < 5) {
    suggestions.push(
      "Add at least 5 relevant skills. Match them to your target role."
    );
  }

  // 6) Formatting (15 pts) — summary length, links, sectioning
  let formatting = 0;
  const summaryWords = countWords(summary);
  if (summaryWords >= 20 && summaryWords <= 80) formatting += 5;
  else if (summaryWords > 0) formatting += 2;
  else suggestions.push("Add a 2-3 sentence professional summary.");

  if (personal.linkedin) formatting += 3;
  else suggestions.push("Add your LinkedIn URL.");

  if (personal.github) formatting += 3;
  else if (roleKey.includes("developer") || roleKey.includes("python") || roleKey.includes("java")) {
    suggestions.push("Add your GitHub URL — important for developer roles.");
  } else {
    formatting += 1;
  }

  if (experience.length > 0 || projects.length >= 2) formatting += 4;
  else suggestions.push("Add internships, experience, or at least 2 projects.");
  formatting = Math.min(15, formatting);

  const overall = Math.min(
    100,
    ats + keywords + grammar + projectScore + skillScore + formatting
  );

  return {
    overall,
    ats,
    keywords,
    grammar,
    projects: projectScore,
    skills: skillScore,
    formatting,
    suggestions: [...new Set(suggestions)].slice(0, 10),
    targetRole,
    computedAt: new Date(),
  };
}

export const supportedRoles = Object.keys(ROLE_KEYWORDS).filter(
  (k) => k !== "general"
);
