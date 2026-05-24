import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CallToAction() {
  const { user } = useSelector((s) => s.auth);

  return (
    <section
      id="cta"
      className="relative bg-slate-950 py-28 px-6 overflow-hidden"
    >
      {/* Glow orbs */}
      <div className="absolute top-[-20%] left-[30%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Free to get started — no credit card needed
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Your dream job is{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            one resume away
          </span>
        </h2>

        <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          Join thousands of students who built ATS-optimised resumes and landed
          roles at Google, Microsoft, Amazon, and top startups.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={user ? "/app" : "/login?state=register"}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            {user ? "Go to Dashboard" : "Build My Resume — Free"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 px-8 py-3.5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium rounded-full transition-all"
          >
            See how it works
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-slate-500 text-sm">
          {["No credit card", "6 templates included", "ATS-optimised", "AI-powered"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
