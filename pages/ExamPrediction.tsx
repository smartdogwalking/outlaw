import { useState, useEffect } from "react";
import { useAuth } from "@/react-app/components/AuthContext";
import { useNavigate, useParams, Link } from "react-router";
import { 
  ArrowLeft, 
  Brain, 
  FileText,
  Download,
  RefreshCw,
  Clock,
  Target,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Footer from "@/react-app/components/Footer";
import PremiumLock from "@/react-app/components/PremiumLock";
import type { ProfessorClone } from "@/shared/types";

interface ExamPrediction {
  question_types: string[];
  likely_topics: string[];
  exam_format: string;
  difficulty_distribution: { easy: number; medium: number; hard: number };
  time_allocation: string;
  key_cases: string[];
  study_recommendations: string[];
  practice_questions: Array<{
    question: string;
    answer: string;
    difficulty: number;
    topic: string;
  }>;
}

export default function ExamPrediction() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { cloneId } = useParams();
  
  const [clone, setClone] = useState<ProfessorClone | null>(null);
  const [prediction, setPrediction] = useState<ExamPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }

    if (user && cloneId) {
      fetchCloneAndPrediction();
    }
  }, [user, authLoading, navigate, cloneId]);

  const fetchCloneAndPrediction = async () => {
    if (!cloneId) return;

    try {
      const [clonesRes, predictionRes, subscriptionRes] = await Promise.all([
        fetch("/api/professor-clones"),
        fetch(`/api/exam-prediction/${cloneId}`),
        fetch("/api/subscription")
      ]);

      if (clonesRes.ok) {
        const clonesData = await clonesRes.json();
        const cloneList = Array.isArray(clonesData) ? clonesData : [];
        const currentClone = cloneList.find((c: ProfessorClone) => c.id === parseInt(cloneId));
        setClone(currentClone || null);
      } else if (clonesRes.status === 401) {
        navigate("/");
        return;
      } else {
        console.error("Failed to fetch clones:", clonesRes.status);
      }

      if (predictionRes.ok) {
        const predictionData = await predictionRes.json();
        setPrediction(predictionData);
      } else if (predictionRes.status === 404) {
        // No prediction exists yet, that's OK
        setPrediction(null);
      } else {
        console.error("Failed to fetch prediction:", predictionRes.status);
      }

      if (subscriptionRes.ok) {
        const subscriptionData = await subscriptionRes.json();
        setSubscription(subscriptionData);
      } else {
        console.error("Failed to fetch subscription:", subscriptionRes.status);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateExamPrediction = async () => {
    if (!cloneId) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-exam-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clone_id: parseInt(cloneId) })
      });

      if (response.ok) {
        const predictionData = await response.json();
        setPrediction(predictionData);
      }
    } catch (error) {
      console.error("Failed to generate prediction:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportPrediction = () => {
    if (!prediction || !clone) return;

    const content = `
# ${clone.course_name} Exam Prediction
## Professor ${clone.professor_name}

### Exam Format
${prediction.exam_format}

### Time Allocation
${prediction.time_allocation}

### Likely Topics
${prediction.likely_topics.map(topic => `- ${topic}`).join('\n')}

### Question Types
${prediction.question_types.map(type => `- ${type}`).join('\n')}

### Key Cases to Review
${prediction.key_cases.map(case_name => `- ${case_name}`).join('\n')}

### Study Recommendations
${prediction.study_recommendations.map(rec => `- ${rec}`).join('\n')}

### Practice Questions
${prediction.practice_questions.map((q, i) => `
**Question ${i + 1}** (${q.topic} - Difficulty: ${q.difficulty}/5)
${q.question}

**Answer:**
${q.answer}
`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clone.course_name}_Exam_Prediction.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Loading Exam Prediction</h2>
          <p className="text-gray-600">Analyzing your professor's patterns...</p>
        </div>
      </div>
    );
  }

  if (!clone) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Professor Clone Not Found</h2>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/study/${cloneId}`}>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Exam Prediction</h1>
                <p className="text-gray-600 text-sm font-light">{clone.professor_name} - {clone.course_name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Dashboard
            </Link>
            {prediction && (
              <Button 
                variant="secondary" 
                onClick={exportPrediction}
                className="group px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                <span>Export</span>
              </Button>
            )}
            <Button 
              onClick={generateExamPrediction}
              isLoading={isGenerating}
              className="group px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>{prediction ? 'Regenerate' : 'Generate'} Prediction</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {subscription?.subscription_type !== 'premium' && !prediction ? (
            <PremiumLock
              feature="exam_predictions"
              title="Unlock Enhanced Exam Predictions"
              description="Get detailed exam predictions with practice questions, study guides, and AI-powered insights tailored to your professor's exact testing style."
              showPreview={false}
            >
              <div />
            </PremiumLock>
          ) : prediction ? (
            <div className="space-y-8">
              {/* Overview Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <GlassCard 
                  className="group p-6 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  opacity={0.05}
                  blur="xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Exam Format</h3>
                    </div>
                  </div>
                  <p className="text-gray-700 font-light">{prediction.exam_format}</p>
                </GlassCard>

                <GlassCard 
                  className="group p-6 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  opacity={0.05}
                  blur="xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Time Allocation</h3>
                    </div>
                  </div>
                  <p className="text-gray-700 font-light">{prediction.time_allocation}</p>
                </GlassCard>

                <GlassCard 
                  className="group p-6 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                  opacity={0.05}
                  blur="xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Difficulty Split</h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-light">
                      <span>Easy:</span>
                      <span>{prediction.difficulty_distribution.easy}%</span>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span>Medium:</span>
                      <span>{prediction.difficulty_distribution.medium}%</span>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span>Hard:</span>
                      <span>{prediction.difficulty_distribution.hard}%</span>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Likely Topics */}
                <GlassCard 
                  className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                  opacity={0.05}
                  blur="xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">Likely Topics</h3>
                  </div>
                  <div className="space-y-3">
                    {prediction.likely_topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                        <span className="text-gray-900 font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Question Types */}
                <GlassCard 
                  className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                  opacity={0.05}
                  blur="xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">Question Types</h3>
                  </div>
                  <div className="space-y-3">
                    {prediction.question_types.map((type, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-900 font-medium">{type}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Key Cases */}
                <GlassCard 
                  className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                  opacity={0.05}
                  blur="xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">Key Cases to Review</h3>
                  </div>
                  <div className="space-y-3">
                    {prediction.key_cases.map((case_name, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-900 font-medium">{case_name}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Study Recommendations */}
                <GlassCard 
                  className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                  opacity={0.05}
                  blur="xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">Study Recommendations</h3>
                  </div>
                  <div className="space-y-3">
                    {prediction.study_recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                        <span className="text-gray-900 font-light leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Practice Questions */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Practice Questions</h3>
                </div>
                <div className="space-y-6">
                  {prediction.practice_questions.map((q, index) => (
                    <div key={index} className="p-6 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-violet-600">Question {index + 1}</span>
                          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-medium">{q.topic}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < q.difficulty ? 'bg-orange-400' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-gray-900 mb-4 whitespace-pre-wrap font-light leading-relaxed">{q.question}</div>
                      <details className="group">
                        <summary className="cursor-pointer text-violet-600 hover:text-violet-800 font-medium mb-3 select-none">
                          Show Answer
                        </summary>
                        <GlassCard 
                          className="p-4 backdrop-blur-lg border-gray-200/30"
                          opacity={0.05}
                          blur="lg"
                        >
                          <div className="text-gray-700 whitespace-pre-wrap font-light leading-relaxed">
                            {q.answer}
                          </div>
                        </GlassCard>
                      </details>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="min-h-[60vh] flex items-center justify-center">
              <GlassCard 
                className="p-12 text-center max-w-2xl mx-auto backdrop-blur-3xl border-gray-200/30 shadow-xl"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-thin text-gray-900 mb-6">Generate Your Exam Prediction</h3>
                <p className="text-xl font-light text-gray-600 mb-10 leading-relaxed">
                  Get a comprehensive prediction of what will be on your {clone.course_name} exam based on Professor {clone.professor_name}'s teaching patterns and preferences.
                </p>
                <Button 
                  size="lg" 
                  onClick={generateExamPrediction}
                  isLoading={isGenerating}
                  className="group text-lg px-12 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  <span>Generate full exam prediction</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </GlassCard>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
