import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    handle: "@priya_sharma",
    role: "Software Engineer @ Google",
    avatar: "PS",
    color: "bg-indigo-500",
    text: "CampusCV's ATS score feature showed me exactly why my resume was getting rejected. After fixing the gaps it flagged, I landed 3 interviews in one week.",
  },
  {
    name: "Arjun Mehta",
    handle: "@arjun_dev",
    role: "SDE Intern @ Microsoft",
    avatar: "AM",
    color: "bg-purple-500",
    text: "The AI writing assistant rewrote my bullet points from boring descriptions to strong action-verb achievements. My response rate doubled.",
  },
  {
    name: "Sneha Kapoor",
    handle: "@sneha_codes",
    role: "Data Analyst @ Amazon",
    avatar: "SK",
    color: "bg-cyan-600",
    text: "I uploaded my old PDF and it parsed everything perfectly. Saved me hours of retyping. The ATS Executive template is chef's kiss.",
  },
  {
    name: "Rahul Verma",
    handle: "@rahul_v",
    role: "Product Manager @ Flipkart",
    avatar: "RV",
    color: "bg-emerald-500",
    text: "The job-match analysis is incredible. I pasted a JD and it told me exactly which keywords were missing from my resume. Got the offer!",
  },
  {
    name: "Aisha Patel",
    handle: "@aisha_tech",
    role: "Frontend Dev @ Razorpay",
    avatar: "AP",
    color: "bg-rose-500",
    text: "Finally a resume builder that understands what Indian tech recruiters look for. The ATS Clean template scored 92 on every company I applied to.",
  },
  {
    name: "Dev Chauhan",
    handle: "@dev_bca",
    role: "Full-Stack Dev @ Startup",
    avatar: "DC",
    color: "bg-orange-500",
    text: "Built my resume in under 20 minutes as a fresh graduate with no experience. The AI suggested ways to frame my college projects that actually impressed hiring managers.",
  },
];

const stars = Array(5).fill(0);

function TestimonialCard({ t }) {
  return (
    <div className="w-72 shrink-0 mx-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-0.5 mb-3">
        {stars.map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">"{t.text}"</p>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${t.color}`}>
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{t.name}</p>
          <p className="text-xs text-slate-400">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
  const row2 = [...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3), ...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3)];

  return (
    <section id="testimonials" className="relative bg-slate-50 py-24 overflow-hidden scroll-mt-16">
      {/* Heading */}
      <div className="text-center mb-14 px-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium mb-4">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          Student success stories
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
          Loved by students,{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            hired by top companies
          </span>
        </h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
          Thousands of students have used CampusCV to land internships and full-time roles at top companies.
        </p>
      </div>

      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left  { animation: marqueeLeft  35s linear infinite; }
        .marquee-right { animation: marqueeRight 35s linear infinite; }
      `}</style>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="flex marquee-left" style={{ width: "max-content" }}>
          {row1.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
        <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative mt-4">
        <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="flex marquee-right" style={{ width: "max-content" }}>
          {row2.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
        <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />
      </div>

      {/* Fade to dark for CallToAction */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
