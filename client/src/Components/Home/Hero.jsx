import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, FileText, Target, Zap, X, Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "#features",     label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Reviews" },
];

const STATS = [
  { value: "6+",   label: "Templates" },
  { value: "AI",   label: "Powered" },
  { value: "ATS",  label: "Optimised" },
  { value: "Free", label: "To Use" },
];

export default function Hero() {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* ── Background glow orbs ── */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-5%] w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

      {/* ── Navbar ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 py-5 border-b border-white/5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Campus<span className="text-indigo-400">CV</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/app"
              className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/login?state=register"
                className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 text-lg">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-slate-300 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            to={user ? "/app" : "/login"}
            className="mt-4 px-8 py-3 bg-indigo-600 rounded-full text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            {user ? "Dashboard" : "Get Started"}
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* ── Hero content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 pt-20 pb-16">
        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
          <Zap className="w-3.5 h-3.5" />
          AI-Powered Resume Builder for Students
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          Build a Resume That{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Gets You Hired
          </span>
        </h1>

        {/* Sub */}
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          From first internship to dream job — create ATS-optimised resumes in
          minutes with AI writing assistance, real-time scoring, and
          professional templates.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            to={user ? "/app" : "/login?state=register"}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            {user ? "Go to Dashboard" : "Start Building Free"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 px-8 py-3.5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium rounded-full transition-all"
          >
            See Features
          </a>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Floating feature pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: FileText, text: "6 ATS Templates" },
            { icon: Target,   text: "Real-Time ATS Score" },
            { icon: Sparkles, text: "AI Writing Assistant" },
            { icon: Zap,      text: "One-Click PDF Export" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm"
            >
              <Icon className="w-3.5 h-3.5 text-indigo-400" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Gradient fade to next section ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </div>
  );
}
