import React, { useState } from "react";
import api from "../configs/api";
import { useSelector } from "react-redux";
import { 
  LoaderCircle, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  TrendingUp, 
  BookOpen,
  Lightbulb,
  Rocket,
  Award,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CareerPath() {
  const { token } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!profile) return;

    try {
      setLoading(true);

      const { data } = await api.post(
        "/api/ai/career-guidance",
        { userProfile: profile },
        {
          headers: { Authorization: token },
        }
      );

      setResult(data.careerAdvice);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    "I'm a BCA student learning React and Python, looking for tech roles",
    "Commerce graduate interested in digital marketing and content creation",
    "Engineering student passionate about AI/ML and data science",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/app")}
          className="mb-6 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            AI-Powered Career Guidance
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Discover Your Career Path
          </h1>
          
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Get personalized career roadmap, skills recommendations, and actionable steps
            tailored just for you
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Side - Features */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
              What You'll Get
            </h3>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Target className="text-purple-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Career Paths</h4>
                  <p className="text-sm text-slate-600">Personalized career options based on your profile</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Skill Roadmap</h4>
                  <p className="text-sm text-slate-600">Step-by-step learning path to reach your goals</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Rocket className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Action Plan</h4>
                  <p className="text-sm text-slate-600">Practical steps to kickstart your journey</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Input Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Lightbulb size={24} />
                  Tell Us About Yourself
                </h2>
                <p className="text-purple-100">
                  Share your background, skills, and aspirations
                </p>
              </div>

              <div className="p-6">
                {/* Example Prompts */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Try these examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setProfile(prompt)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  placeholder="Example: I am a final-year BCA student with experience in React, Node.js, and Python. I'm passionate about full-stack development and want to land a job at a product-based company. I've built 3 projects and looking for guidance on next steps..."
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className="w-full h-40 p-4 border-2 border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400"
                />

                {/* Character Count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    {profile.length} characters
                  </p>
                  {profile.length > 0 && profile.length < 50 && (
                    <p className="text-sm text-amber-600">
                      💡 Add more details for better results
                    </p>
                  )}
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!profile || loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" size={20} />
                      Generating Your Career Path...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Career Path
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Award size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Your Personalized Career Plan</h2>
                    <p className="text-green-100">AI-generated roadmap to success</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="prose prose-slate max-w-none">
                  {result.split('\n').map((line, idx) => {
                    // Check if line is a heading (starts with # or is all caps with length > 5)
                    if (line.startsWith('#')) {
                      const level = line.match(/^#+/)[0].length;
                      const text = line.replace(/^#+\s*/, '');
                      
                      if (level === 1) {
                        return (
                          <h2 key={idx} className="text-2xl font-bold text-slate-800 mt-8 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" size={24} />
                            {text}
                          </h2>
                        );
                      } else if (level === 2) {
                        return (
                          <h3 key={idx} className="text-xl font-semibold text-slate-700 mt-6 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            {text}
                          </h3>
                        );
                      } else {
                        return (
                          <h4 key={idx} className="text-lg font-medium text-slate-600 mt-4 mb-2">
                            {text}
                          </h4>
                        );
                      }
                    }
                    
                    // Check if line is a bullet point
                    if (line.trim().match(/^[-*•]\s/)) {
                      const text = line.trim().replace(/^[-*•]\s/, '');
                      return (
                        <div key={idx} className="flex items-start gap-3 mb-2 ml-4">
                          <div className="bg-purple-100 p-1 rounded-full mt-1">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          </div>
                          <p className="text-slate-700 flex-1">{text}</p>
                        </div>
                      );
                    }
                    
                    // Check if line is numbered
                    if (line.trim().match(/^\d+\./)) {
                      const text = line.trim();
                      return (
                        <div key={idx} className="flex items-start gap-3 mb-3 ml-4">
                          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {text.match(/^\d+/)[0]}
                          </span>
                          <p className="text-slate-700 flex-1">{text.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                      );
                    }
                    
                    // Regular paragraph
                    if (line.trim()) {
                      return (
                        <p key={idx} className="text-slate-700 mb-4 leading-relaxed">
                          {line}
                        </p>
                      );
                    }
                    
                    return <div key={idx} className="h-2"></div>;
                  })}
                </div>

                {/* Action Footer */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-full shadow-sm">
                        <BookOpen className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-2">
                          Ready to Start Your Journey?
                        </h3>
                        <p className="text-slate-600 text-sm mb-4">
                          Save this plan and start working on the suggested skills. 
                          Remember, consistency is key to success!
                        </p>
                        <button
                          onClick={() => {
                            const blob = new Blob([result], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'my-career-plan.txt';
                            a.click();
                          }}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors shadow-sm border border-purple-200"
                        >
                          Download Career Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4">
              <Rocket className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Your Journey Starts Here
            </h3>
            <p className="text-slate-500">
              Fill in your details above to receive your personalized career guidance
            </p>
          </div>
        )}
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}