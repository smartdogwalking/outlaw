import { useAuth } from "@/react-app/components/AuthContext";
import { useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { Brain, Target, Zap, BookOpen, Play, Sparkles } from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

export default function LandingPage() {
  const { user, isLoading, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-purple-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 text-gray-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        
        {/* Floating elements for extra magic */}
        <div className="absolute top-20 right-1/4 w-4 h-4 bg-violet-400 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-blue-400 rounded-full opacity-50 animate-bounce animation-delay-1000"></div>
        <div className="absolute top-1/3 left-20 w-2 h-2 bg-purple-400 rounded-full opacity-70 animate-bounce animation-delay-2000"></div>
      </div>

      <Navigation />

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mb-8 border border-violet-200/50 shadow-lg shadow-violet-300/30">
              <Sparkles className="w-5 h-5 text-violet-600" />
              <span className="text-violet-700 font-semibold">AI-Powered Legal Study Revolution</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Predict Your Professor's
              <span className="block bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Exact Exam
              </span>
              <span className="block">Before You Take It</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              OutLaw analyzes your professor's teaching patterns, personality, and exam history to predict exactly what will be on your final exam. 
              Study the right material and know what questions are coming.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => {
                  console.log('Sign In button clicked');
                  try {
                    signIn();
                  } catch (error) {
                    console.error('Failed to start sign-in:', error);
                    alert('Failed to start sign-in process. Please try again.');
                  }
                }}
                leftIcon={<Zap className="w-6 h-6" />}
                className="text-xl px-12 py-6 font-bold"
              >
                Start Studying Smarter
              </Button>
              
              <Link to="/demo">
                <Button 
                  variant="secondary" 
                  size="lg"
                  leftIcon={<Play className="w-6 h-6" />}
                  className="text-xl px-12 py-6 font-semibold"
                >
                  Try Interactive Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <GlassCard className="p-8" opacity={0.4} blur="xl" glow hover>
              <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl w-fit mb-6 shadow-lg shadow-violet-400/50">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">AI Exam Prediction Engine</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your syllabus, lecture notes, and practice questions. Our AI creates a digital clone of your professor 
                that predicts exactly what will be on your exam based on their teaching patterns and testing history.
              </p>
            </GlassCard>

            <GlassCard className="p-8" opacity={0.4} blur="xl" glow hover>
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl w-fit mb-6 shadow-lg shadow-indigo-400/50">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Exact Exam Predictions</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes your professor's past exams, teaching emphasis, and personality quirks to predict 
                exactly what topics, question formats, and grading criteria will appear on your final exam.
              </p>
            </GlassCard>

            <GlassCard className="p-8" opacity={0.4} blur="xl" glow hover>
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl w-fit mb-6 shadow-lg shadow-purple-400/50">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Targeted Study Materials</h3>
              <p className="text-gray-600 leading-relaxed">
                Get flashcards, hypotheticals, and practice questions that mirror exactly what your professor will test, 
                formatted in their preferred style and difficulty level for maximum exam preparation.
              </p>
            </GlassCard>
          </div>

          {/* CTA Section */}
          <GlassCard className="p-12 text-center" opacity={0.4} blur="xl" glow>
            <div className="p-6 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-3xl w-fit mx-auto mb-8 shadow-xl shadow-violet-400/50">
              <Brain className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Ready to Transform Your Studying?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of law students who are already studying smarter with AI-powered 
              professor insights and personalized study materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => {
                  console.log('Get Started button clicked');
                  try {
                    signIn();
                  } catch (error) {
                    console.error('Failed to start sign-in:', error);
                    alert('Failed to start sign-in process. Please try again.');
                  }
                }}
                className="text-xl px-12 py-6 font-bold"
                leftIcon={<Sparkles className="w-6 h-6" />}
              >
                Get Started Free
              </Button>
              <Link to="/demo">
                <Button 
                  variant="secondary"
                  size="lg"
                  className="text-xl px-12 py-6 font-semibold"
                  leftIcon={<Play className="w-6 h-6" />}
                >
                  Try Demo First
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}
