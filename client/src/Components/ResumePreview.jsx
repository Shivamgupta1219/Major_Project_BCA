import ClassicTemplate      from "./template/ClassicTemplae";
import MinimalTemplate      from "./template/MinimalTemplate";
import ModernTemplate       from "./template/ModernTemplate";
import ATSCleanTemplate     from "./template/ATSCleanTemplate";
import ATSExecutiveTemplate from "./template/ATSExecutiveTemplate";

function ResumePreview({ data, template, accentColor, classes = "" }) {
  const renderTemplate = () => {
    const props = { data, accentColor };
    switch (template) {
      case "modern":       return <ModernTemplate       {...props} />;
      case "classic":      return <ClassicTemplate      {...props} />;
      case "atsClean":     return <ATSCleanTemplate     {...props} />;
      case "atsExecutive": return <ATSExecutiveTemplate {...props} />;
      default:             return <MinimalTemplate      {...props} />;
    }
  };

  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={`border border-gray-200 bg-white print:shadow-none print:border-none ${classes}`}
      >
        {renderTemplate()}
      </div>

      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          html, body { width: 210mm; overflow: hidden; }
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview {
            position: absolute;
            left: 0; top: 0;
            width: 210mm;
            box-shadow: none !important;
            border: none !important;
          }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}

export default ResumePreview;
