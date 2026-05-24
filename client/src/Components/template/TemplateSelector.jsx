const TEMPLATES = [
  { value: "classic",      label: "Classic" },
  { value: "modern",       label: "Modern" },
  { value: "minimal",      label: "Minimal" },
  { value: "atsClean",     label: "ATS Clean ✓" },
  { value: "atsExecutive", label: "ATS Executive ✓" },
];

const TemplateSelector = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border border-slate-300 px-3 py-2 rounded-lg text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
  >
    {TEMPLATES.map((t) => (
      <option key={t.value} value={t.value}>{t.label}</option>
    ))}
  </select>
);

export default TemplateSelector;
