import { useReactToPrint } from "react-to-print";
import { Download, Lock } from "lucide-react";

const DownloadPdfButton = ({ targetRef, isSaved, resumeTitle }) => {
  const handlePrint = useReactToPrint({
    contentRef: targetRef,
    documentTitle: resumeTitle || "Resume",
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  return (
    <div className="relative group">
      <button
        onClick={() => isSaved && handlePrint()}
        disabled={!isSaved}
        className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm
          ${isSaved
            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
      >
        {isSaved
          ? <><Download size={18} /> Download PDF</>
          : <><Lock size={18} /> Save First</>
        }
      </button>

      {!isSaved && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Please save your resume before downloading
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
};

export default DownloadPdfButton;
