import { useState } from "react";
import { Link } from "react-router";
import { 
  Brain, 
  Target, 
  Zap, 
  BookOpen, 
  MessageSquare, 
  FileText,
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Lightbulb
} from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200/50 rounded-full text-sm font-medium text-violet-700">
                <Star className="w-4 h-4" />
                Everything you need to excel in law school
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-thin tracking-tight leading-tight mb-8">
              <span className="block text-gray-900">Features that transform</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">your studying.</span>
            </h1>
            
            <p className="text-xl font-light text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              OutLaw combines cutting-edge AI with proven study methods to give you the ultimate law school advantage.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 hover:opacity-80 transition-opacity duration-300">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Users className="w-4 h-4 text-blue-500" />
                <span>1,724+ students</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>87% exam accuracy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="px-6 py-20 bg-gray-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-thin text-gray-900 mb-4">
                Core Features
              </h2>
              <p className="text-xl font-light text-gray-600">
                Everything you need in one powerful platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI Professor Clones */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
                opacity={0.05}
                blur="xl"
                onClick={() => setActiveFeature(activeFeature === 'clones' ? null : 'clones')}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Professor Clones</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Create digital twins of your professors that understand their teaching style, personality, and exam preferences.
                </p>
                <div className="flex items-center text-violet-600 font-medium text-sm group-hover:text-violet-700 transition-colors">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
                
                {activeFeature === 'clones' && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">Upload syllabi, notes, and past exams</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">Personality questionnaire analysis</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">Teaching style recognition</span>
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* Exam Predictions */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
                opacity={0.05}
                blur="xl"
                onClick={() => setActiveFeature(activeFeature === 'predictions' ? null : 'predictions')}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Exam Predictions</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Get detailed predictions of what will be on your exams with 87% accuracy based on professor analysis.
                </p>
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>

                {activeFeature === 'predictions' && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">Question type predictions</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">Topic weighting analysis</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">Difficulty distribution</span>
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* Study Materials */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
                opacity={0.05}
                blur="xl"
                onClick={() => setActiveFeature(activeFeature === 'materials' ? null : 'materials')}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Study Materials</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Generate personalized flashcards, hypotheticals, and practice questions tailored to your professor's style.
                </p>
                <div className="flex items-center text-green-600 font-medium text-sm group-hover:text-green-700 transition-colors">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>

                {activeFeature === 'materials' && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">AI-generated flashcards</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">Practice hypotheticals</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">Model answer examples</span>
                    </div>
                  </div>
                )}
              </GlassCard>

              {/* 24/7 Chat */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Professor Chat</h3>
                <p className="text-gray-600 leading-relaxed">
                  Chat with your AI professors anytime. Get instant answers, explanations, and guidance when you need it most.
                </p>
              </GlassCard>

              {/* Cold Call Help */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cold Call Emergency</h3>
                <p className="text-gray-600 leading-relaxed">
                  Never get caught unprepared. Get instant answers during class in your professor's voice and style.
                </p>
              </GlassCard>

              {/* Exam Analytics */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Exam Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track your study progress, identify weak areas, and optimize your preparation strategy.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-thin text-gray-900 mb-4">
                Advanced Capabilities
              </h2>
              <p className="text-xl font-light text-gray-600">
                Powered by cutting-edge AI technology
              </p>
            </div>

            <div className="space-y-8">
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-lg"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Your study materials and personal data are encrypted and secure. We never share your information with third parties.
                    </p>
                    <div className="flex items-center text-violet-600 font-medium text-sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Enterprise-grade security
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-lg"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Continuous Learning</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Our AI continuously learns from your interactions and feedback to provide better, more personalized assistance over time.
                    </p>
                    <div className="flex items-center text-blue-600 font-medium text-sm">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Gets smarter with every use
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-thin mb-8 leading-tight">
              <span className="block">Ready to experience</span>
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">the future of legal education?</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of law students who are already studying smarter, not harder, with OutLaw's AI-powered platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/">
                <Button
                  size="lg"
                  className="group text-lg px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                  <span>Start Free Today</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/demo">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-lg px-12 py-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  Try Interactive Demo
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-400 mt-8">
              Free to start • No credit card required • 1,724+ students trust OutLaw
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
