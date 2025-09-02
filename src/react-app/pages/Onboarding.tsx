import { useState, useEffect } from "react";
import { useAuth } from "@/react-app/components/AuthContext";
import { useNavigate, useSearchParams } from "react-router";
import { GraduationCap, Sparkles, ArrowRight, Crown } from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import LawSchoolSearch from "@/react-app/components/LawSchoolSearch";
import type { LawSchool } from "@/shared/types";

export default function Onboarding() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedSchool, setSelectedSchool] = useState<LawSchool | null>(null);
  const [yearOfStudy, setYearOfStudy] = useState<number | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
      return;
    }

    if (user) {
      setIsPageLoading(false);
      // Check if we should show upgrade prompt after onboarding
      if (searchParams.get('show_upgrade') === 'true') {
        setShowUpgrade(true);
      }
    }
  }, [user, isLoading, navigate, searchParams]);

  const handleSave = async () => {
    if (!selectedSchool || !yearOfStudy) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          law_school_id: selectedSchool.id,
          year_of_study: yearOfStudy,
        }),
      });

      if (response.ok) {
        setOnboardingComplete(true);
        // If we should show upgrade, show it now, otherwise go to dashboard
        if (showUpgrade) {
          // Show upgrade prompt
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgradeDecision = (upgrade: boolean) => {
    if (upgrade) {
      // TODO: Implement upgrade flow
      console.log('User wants to upgrade');
    }
    navigate("/dashboard");
  };

  if (isLoading || isPageLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Setting Up Your Profile</h2>
          <p className="text-gray-600">Preparing your personalized experience...</p>
        </div>
      </div>
    );
  }

  // Show upgrade prompt after onboarding completion
  if (onboardingComplete && showUpgrade) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navigation />

        <main className="relative z-10">
          <section className="px-6 py-16">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-thin tracking-tight leading-tight mb-6">
                  <span className="block text-gray-900">Upgrade to</span>
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Premium?</span>
                </h1>
                
                <p className="text-xl font-light text-gray-600 leading-relaxed">
                  Get unlimited professor clones and advanced features
                </p>
              </div>

              <GlassCard 
                className="p-8 md:p-10 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                opacity={0.05}
                blur="xl"
              >
                {/* Premium Features */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Unlimited Professor Clones</h4>
                      <p className="text-sm text-gray-600">Create clones for all your courses</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Advanced Study Materials</h4>
                      <p className="text-sm text-gray-600">Personalized practice exams & quizzes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Priority Support</h4>
                      <p className="text-sm text-gray-600">Get help faster when you need it</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleUpgradeDecision(true)}
                    size="lg"
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Premium - $9.99/month
                  </Button>
                  
                  <Button
                    onClick={() => handleUpgradeDecision(false)}
                    variant="ghost"
                    size="lg"
                    className="w-full py-4 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] text-gray-600 hover:text-gray-800 text-lg"
                  >
                    Continue with Free Plan
                  </Button>
                </div>
              </GlassCard>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <main className="relative z-10">
        <section className="px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/70 backdrop-blur-xl rounded-full text-sm font-medium text-gray-700 border border-gray-200/50">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  Almost ready to start
                </span>
              </div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-thin tracking-tight leading-tight mb-6">
                <span className="block text-gray-900">Welcome to</span>
                <span className="block text-gray-900">OutLaw.</span>
              </h1>
              
              <p className="text-xl font-light text-gray-600 leading-relaxed">
                Let's get you set up with your law school information
              </p>
            </div>

            <GlassCard 
              className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
              opacity={0.05}
              blur="xl"
            >
              <div className="space-y-8">
                {/* Law School Selection */}
                <div>
                  <label className="block text-lg font-medium mb-4 text-gray-900">
                    Select your law school
                  </label>
                  <LawSchoolSearch
                    selectedSchool={selectedSchool}
                    onSelect={(school) => setSelectedSchool(school as any)}
                    placeholder="Search for your law school..."
                  />
                </div>

                {/* Year of Study */}
                <div>
                  <label className="block text-lg font-medium mb-4 text-gray-900">
                    What year are you in?
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((year) => (
                      <button
                        key={year}
                        onClick={() => setYearOfStudy(year)}
                        className={`group p-6 rounded-2xl text-center font-medium transition-all duration-300 border-2 hover:scale-[1.02] active:scale-[0.98] ${
                          yearOfStudy === year
                            ? 'bg-black border-black text-white shadow-lg'
                            : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50 shadow-sm'
                        }`}
                      >
                        <div className="text-3xl font-bold mb-1">{year}L</div>
                        <div className="text-sm font-light opacity-80">
                          {year === 1 ? "First Year" : year === 2 ? "Second Year" : "Third Year"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    size="lg"
                    onClick={handleSave}
                    disabled={!selectedSchool || !yearOfStudy}
                    isLoading={isSaving}
                    className="group w-full py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg"
                  >
                    <span>Continue to dashboard</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Encouragement Text */}
            <div className="text-center mt-8">
              <p className="text-gray-600 font-light">
                🎯 You're about to unlock AI-powered study materials tailored to your professors
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
