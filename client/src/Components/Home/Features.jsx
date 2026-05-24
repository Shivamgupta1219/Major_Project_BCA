import {
  Sparkles,
  Target,
  FileText,
  Upload,
  Download,
  Briefcase,
  CheckCircle,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    color: "indigo",
    title: "AI Writing Assistant",
    description:
      "Generate compelling bullet points, summaries, and job descriptions tailored to your target role — in seconds.",
  },
  {
    icon: Target,
    color: "purple",
    title: "Real-Time ATS Score",
    description:
      "See exactly how your resume scores against ATS filters before you apply, with actionable tips to improve.",
  },
  {
    icon: FileText,
    color: "cyan",
    title: "6 ATS-Friendly Templates",
    description:
      "Choose from Classic, Modern, Minimal, ATS Clean, and ATS Executive templates — all optimised for keyword parsing.",
  },
  {
    icon: Upload,
    color: "violet",
    title: "Import Existing Resume",
    description:
      "Upload a PDF and our AI extracts your data automatically, so you never start from scratch.",
  },
  {
    icon: Download,
    color: "sky",
    title: "One-Click PDF Export",
    description:
      "Download a pixel-perfect, print-ready PDF of your resume at any time — no watermarks, no paywalls.",
  },
  {
    icon: Briefcase,
    color: "emerald",
    title: "Job-Match Analysis",
    description:
      "Paste a job description and get an AI-powered gap analysis showing exactly what keywords you're missing.",
  },
];

const COLOR_MAP = {
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-100 hover:border-indigo-300",
    iconBg: "bg-indigo-100",
    icon: "text-indigo-600",
    dot: "bg-indigo-500",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-300",
    iconBg: "bg-purple-100",
    icon: "text-purple-600",
    dot: "bg-purple-500",
  },
  cyan: {
    bg: "bg-cyan-50",
    border: "border-cyan-100 hover:border-cyan-300",
    iconBg: "bg-cyan-100",
    icon: "text-cyan-600",
    dot: "bg-cyan-500",
  },
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-100 hover:border-violet-300",
    iconBg: "bg-violet-100",
    icon: "text-violet-600",
    dot: "bg-violet-500",
  },
  sky: {
    bg: "bg-sky-50",
    border: "border-sky-100 hover:border-sky-300",
    iconBg: "bg-sky-100",
    icon: "text-sky-600",
    dot: "bg-sky-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-100 hover:border-emerald-300",
    iconBg: "bg-emerald-100",
    icon: "text-emerald-600",
    dot: "bg-emerald-500",
  },
};

export default function Features() {
  return (
    <section id="features" className="bg-white py-24 px-6 md:px-16 lg:px-24 scroll-mt-16">
      {/* Section label */}
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          Everything you need
        </span>
      </div>

      {/* Heading */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Built for students,{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            loved by recruiters
          </span>
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed">
          Every feature is designed to help you land more interviews — from your
          first internship to your dream job.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {FEATURES.map(({ icon: Icon, color, title, description }) => {
          const c = COLOR_MAP[color];
          return (
            <div
              key={title}
              className={`group relative rounded-2xl border p-6 transition-all duration-200 ${c.bg} ${c.border} hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.iconBg}`}>
                <Icon className={`w-5 h-5 ${c.icon}`} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
