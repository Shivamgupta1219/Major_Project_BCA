import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#3B82F6" },

    personal_info: {
      full_name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      profession: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
      image: { type: String, default: "" },
    },

    professional_summary: { type: String, default: "" },

    experience: [
      {
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        start_date: { type: String, default: "" },
        end_date: { type: String, default: "" },
        description: { type: String, default: "" },
        is_current: { type: Boolean, default: false },
      },
    ],
    project: [
      {
        name: { type: String, default: "" },
        type: { type: String, default: "" },
        description: { type: String, default: "" }, technologies: { type: [String], default: [] },
      },
    ],
    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        gpa: { type: String, default: "" },
        start_date: { type: String, default: "" },
        end_date: { type: String, default: "" },
        description: { type: String, default: "" },
        is_current: { type: Boolean, default: false },
      },
    ],
    skills: { type: Array, default: [] },

    certifications: [
  {
    //  _id: { type: String },
    name: { type: String, default: "" },
    issuer: { type: String, default: "" },
    issue_date: { type: String, default: "" },
    expiry_date: { type: String, default: "" },
    credential_id: { type: String, default: "" },
    credential_url: { type: String, default: "" },
  },
],
  },
  
  { timestamps: true, minimize: false }
);


export default mongoose.model("Resume", resumeSchema);
