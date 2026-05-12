// const ATSScoreMeter = ({ data }) => {
//   // SIMPLE ATS LOGIC (you can improve later)
//   let score = 0;
//   if (data.personal_info?.full_name) score += 10;
//   if (data.personal_info?.email) score += 10;
//   if (data.experience.length > 0) score += 30;
//   if (data.skills.length > 3) score += 20;
//   if (data.education.length > 0) score += 20;

//   score = Math.min(score, 100);

//   return (
//     <div className="flex items-center gap-2">
//       <span className="text-sm font-medium">ATS</span>
//       <div className="w-32 h-2 bg-gray-200 rounded">
//         <div
//           className={`h-2 rounded ${
//             score >= 70 ? "bg-green-500" : "bg-yellow-500"
//           }`}
//           style={{ width: `${score}%` }}
//         />
//       </div>
//       <span className="text-sm">{score}%</span>
//     </div>
//   );
// };

// export default ATSScoreMeter;
import { useEffect, useState } from "react";

const ATSScoreMeter = ({ data }) => {
  const [aiScore, setAiScore] = useState(0);

  // 🔹 Manual Score
  let manualScore = 0;

  if (data.personal_info?.full_name) manualScore += 10;
  if (data.personal_info?.email) manualScore += 10;
  if (data.experience.length > 0) manualScore += 30;
  if (data.skills.length > 3) manualScore += 20;
  if (data.education.length > 0) manualScore += 20;

  manualScore = Math.min(manualScore, 100);

  // 🔥 Final Score
  const finalScore = Math.round((manualScore * 0.4) + (aiScore * 0.6));

  // 🔹 Convert data → text
  const resumeText = `
    ${data.personal_info?.full_name}
    ${data.personal_info?.email}
    ${data.skills?.join(", ")}
    ${data.experience?.map(e => e.title).join(", ")}
    ${data.education?.map(e => e.degree).join(", ")}
  `;

  // 🔥 Call AI API
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAIScore = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ats/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resumeText,
          jobDescription: ""
        })
      });

      const data = await res.json();

      if (data.success) {
        setAiScore(data.data.score || 0);
      }
    } catch (err) {
      console.error("AI Error:", err);
    }
  };

 useEffect(() => {
  if (resumeText.length > 50) {
    const timer = setTimeout(() => {
      fetchAIScore();
    }, 1000);

    return () => clearTimeout(timer);
  }
}, [fetchAIScore, resumeText]);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">ATS</span>

      <div className="w-32 h-2 bg-gray-200 rounded">
        <div
          className={`h-2 rounded ${
            finalScore >= 70
              ? "bg-green-500"
              : finalScore >= 40
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${finalScore}%` }}
        />
      </div>

      <span className="text-sm font-bold">{finalScore}%</span>
    </div>
  );
};

export default ATSScoreMeter;