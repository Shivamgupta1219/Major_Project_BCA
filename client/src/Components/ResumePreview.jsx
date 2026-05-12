import ClassicTemplate from "./template/ClassicTemplae";
import MinimalTemplate from "./template/MinimalTemplate";
import PdfStyleTemplate from "./template/PdfStyleTemplate";
import ModernTemplate from "./template/ModernTemplate";




function ResumePreview({ data, template, accentColor, classes = "" }) {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return (
          <ModernTemplate
            data={data}
            accentColor={accentColor}
            classes={classes}
          />
        );

      case "classic":
        return (
          <ClassicTemplate
            data={data}
            accentColor={accentColor}
            classes={classes}
          />
        );
      case "pdfStyle":
        return (
          <PdfStyleTemplate
            data={data}
            accentColor={accentColor}
            classes={classes}
          />
        );
      // eslint-disable-next-line no-fallthrough
      default:
        return (
          <MinimalTemplate
            data={data}
            accentColor={accentColor}
            classes={classes}
          />
        );
    }
  };

  return (
    <>
      <div className=" w-full bg-gray-100">
        <div
          id="resume-preview"
          className={
            "border border-gray-200 print:shadow-none print:border-none" +
            classes
          }
        >
          {renderTemplate()}
        </div>

        <style >
          {`
            @page {
              size: letter;
              margin: 0;
            }
          @media print {
              html,
              body {
                width: 8.5in;
                height: 11in;
                overflow: hidden;
              }
              body * {
                visibility: hidden;
              }
              #resume-preview,
              #resume-preview * {
                visibility: visible;
              }
            }
            #resume-preview {
              left: 0;
              top: 0;
              width: 100%;
              height: auto;
              margin: 0;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
            }
          }
              
          `}
        </style>
      </div>
    </>
  );
}

export default ResumePreview;
