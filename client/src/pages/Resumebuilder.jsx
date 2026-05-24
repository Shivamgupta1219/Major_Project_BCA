import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { normalizeResume } from "../utils/normalizeResume";
import PersonalInfoForm from "../Components/PersonalInfoForm";
import ResumePreview from "../Components/ResumePreview";
import TemplateSelector from "../Components/template/TemplateSelector";
import ATSScoreMeter from "../Components/template/ATSScoreMeter";
import ResumeScoreCard from "../Components/ResumeScoreCard";
import ZoomControls from "../Components/Features/ZoomControls";
import DownloadPdfButton from "../Components/Features/DownloadPdfButton";
import { ArrowLeftIcon, ChevronLeft, ChevronRight, Save, CheckCircle } from "lucide-react";
import ProfessionalSummaryForm from "../Components/ProfessionalSummaryForm";
import ExperienceForm from "../Components/ExperienceForm";
import EducationForm from "../Components/EducationForm";
import SkillsForm from "../Components/SkillsForm";
import ProjectForm from "../Components/ProjectForm";
import Certification from "../Components/Certification";
import api from "../configs/api.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

/* ================= SECTIONS CONFIG ================= */
const sections = [
  { id: "personal_info", label: "Personal Info" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "project", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
];

export default function ResumeBuilder() {
  const { token } = useSelector((state) => state.auth); // still needed for useEffect dependency
  const { resumeId } = useParams();
  const printRef = useRef(null); // Single ref for printing
  const [zoom, setZoom] = useState(1);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const activeSection = sections[activeSectionIndex];
  // justSavedRef: when true, the next [resumeData] effect is from our own save/load — skip it
  const justSavedRef = useRef(false);
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      profession: "",
      linkedin: "",
      github: "",
      website: "",
      image: "",
    },
    section_titles: {
      experience: "Work Experience",
    },
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
    certifications: [],
  });

  /* ================= LOAD RESUME DATA ================= */
  useEffect(() => {
    if (!resumeId || !token) return;

    const fetchResume = async () => {
      try {
        const { data } = await api.get(`/api/resume/${resumeId}`);
        const normalized = normalizeResume(data.resume);
        justSavedRef.current = true; // next effect fire should not mark unsaved
        setResumeData(normalized);
        setIsSaved(true);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load resume");
      }
    };

    fetchResume();
  }, [resumeId, token]);

  useEffect(() => {
    if (!resumeData._id) return;
    if (justSavedRef.current) {
      justSavedRef.current = false; // consume the flag, don't mark unsaved
      return;
    }
    setIsSaved(false);
  }, [resumeData]);

  const updateExperienceTitle = (newTitle) => {
    setResumeData((prev) => ({
      ...prev,
      section_titles: {
        ...prev.section_titles,
        experience: newTitle,
      },
    }));
  };

  const saveResume = async (id) => {
    try {
      setIsSaving(true);
      const { data } = await api.put(`/api/resume/${id}`, resumeData);
      justSavedRef.current = true; // block the next [resumeData] effect
      setResumeData(data.resume);
      setIsSaved(true);
      toast.success("Resume saved!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= BACK BUTTON ================= */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back To Dashboard
        </Link>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="max-w-7xl mx-auto px-4 pb-7">
        <div className="grid lg:grid-cols-12 gap-7">
          {/* ================= LEFT PANEL ================= */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Progress Bar */}
              <div className="relative h-1.5 bg-slate-100">
                <div
                  className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                  style={{
                    width: `${((activeSectionIndex + 1) / sections.length) * 100}%`,
                  }}
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center px-4 py-4 border-b border-slate-200 bg-slate-50">
                <button
                  onClick={() => setActiveSectionIndex((p) => Math.max(p - 1, 0))}
                  disabled={activeSectionIndex === 0}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="text-sm font-semibold text-slate-700">
                  {activeSectionIndex + 1} / {sections.length}
                </span>

                <button
                  onClick={() =>
                    setActiveSectionIndex((p) => Math.min(p + 1, sections.length - 1))
                  }
                  disabled={activeSectionIndex === sections.length - 1}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Section Title */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">
                  {activeSection.label}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Fill in your {activeSection.label.toLowerCase()} details
                </p>
              </div>

              <div className="p-6 max-h-[calc(100vh-400px)] overflow-y-auto">
                {/* personal info */}
                {activeSection.id === "personal_info" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {/* professional summary */}
                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    value={resumeData.professional_summary}
                    setResumeData={setResumeData}
                  />
                )}

                {/* experience */}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    title={resumeData.section_titles.experience}
                    onTitleChange={updateExperienceTitle}
                    onChange={(list) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: list,
                      }))
                    }
                  />
                )}

                {/* projects */}
                {activeSection.id === "project" && (
                  <ProjectForm
                    data={Array.isArray(resumeData.project) ? resumeData.project : []}
                    onChange={(list) =>
                      setResumeData((prev) => ({
                        ...prev,
                        project: Array.isArray(list) ? list : [list],
                      }))
                    }
                  />
                )}

                {/* Education */}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(list) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: list,
                      }))
                    }
                  />
                )}

                {/* Skills */}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(list) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: list,
                      }))
                    }
                  />
                )}

                {/* Certifications */}
                {activeSection.id === "certifications" && (
                  <Certification
                    data={resumeData.certifications}
                    onChange={(list) =>
                      setResumeData((prev) => ({
                        ...prev,
                        certifications: list,
                      }))
                    }
                  />
                )}
              </div>

              {/* Save Button */}
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => saveResume(resumeData._id)}
                  disabled={isSaving || isSaved}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold shadow-sm hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : isSaved ? (
                    <>
                      <CheckCircle size={18} />
                      All Changes Saved
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>

                {!isSaved && (
                  <p className="text-xs text-amber-600 text-center mt-2">
                    ⚠️ You have unsaved changes
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="lg:col-span-7 max-lg:mt-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
              <TemplateSelector
                value={resumeData.template}
                onChange={(value) =>
                  setResumeData((prev) => ({ ...prev, template: value }))
                }
              />

              <ZoomControls zoom={zoom} setZoom={setZoom} />

              <DownloadPdfButton
                targetRef={printRef}
                isSaved={isSaved}
                resumeTitle={resumeData.title || "Resume"}
              />
            </div>

            {/* Multi-category Resume Score */}
            <div className="mb-4">
              <ResumeScoreCard
                resumeId={resumeData._id}
                initialScore={resumeData.resumeScore}
              />
            </div>

            {/* ATS Score */}
            <ATSScoreMeter data={resumeData} />

            {/* PREVIEW (scaled for UI) */}
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                transition: "transform 0.2s",
              }}
            >
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
                classes="shadow-xl"
              />
            </div>

            {/* PRINT VERSION (hidden, full size, no zoom) */}
            <div
              style={{
                position: "absolute",
                top: "-9999px",
                left: "-9999px",
              }}
            >
              <div ref={printRef} id="print-area">
                <ResumePreview
                  data={resumeData}
                  template={resumeData.template}
                  accentColor={resumeData.accent_color}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}