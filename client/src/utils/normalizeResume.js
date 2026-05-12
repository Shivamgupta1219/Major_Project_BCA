import { defaultResumeSchema } from "./resumeSchema";

export function normalizeResume(resume) {
  return {
    ...defaultResumeSchema,
    ...resume,

    personal_info: {
      ...defaultResumeSchema.personal_info,
      ...(resume.personal_info || {}),
    },

    section_titles: {
      ...defaultResumeSchema.section_titles,
      ...(resume.section_titles || {}),
    },

    experience: resume.experience || [],
    education: resume.education || [],
    project: resume.project || [],
    skills: resume.skills || [],
    certifications: resume.certifications || [],
  };
}
