import React, { useState } from "react";
import api from "../../configs/api";
import { Upload, FileText, CheckCircle2, AlertTriangle, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

// Tiny CSV parser — handles quoted fields with commas. No external deps.
function parseCsv(text) {
  const rows = [];
  let cur = "";
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cur += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(cur);
        cur = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      } else {
        cur += c;
      }
    }
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v && v.trim().length > 0));
}

export default function AdminBulkUpload() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCsv(String(reader.result || ""));
      if (parsed.length === 0) {
        toast.error("Empty CSV");
        return;
      }
      const hdr = parsed[0].map((h) => h.trim().toLowerCase());
      setHeaders(hdr);
      setRows(parsed.slice(1));
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (rows.length === 0) return;
    const idx = (key) => headers.indexOf(key);
    const nameI = idx("name");
    const emailI = idx("email");
    const rollI = idx("rollno");
    const deptI = idx("department");
    const yearI = idx("year");

    if (nameI === -1 || emailI === -1) {
      toast.error("CSV must include 'name' and 'email' columns");
      return;
    }

    const students = rows.map((r) => ({
      name: (r[nameI] || "").trim(),
      email: (r[emailI] || "").trim().toLowerCase(),
      rollNo: (rollI >= 0 ? r[rollI] || "" : "").trim(),
      department: (deptI >= 0 ? r[deptI] || "" : "").trim(),
      year: (yearI >= 0 ? r[yearI] || "" : "").trim(),
    }));

    setSubmitting(true);
    try {
      const { data } = await api.post("/api/admin/students/bulk", { students });
      setResult(data);
      toast.success(
        `${data.createdCount} created, ${data.skippedCount} skipped`
      );
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to upload");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = "name,email,rollNo,department,year\nShivam Gupta,shivam@example.com,BCA2025-01,BCA,Final Year\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Bulk Student Upload
        </h1>
        <p className="text-slate-600 mt-1">
          Upload a CSV to create student accounts. Default password is the
          roll number (or email prefix if no roll number).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-600">
            Required columns: <code className="bg-slate-100 px-1.5 py-0.5 rounded">name</code>,{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded">email</code>. Optional: rollNo, department, year.
          </p>
          <button
            onClick={downloadTemplate}
            className="text-sm text-indigo-600 hover:underline"
          >
            Download template
          </button>
        </div>

        <label
          htmlFor="csv-file"
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer"
        >
          {rows.length > 0 ? (
            <>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="font-medium text-slate-700">
                {rows.length} rows ready
              </p>
              <p className="text-xs text-slate-500">
                Columns: {headers.join(", ")}
              </p>
            </>
          ) : (
            <>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Upload className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="font-medium text-slate-700">Click to upload CSV</p>
              <p className="text-xs text-slate-500">.csv files only</p>
            </>
          )}
        </label>
        <input
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          hidden
          onChange={handleFile}
        />

        {rows.length > 0 && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-60"
            >
              {submitting && <LoaderCircle className="w-4 h-4 animate-spin" />}
              {submitting ? "Creating..." : `Create ${rows.length} accounts`}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-semibold">{result.createdCount} created</p>
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <p className="font-semibold">{result.skippedCount} skipped</p>
              </div>
            </div>
          </div>

          {result.created.length > 0 && (
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Student Login Credentials</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Share these credentials with students so they can login at <strong>http://localhost:5173/login</strong>
                </p>
                <div className="bg-white rounded p-3 mb-3">
                  <p className="text-xs text-slate-600 mb-2">Email: (from CSV)</p>
                  <p className="text-xs text-slate-600">Password: (Default Password below)</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mb-3">Created Accounts - Copy and Share:</h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg mb-3">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-slate-700 text-left">
                    <tr>
                      <th className="px-4 py-2 font-medium">Email</th>
                      <th className="px-4 py-2 font-medium">Default Password</th>
                      <th className="px-4 py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.created.map((c, i) => (
                      <tr key={i} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-2 font-mono text-slate-700">{c.email}</td>
                        <td className="px-4 py-2 font-mono text-slate-700 bg-slate-100 rounded">
                          {c.defaultPassword}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `Email: ${c.email}\nPassword: ${c.defaultPassword}`
                              );
                              alert(`Credentials copied for ${c.email}`);
                            }}
                            className="text-xs px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => {
                  const csv = "Email,Password\n" +
                    result.created.map(c => `${c.email},${c.defaultPassword}`).join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "student-credentials.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="text-sm px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg"
              >
                📥 Download as CSV
              </button>
            </div>
          )}

          {result.skipped.length > 0 && (
            <details className="mt-4">
              <summary className="text-sm font-medium text-slate-700 cursor-pointer">
                ⚠️ Skipped rows ({result.skipped.length})
              </summary>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 p-3 bg-slate-50 rounded">
                {result.skipped.map((s, i) => (
                  <li key={i}>
                    <strong>{s.row.email || "(no email)"}</strong> — {s.reason}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
