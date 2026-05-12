const TemplateSelector = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border px-3 py-1 rounded text-sm"
    >
      <option value="classic">Classic</option>
      <option value="modern">Modern</option>
      <option value="pdfStyle">PRF Style </option>
      <option value="minimal">Minimal</option>
    </select>
  );
};

export default TemplateSelector;
