import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { ArrowLeftIcon } from "lucide-react";
import ResumePreview from "../Components/ResumePreview";
import api from "../configs/api.js";
import { useSelector } from "react-redux";
import { normalizeResume } from "../utils/normalizeResume";

function Preview() {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    if (!resumeId || !token) return;

    const fetchResume = async () => {
      try {
        const { data } = await api.get(`/api/resume/${resumeId}`, {
          headers: { Authorization: token },
        });

        const normalized = normalizeResume(data.resume);
        setResumeData(normalized);
      } catch (error) {
        console.error(error);
        setResumeData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, token]);

  if (isLoading) return <Loader text="Loading resume..." />;

  return resumeData ? (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10">
        {/* Back Button */}
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back To Dashboard
        </Link>

        <ResumePreview
          data={resumeData}
          template={resumeData.template || "classic"}
          accentColor={resumeData.accent_color}
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-3 py-10">
      <p className="text-gray-700">Resume not found</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Go to home
      </Link>
    </div>
  );
}

export default Preview;