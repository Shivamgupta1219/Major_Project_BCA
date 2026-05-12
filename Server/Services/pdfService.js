// import pdfParse from "pdf-parse";
// import fs from "fs";

// export const extractTextFromPDF = async (filePath) => {
//   const buffer = fs.readFileSync(filePath);
//   const data = await pdfParse(buffer);
//   return data.text;
// };

import { createRequire } from "module";
import fs from "fs";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
};