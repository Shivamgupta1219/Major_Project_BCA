import { UserPlus, FileEdit, Download } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: UserPlus,
    title: "Sign up for free",
    description:
      "Create your account in seconds — no credit card required. Import an existing PDF or start fresh from a template.",
    color: "indigo",
  },
  {
    step: "02",
    icon: FileEdit,
    title: "Build with AI",
    description:
      "Fill in your details, let the AI polish your bullet points, then pick a template and accent colour that fits your industry.",
    color: "purple",
  },
  {
    step: "03",
    icon: Download,
    title: "Download & apply",
    description:
      "Export a pixel-perfect, ATS-ready PDF instantly. Check your real-time ATS score before you hit submit.",
    color: "cyan",
  },
];

const ICON_STYLES = {
  indigo: { wrap: "bg-indigo-500/10 border-indigo-500/20", icon: "text-indigo-400", line: "bg-indigo-500/30", step: "text-indigo-400" },
  purple: { wrap: "bg-purple-500/10 border-purple-500/20", icon: "text-purple-400", line: "bg-purple-500/30", step: "text-purple-400" },
  cyan:   { wrap: "bg-cyan-500/10  border-cyan-500/20",   icon: "text-cyan-400",   line: "bg-cyan-500/30",  step: "text-cyan-400"   },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-slate-950 py-24 px-6 md:px-16 lg:px-24 scroll-mt-16"
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            Simple process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-3 mb-4">
            From zero to hired{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              in three steps
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            No resume-writing experience needed. Our AI guides you every step of
            the way.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ step, icon: Icon, title, description, color }, i) => {
            const s = ICON_STYLES[color];
            return (
              <div key={step} className="relative flex flex-col items-start">
                {/* Connector line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div
                    className={`hidden md:block absolute top-8 left-[calc(100%+0px)] w-full h-px ${s.line} translate-x-4`}
                    style={{ width: "calc(100% - 2rem)" }}
                  />
                )}

                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-5 ${s.wrap}`}>
                  <Icon className={`w-7 h-7 ${s.icon}`} />
                </div>

                <span className={`text-xs font-bold uppercase tracking-widest mb-2 ${s.step}`}>
                  Step {step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fade to white for next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
