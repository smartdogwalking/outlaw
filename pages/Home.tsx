import { useAuth } from "@/react-app/components/AuthContext";
import { Link } from "react-router";
import { useState } from "react";
import { 
  Brain, 
  Target, 
  Zap, 
  Play, 
  Star,
  MessageSquare,
  CheckCircle,
  Sparkles,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import HeroGlassReveal from "@/react-app/components/HeroGlassReveal";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import NewAuthModal from "@/react-app/components/NewAuthModal";
import SEOHead from "@/react-app/components/SEOHead";

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead 
        title="AI Professor Clones for Law School Success"
        description="Create AI professor clones that predict exactly what will be on your law school exams with 87% accuracy. Join 1,724+ law students studying smarter with personalized study materials."
        keywords="law school study, AI professor clones, exam prediction, legal education, law student study tools, bar exam prep, legal study materials"
        canonical="/"
        ogImage="https://outlaw.app/og-image.jpg"
      />
      <Navigation />

      {/* Hero Section - Apple style */}
      <main className="relative z-10">
        {/* Main Hero */}
        <section className="px-6 pt-24 pb-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/70 backdrop-blur-xl rounded-full text-sm font-medium text-gray-700 border border-gray-200/50 hover:bg-gray-200/70 transition-all duration-300 cursor-pointer">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Now available for law students
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin tracking-tight leading-[0.9] mb-8">
              <span className="block text-gray-900">Study smarter.</span>
              <span className="block text-gray-900">Not harder.</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed">
              AI that learns your professor's patterns and predicts exactly what will be on your exam.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Button 
                size="lg" 
                onClick={() => setShowAuthModal(true)}
                className="group text-lg px-8 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <span>Get started</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              {!user && (
                <Link to="/demo">
                  <Button 
                    variant="ghost" 
                    size="lg"
                    className="group text-lg px-8 py-4 text-gray-700 hover:text-black rounded-full border-0 font-medium hover:bg-gray-100/50 transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    <span>Try interactive demo</span>
                  </Button>
                </Link>
              )}
            </div>

            {/* Hero Visual - Apple-style Interactive Card */}
            <div className="relative">
              <div className="mx-auto max-w-5xl">
                <HeroGlassReveal 
                  className="group p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-2xl cursor-pointer"
                  opacity={0.08}
                  blur="xl"
                >
                  <div className="aspect-video bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl border border-gray-200/50 flex items-center justify-center overflow-hidden relative">
                    {/* Beautiful AI Graphics - Always Visible */}
                    <img 
                      src="https://mocha-cdn.com/0198359c-ceb1-7496-9163-1503291d02ce/ai-intelligence-network.png"
                      alt="AI Intelligence Network - Abstract Visualization"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                    />
                    
                    {/* Content Layer */}
                    <div className="text-center relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-white/90 to-white/70 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 animate-float backdrop-blur-sm">
                        <Brain className="w-10 h-10 text-violet-600 group-hover:text-violet-700 transition-colors duration-300" />
                      </div>
                      <h3 className="text-3xl font-semibold text-white mb-3 text-shadow group-hover:scale-105 transition-transform duration-500">OutLaw AI</h3>
                      <p className="text-lg text-white/90 font-light text-shadow group-hover:text-white transition-colors duration-500">Your intelligent study companion</p>
                    </div>
                    
                    {/* Elegant Hover Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-particle animation-delay-1000 group-hover:bg-white/80 transition-colors duration-500"></div>
                      <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-white/50 rounded-full animate-particle animation-delay-2000 group-hover:bg-white/70 transition-colors duration-500"></div>
                      <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-white/40 rounded-full animate-particle animation-delay-4000 group-hover:bg-white/60 transition-colors duration-500"></div>
                    </div>
                  </div>
                </HeroGlassReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-16 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group cursor-pointer">
                <div className="text-5xl md:text-6xl font-thin text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  1,724+
                </div>
                <div className="text-lg font-medium text-gray-600 mb-1">Law Students</div>
                <div className="text-sm text-gray-500">Trust OutLaw for exam prep</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-5xl md:text-6xl font-thin text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  198
                </div>
                <div className="text-lg font-medium text-gray-600 mb-1">Law Schools</div>
                <div className="text-sm text-gray-500">Supported nationwide</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-5xl md:text-6xl font-thin text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  87%
                </div>
                <div className="text-lg font-medium text-gray-600 mb-1">Prediction Accuracy</div>
                <div className="text-sm text-gray-500">Exam prediction accuracy</div>
              </div>
            </div>
          </div>
        </section>

        {/* Cold Call Emergency Section - Toned Down */}
        <section className="px-6 py-16 bg-gray-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-sm font-medium text-red-700">
                    <Target className="w-4 h-4" />
                    Cold call protection
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-thin tracking-tight leading-tight mb-6">
                  <span className="block text-gray-900">Never get caught</span>
                  <span className="block text-gray-900">unprepared again.</span>
                </h2>
                
                <p className="text-xl font-light text-gray-600 mb-8 leading-relaxed">
                  Create your professor AI in 2 minutes. Get instant perfect answers during class cold calls.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link to="/cold-call-help">
                    <Button 
                      size="lg"
                      className="group text-lg px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Target className="w-5 h-5 mr-2" />
                      <span>Cold call help</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                  
                  <Link to="/demo">
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="group text-lg px-8 py-4 text-gray-700 hover:text-black rounded-full border-0 font-medium hover:bg-gray-100/50 transition-all duration-300"
                    >
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <span>See demo</span>
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>2-minute setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>Works in any class</span>
                  </div>
                </div>
              </div>

              <div className="lg:pl-8">
                <GlassCard 
                  className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02]"
                  opacity={0.05}
                  blur="xl"
                >
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Perfect Answers</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Get the exact answer your professor wants to hear, structured the way they like it.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Works on Any Topic</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Constitutional law, contracts, torts - your AI handles any subject or case.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Professor's Style</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Answers match your professor's personality and communication patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Apple Grid Style */}
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Large Feature Card */}
              <div className="md:col-span-2 lg:col-span-2">
                <Link to="/about">
                  <GlassCard 
                    className="p-8 md:p-12 h-96 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 group cursor-pointer overflow-hidden relative"
                    opacity={0.05}
                    blur="xl"
                    hover
                  >
                    <div className="h-full flex flex-col justify-between relative z-10">
                      <div>
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Brain className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight group-hover:text-violet-700 transition-colors duration-300">
                          AI Professor Clones
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                          Create an AI that thinks, teaches, and tests exactly like your professor. Upload your syllabus and get a personalized study companion.
                        </p>
                      </div>
                      <div className="flex items-center text-violet-600 font-medium group-hover:gap-3 gap-2 transition-all duration-300 group-hover:text-violet-700">
                        <span>Learn more</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </div>

              {/* Interactive Stats Card */}
              <div>
                <Link to="/demo">
                  <GlassCard 
                    className="p-8 h-96 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 group cursor-pointer overflow-hidden relative"
                    opacity={0.05}
                    blur="xl"
                    hover
                  >
                    <div className="h-full flex flex-col justify-between text-center relative z-10">
                      <div>
                        <div className="text-5xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">87%</div>
                        <div className="text-lg font-medium text-gray-700 mb-4 group-hover:text-gray-800 transition-colors duration-300">Prediction Accuracy</div>
                        <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Students see dramatic results with targeted study materials</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">198</div>
                          <div className="text-sm text-gray-600">Law Schools</div>
                        </div>
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          <div className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">4.9</div>
                          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            Rating
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </div>

              {/* Exam Prediction Card */}
              <div>
                <Link to="/demo">
                  <GlassCard 
                    className="p-8 h-80 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 group cursor-pointer"
                    opacity={0.05}
                    blur="xl"
                    hover
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Target className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                          Exam Predictions
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Know exactly what your professor will ask before they ask it.
                        </p>
                      </div>
                      <div className="flex items-center text-blue-600 font-medium group-hover:gap-3 gap-2 transition-all duration-300 group-hover:text-blue-700">
                        <span>Try the demo</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </div>

              {/* Chat Feature Card with Real Screenshot */}
              <div className="md:col-span-2">
                <Link to="/demo">
                  <GlassCard 
                    className="p-8 h-80 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 group cursor-pointer overflow-hidden relative"
                    opacity={0.05}
                    blur="xl"
                    hover
                  >
                    <div className="h-full flex items-center justify-between relative z-10">
                      <div className="flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                          <MessageSquare className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-3xl font-semibold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
                          24/7 Professor Chat
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                          Ask your AI professor clone anything, anytime. Get explanations in their exact teaching style.
                        </p>
                        <div className="flex items-center text-emerald-600 font-medium group-hover:gap-3 gap-2 transition-all duration-300 group-hover:text-emerald-700">
                          <span>Start chatting</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                      <div className="hidden lg:block ml-8">
                        <div className="w-64 h-48 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200/50 overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-300 relative">
                          <img 
                            src="https://mocha-cdn.com/0198359c-ceb1-7496-9163-1503291d02ce/ai-data-visualization.png"
                            alt="AI Data Visualization - Beautiful Abstract Graphics"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Apple Style */}
        <section className="px-6 py-20 bg-gray-50/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-thin text-gray-900 mb-4">
                Loved by law students
              </h2>
              <p className="text-xl font-light text-gray-600">
                See what students are saying about OutLaw
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  text: "I was skeptical at first, but OutLaw's predictions for my Constitutional Law final were incredibly accurate. The AI clone understood exactly how my professor structures questions and what topics he emphasizes. Went from struggling with C+ grades to earning an A- on my final exam.",
                  author: "Sarah M.",
                  school: "Seton Hall Law",
                  course: "Constitutional Law",
                  avatar: "SM",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  text: "My Contracts professor is known for challenging exams that focus heavily on consideration doctrine. OutLaw's AI clone captured his teaching style perfectly and helped me understand exactly what he looks for in answers. Finally felt confident going into an exam for the first time in law school.",
                  author: "Alex C.",
                  school: "Brooklyn Law",
                  course: "Contracts",
                  avatar: "AC",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  text: "I was putting in 12+ hour study days but still performing poorly on practice exams. OutLaw helped me realize I was focusing on the wrong material entirely. Now I study more efficiently and my grades actually reflect the effort I'm putting in. Complete game changer.",
                  author: "Jordan T.",
                  school: "Cardozo Law",
                  course: "Torts",
                  avatar: "JT",
                  color: "from-emerald-500 to-teal-500"
                }
              ].map((testimonial, index) => (
                <GlassCard 
                  key={index}
                  className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer"
                  opacity={0.3}
                  blur="xl"
                >
                  <div className="relative z-10">
                    {/* Stars */}
                    <div className="flex mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-4 h-4 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" 
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-800 text-lg leading-relaxed mb-8 font-light italic group-hover:text-gray-900 transition-colors duration-300">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center gap-4 border-t border-gray-200/50 pt-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">{testimonial.author}</div>
                        <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{testimonial.school}</div>
                        <div className={`text-sm font-medium bg-gradient-to-r ${testimonial.color} bg-clip-text text-transparent`}>{testimonial.course}</div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Apple Style */}
        <section className="px-6 py-32 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <span 
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full text-sm font-medium text-blue-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                Join the AI revolution in legal education
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-thin text-gray-900 mb-8 leading-tight">
              <span className="block">Ready to transform</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">your law school experience?</span>
            </h2>
            
            <p className="text-xl font-light text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of law students who are studying smarter with AI-powered professor clones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                onClick={() => setShowAuthModal(true)}
                className="group text-lg px-12 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span>Start free today</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              {!user && (
                <Link to="/demo">
                  <Button 
                    variant="ghost"
                    size="lg"
                    className="group text-lg px-12 py-4 text-gray-700 hover:text-black rounded-full border-0 font-medium hover:bg-gray-100/50 transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    <span>Try interactive demo</span>
                  </Button>
                </Link>
              )}
              {user && (
                <Link to="/dashboard">
                  <Button 
                    variant="ghost"
                    size="lg"
                    className="group text-lg px-12 py-4 text-gray-700 hover:text-black rounded-full border-0 font-medium hover:bg-gray-100/50 transition-all duration-300"
                  >
                    <span>Go to dashboard</span>
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-gray-500 text-sm font-light">
              <div className="flex items-center gap-2 hover:text-gray-600 transition-colors duration-300 cursor-pointer group">
                <CheckCircle className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                <span>Free to start</span>
              </div>
              <div className="w-px h-4 bg-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2 hover:text-gray-600 transition-colors duration-300 cursor-pointer group">
                <CheckCircle className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span>5-minute setup</span>
              </div>
              <div className="w-px h-4 bg-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2 hover:text-gray-600 transition-colors duration-300 cursor-pointer group">
                <CheckCircle className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                <span>Works with any professor</span>
              </div>
            </div>
            
            {/* Additional Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-gray-200/50">
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 hover:opacity-80 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Trusted by 198 law schools</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>1,724+ students enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>87% exam accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Auth Modal */}
      <NewAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="signup"
      />
    </div>
  );
}
