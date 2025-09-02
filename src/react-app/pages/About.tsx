import { Brain, Target, Zap, Users, BookOpen, Shield, Heart, CheckCircle } from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import SEOHead from "@/react-app/components/SEOHead";
import { useIntersectionObserver } from "@/react-app/hooks/useAnimationOnLoad";

export default function About() {
  const heroAnimation = useIntersectionObserver();
  const statsAnimation = useIntersectionObserver();
  const featuresAnimation = useIntersectionObserver();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead 
        title="About OutLaw - AI-Powered Legal Education Platform"
        description="Learn how OutLaw's AI professor clones help law students predict exam questions with 87% accuracy. Discover our mission to revolutionize legal education through artificial intelligence."
        keywords="AI legal education, law school study platform, artificial intelligence education, legal technology, law student resources"
        canonical="/about"
      />
      <Navigation />

      <main className="relative z-10" id="main-content">
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div 
            ref={heroAnimation}
            className="max-w-4xl mx-auto text-center transition-all duration-1000 opacity-100 translate-y-0"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-thin tracking-tight leading-tight mb-8">
              <span className="block text-gray-900">Revolutionizing</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">legal education</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              OutLaw uses advanced AI to create professor clones that understand your specific instructors' 
              teaching patterns, exam preferences, and grading styles.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>1,724+ law students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>198 law schools</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>87% prediction accuracy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-16 bg-gray-50/30">
          <div 
            ref={statsAnimation}
            className="max-w-6xl mx-auto transition-all duration-1000 delay-200 opacity-100 translate-y-0"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <GlassCard className="p-8 text-center backdrop-blur-3xl border-gray-200/30" opacity={0.1} blur="xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">87%</div>
                <div className="text-lg font-medium text-gray-700 mb-2">Prediction Accuracy</div>
                <div className="text-sm text-gray-600">Students report that our AI correctly predicts exam content with remarkable precision</div>
              </GlassCard>

              <GlassCard className="p-8 text-center backdrop-blur-3xl border-gray-200/30" opacity={0.1} blur="xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">1,724+</div>
                <div className="text-lg font-medium text-gray-700 mb-2">Active Students</div>
                <div className="text-sm text-gray-600">Law students across the country trust OutLaw for their exam preparation</div>
              </GlassCard>

              <GlassCard className="p-8 text-center backdrop-blur-3xl border-gray-200/30" opacity={0.1} blur="xl">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">198</div>
                <div className="text-lg font-medium text-gray-700 mb-2">Law Schools</div>
                <div className="text-sm text-gray-600">Supported across top-tier and regional law schools nationwide</div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-thin text-gray-900 mb-6">
                How OutLaw works
              </h2>
              <p className="text-xl font-light text-gray-600 max-w-3xl mx-auto">
                Our AI analyzes your professor's teaching patterns, past exams, and communication style 
                to create a personalized study experience.
              </p>
            </div>

            <div 
              ref={featuresAnimation}
              className="grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-400 opacity-100 translate-y-0"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Course Materials</h3>
                <p className="text-gray-600 leading-relaxed">
                  Share your syllabus, lecture notes, and any available past exams. Our AI analyzes 
                  your professor's teaching style and preferences.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Professor Profile</h3>
                <p className="text-gray-600 leading-relaxed">
                  Answer questions about your professor's personality, teaching approach, and exam format 
                  preferences to fine-tune the AI clone.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Study & Practice</h3>
                <p className="text-gray-600 leading-relaxed">
                  Chat with your AI professor clone, get personalized study materials, and receive 
                  accurate exam predictions tailored to your course.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-12 backdrop-blur-3xl border-gray-200/30 text-center" opacity={0.2} blur="xl">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
                Our mission
              </h2>
              
              <p className="text-xl font-light text-gray-700 leading-relaxed mb-8">
                We believe every law student deserves personalized, effective study tools. Traditional 
                one-size-fits-all study guides don't account for the unique teaching styles and exam 
                preferences of individual professors. OutLaw changes that.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Personalized Learning
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every professor teaches differently. Our AI adapts to your specific instructor's 
                    style, creating truly personalized study experiences.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    Predictive Intelligence
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our advanced AI algorithms analyze patterns in teaching and testing to predict 
                    exam content with remarkable accuracy.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500" />
                    Accessible Education
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We're democratizing access to high-quality, personalized legal education tools 
                    regardless of school prestige or resources.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-500" />
                    Student Success
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our ultimate goal is helping law students succeed academically and feel confident 
                    in their legal education journey.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Technology Section */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-thin text-gray-900 mb-6">
                Built with cutting-edge AI
              </h2>
              <p className="text-xl font-light text-gray-600 max-w-3xl mx-auto">
                OutLaw leverages advanced machine learning and natural language processing 
                to understand and replicate professor behavior.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Advanced AI Technology</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Natural Language Processing</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Analyzes syllabus content, lecture notes, and communication patterns to understand 
                        teaching style and preferences.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Predictive Modeling</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Uses machine learning to identify patterns and predict exam questions, topics, 
                        and question formats with high accuracy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Privacy & Security</h4>
                      <p className="text-gray-600 leading-relaxed">
                        All data is encrypted and processed securely. We never share your academic 
                        information with third parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <GlassCard className="p-8 backdrop-blur-3xl border-gray-200/30" opacity={0.1} blur="xl">
                  <div className="aspect-square bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center overflow-hidden relative">
                    <img 
                      src="https://mocha-cdn.com/0198359c-ceb1-7496-9163-1503291d02ce/ai-intelligence-network.png"
                      alt="AI Intelligence Network Visualization"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-90"
                    />
                    
                    <div className="relative z-10 text-center text-white">
                      <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                      <h4 className="text-xl font-semibold mb-2">AI Professor Clone</h4>
                      <p className="text-sm opacity-90">Powered by advanced machine learning</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
