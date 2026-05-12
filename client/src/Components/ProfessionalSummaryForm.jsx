import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../configs/api";
export default function ProfessionalSummaryForm({ value, setResumeData }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.auth);
  const enhanceWithAI = async () => {
    setError("");
    setIsGenerating(true);
    try {
      const prompt = `
Rewrite and enhance the following professional summary.
Make it ATS-friendly, clear, and professional.
Return ONLY the improved summary — no explanations, no bullet points.
"${value}" `;
      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: prompt },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setResumeData((prev) => ({
        ...prev,
        professional_summary: response.data.enhancedContent,
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Professional Summary
        </h3>
        <p className="text-sm text-gray-600">
          Write a short summary highlighting your experience and strengths
        </p>
      </div>

      {/* Textarea */}
      <textarea
        value={value || ""}
        onChange={(e) =>
          setResumeData((prev) => ({
            ...prev,
            professional_summary: e.target.value,
          }))
        }
        rows={6}
        placeholder="Example: Full Stack Developer with 3+ years of experience building scalable web applications..."
        className="w-full p-3 border rounded-md text-gray-800 resize-none
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {/* Actions */}

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500">
          Recommended: 60–160 words (ATS friendly)
        </span>

        <button
          type="button"
          onClick={enhanceWithAI}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm
    bg-blue-600 text-white rounded-md
    hover:bg-blue-700 disabled:opacity-60"
        >
          {isGenerating ? (
            <Loader2 className="size-4" />
          ) : (
            <>
              <Sparkles className="size-4" />
              Enhance with AI
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
