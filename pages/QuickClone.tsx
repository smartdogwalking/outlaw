import { useState, useEffect } from "react";
import { useAuth } from "@/react-app/components/AuthContext";
import { useNavigate } from "react-router";
import { ArrowLeft, Zap, ArrowRight, Target, MessageSquare } from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import PremiumLock from "@/react-app/components/PremiumLock";

export default function QuickClone() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Basic form data
  const [formData, setFormData] = useState({
    professor_name: "",
    course_name: "",
    department: "",
    specialties: ""
  });

  // Basic questionnaire data
  const [questionnaireData, setQuestionnaireData] = useState({
    humor_level: 3,
    strictness_level: 3,
    legal_interpretation_style: "",
    exam_format_preference: "",
    technology_usage: "",
    professor_quirks_and_hints: ""
  });
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [existingClones, setExistingClones] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
      return;
    }

    if (user) {
      checkUserSetup();
    }
  }, [user, isLoading, navigate]);

  // Handle URL parameters for cold call emergency pre-filling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const topic = urlParams.get('topic');
    const caseName = urlParams.get('case');
    const context = urlParams.get('context');
    const isEmergency = urlParams.get('emergency');

    if (topic || caseName || context || isEmergency) {
      // Pre-fill form with URL parameters
      if (topic) {
        setFormData(prev => ({ ...prev, course_name: topic }));
      }
      if (context) {
        setQuestionnaireData(prev => ({ ...prev, professor_quirks_and_hints: context }));
      }
      // Add case name to quirks if provided
      if (caseName) {
        const caseNote = context ? ` Focus on ${caseName}.` : `Focus on ${caseName}.`;
        setQuestionnaireData(prev => ({ 
          ...prev, 
          professor_quirks_and_hints: (prev.professor_quirks_and_hints || '') + caseNote
        }));
      }
    }
  }, []);

  const checkUserSetup = async () => {
    try {
      const [profileRes, subscriptionRes, clonesRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/subscription"),
        fetch("/api/professor-clones")
      ]);

      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (!profile.law_school_id) {
          // Redirect to onboarding if not set up
          navigate("/onboarding");
          return;
        }
      } else if (profileRes.status === 401) {
        navigate("/");
        return;
      }

      if (subscriptionRes.ok) {
        const subscriptionData = await subscriptionRes.json();
        setSubscription(subscriptionData);
      }

      if (clonesRes.ok) {
        const clonesData = await clonesRes.json();
        setExistingClones(Array.isArray(clonesData) ? clonesData : []);
      } else {
        setExistingClones([]);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setExistingClones([]);
    } finally {
      setIsPageLoading(false);
    }
  };

  const updateQuestionnaireData = (field: string, value: any) => {
    setQuestionnaireData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateClone = async () => {
    // Only validate professor name and course name - everything else is optional
    if (!formData.professor_name || !formData.course_name) {
      alert('Please fill in professor name and course name.');
      return;
    }

    setIsSaving(true);
    try {
      // Get user profile to get law school
      const profileResponse = await fetch("/api/profile");
      if (!profileResponse.ok) {
        throw new Error(`Profile fetch failed: ${profileResponse.status}`);
      }
      const profile = await profileResponse.json();
      
      if (!profile.law_school_id) {
        throw new Error('Please complete your profile setup first');
      }
      
      // Create new professor
      const profResponse = await fetch("/api/professors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.professor_name,
          law_school_id: profile.law_school_id,
          department: formData.department,
          specialties: formData.specialties
        }),
      });

      if (!profResponse.ok) {
        const errorText = await profResponse.text();
        throw new Error(`Failed to create professor: ${errorText}`);
      }

      const newProf = await profResponse.json();
      
      // Create the clone without requiring materials
      const cloneResponse = await fetch("/api/professor-clones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professor_id: newProf.id,
          professor_name: formData.professor_name,
          course_name: formData.course_name,
          syllabus_content: "Quick clone - no materials uploaded yet",
          lecture_notes: "Quick clone - no materials uploaded yet",
          additional_materials: "",
          practice_questions: "",
          past_exams: "",
          questionnaire_data: questionnaireData
        }),
      });

      if (!cloneResponse.ok) {
        const errorText = await cloneResponse.text();
        throw new Error(`Failed to create clone: ${errorText}`);
      }
      
      await cloneResponse.json();
      navigate("/dashboard");
    } catch (error) {
      const err = error as Error;
      alert(`Failed to create professor clone: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isPageLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Loading Quick Clone</h2>
          <p className="text-gray-600">Setting up your instant professor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <main className="relative z-10">
        {/* Check if user has clones and isn't premium */}
        {existingClones.length > 0 && subscription?.subscription_type !== 'premium' ? (
          <section className="px-6 py-32">
            <div className="max-w-4xl mx-auto">
              <PremiumLock
                feature="multiple_clones"
                title="Create More Professor Clones"
                description="You've reached the limit for free accounts. Upgrade to Premium to create unlimited professor clones and cold call helpers."
                showPreview={false}
              >
                <div />
              </PremiumLock>
            </div>
          </section>
        ) : (
          <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-thin tracking-tight leading-tight mb-6">
                <span className="block text-gray-900">Never get cold called</span>
                <span className="block text-gray-900">unprepared again.</span>
              </h1>
              <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Create your professor AI in 2 minutes. Use it during class for instant answers to any question.
              </p>
            </div>

            <GlassCard 
              className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
              opacity={0.05}
              blur="xl"
            >
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">Professor Name *</label>
                    <input
                      type="text"
                      value={formData.professor_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, professor_name: e.target.value }))}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                      placeholder="Enter professor's name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">Course Name *</label>
                    <input
                      type="text"
                      value={formData.course_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, course_name: e.target.value }))}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Constitutional Law, Contracts"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Constitutional Law"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">Professor's Specialties</label>
                    <input
                      type="text"
                      value={formData.specialties}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Civil Rights, Federal Courts"
                    />
                  </div>
                </div>

                {/* Quick Professor Setup */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup (Optional)</h3>
                  <p className="text-sm text-gray-600 mb-6">Add these details to make your AI more accurate, or skip to start chatting immediately.</p>
                  
                  <div className="space-y-6">
                    {/* Legal Philosophy */}
                    <div>
                      <label className="block text-lg font-medium mb-4 text-gray-900">Teaching Approach</label>
                      <select
                        value={questionnaireData.legal_interpretation_style}
                        onChange={(e) => updateQuestionnaireData('legal_interpretation_style', e.target.value)}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select teaching approach (optional)</option>
                        <option value="strict_textual">Focuses on exact text and original meaning</option>
                        <option value="evolving_interpretation">Believes law should adapt to modern society</option>
                        <option value="policy_focused">Emphasizes practical outcomes and policy implications</option>
                        <option value="case_law_heavy">Relies heavily on precedent and case analysis</option>
                        <option value="balanced_approach">Uses multiple approaches depending on the issue</option>
                        <option value="student_driven">Encourages students to form their own interpretations</option>
                      </select>
                    </div>

                    {/* Exam Format */}
                    <div>
                      <label className="block text-lg font-medium mb-4 text-gray-900">Primary Exam Format</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: "closed_book_essays", label: "Closed Book Essays" },
                          { value: "open_book_essays", label: "Open Book Essays" },
                          { value: "take_home_exam", label: "Take Home Exam" },
                          { value: "mixed_format", label: "Mixed Format" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateQuestionnaireData('exam_format_preference', option.value)}
                            className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left font-medium ${
                              questionnaireData.exam_format_preference === option.value
                                ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                                : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Technology Usage */}
                    <div>
                      <label className="block text-lg font-medium mb-4 text-gray-900">Technology Usage</label>
                      <select
                        value={questionnaireData.technology_usage}
                        onChange={(e) => updateQuestionnaireData('technology_usage', e.target.value)}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select technology usage level (optional)</option>
                        <option value="minimal">Minimal - Traditional teaching methods</option>
                        <option value="moderate">Moderate - Some PowerPoint, online resources</option>
                        <option value="extensive">Extensive - Interactive tools, frequent tech integration</option>
                      </select>
                    </div>

                    {/* Professor Personality */}
                    <div>
                      <label className="block text-lg font-medium mb-4 text-gray-900">
                        Professor Personality & Hints
                      </label>
                      <div className="mb-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                        <p className="text-sm text-blue-800 mb-2 font-medium">Help your AI understand your professor:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Favorite phrases or words they use</li>
                          <li>• Cold call patterns or preferences</li>
                          <li>• Teaching quirks or habits</li>
                          <li>• What they emphasize most in class</li>
                        </ul>
                      </div>
                      <textarea
                        value={questionnaireData.professor_quirks_and_hints}
                        onChange={(e) => updateQuestionnaireData('professor_quirks_and_hints', e.target.value)}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 h-32 resize-none"
                        placeholder="Example: Professor always says 'Think like a lawyer!' and cold calls students who aren't paying attention. Loves discussing real-world applications."
                      />
                    </div>
                  </div>
                </div>

                {/* Cold Call Emergency - More Prominent */}
                <div className="border-t border-gray-100 pt-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">🚨 Cold Call Emergency Ready</h3>
                    <p className="text-gray-600">Your secret weapon for in-class questions</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <GlassCard 
                      className="p-6 backdrop-blur-lg border-red-200/50 bg-gradient-to-r from-red-50 to-pink-50"
                      opacity={0.3}
                      blur="lg"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Instant Answers</h4>
                          <p className="text-sm text-gray-600">During class cold calls</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Get the perfect answer in your professor's style, instantly. Works on any topic, any case, any question.
                      </p>
                    </GlassCard>
                    
                    <GlassCard 
                      className="p-6 backdrop-blur-lg border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50"
                      opacity={0.3}
                      blur="lg"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Always Available</h4>
                          <p className="text-sm text-gray-600">24/7 professor access</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Your AI professor never sleeps. Ask questions anytime, get explanations in their exact teaching style.
                      </p>
                    </GlassCard>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 py-4 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full border-0 font-medium transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span>Back to Dashboard</span>
                  </Button>
                  <Button
                    onClick={handleCreateClone}
                    isLoading={isSaving}
                    className="group flex-2 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg px-8"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    <span>Create My Cold Call Helper</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
