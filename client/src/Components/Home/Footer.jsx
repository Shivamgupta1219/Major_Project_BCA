import { Sparkles, Linkedin, Github, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const QUICK_LINKS = [
  { href: "/",            label: "Home" },
  { href: "#features",    label: "Features" },
  { href: "#testimonials",label: "Reviews" },
  { href: "#cta",         label: "Get Started" },
];

const RESOURCES = [
  { href: "/", label: "Resume Tips" },
  { href: "/", label: "Career Guide" },
  { href: "/", label: "Interview Prep" },
  { href: "/", label: "FAQs" },
];

const SOCIALS = [
  { Icon: Linkedin, href: "#" },
  { Icon: Github,   href: "#" },
  { Icon: Twitter,  href: "#" },
  { Icon: Mail,     href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-400 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Campus<span className="text-indigo-400">CV</span>
            </span>
          </Link>
          <p className="text-sm leading-6 text-slate-500 max-w-xs">
            AI-powered resume builder for students — create ATS-friendly resumes
            that help you land internships and dream jobs.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {SOCIALS.map(({ Icon, href }) => (
              <a
                key={href + Icon.name}
                href={href}
                className="p-2 rounded-full bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-indigo-400 transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
            Resources
          </h3>
          <ul className="space-y-3 text-sm">
            {RESOURCES.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-indigo-400 transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>© 2026 CampusCV. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="/" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
