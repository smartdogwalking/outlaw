import { useState } from "react";
import { useAuth } from "@/react-app/components/AuthContext";
import { Link } from "react-router";
import { 
  Target, 
  Zap, 
  ArrowRight, 
  MessageSquare, 
  BookOpen,
  CheckCircle,
  Play,
  Brain,
  Clock,
  Users,
  Star
} from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

export default function ColdCallHelp() {
  const { isLoading } = useAuth();
  const [topic, setTopic] = useState("");
  const [caseName, setCaseName] = useState("");
  const [quickHelp, setQuickHelp] = useState("");

  const commonQuickHelps = [
    "I need a concise but impressive answer",
    "Professor likes students who think beyond the basics",
    "This professor values practical applications",
    "I should mention policy implications",
    "Professor expects case citations",
    "I need to sound confident and prepared"
  ];

  const handleColdCallPrep = () => {
    let query = "";
    if (topic) query += `topic=${encodeURIComponent(topic)}&`;
    if (caseName) query += `case=${encodeURIComponent(caseName)}&`;
    if (quickHelp) query += `context=${encodeURIComponent(quickHelp)}&`;
    
    // Redirect to quick clone with pre-filled emergency context
    window.location.href = `/quick-clone?${query}emergency=true`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
          <div className="text-xl font-medium text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pt-8 pb-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-sm font-medium text-red-700">
                <Target className="w-4 h-4" />
                Emergency Cold Call Protection
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-thin tracking-tight leading-[0.9] mb-8">
              <span className="block text-gray-900">Never get caught</span>
              <span className="block text-red-600">off guard again.</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed">
              Create your AI professor in 2 minutes. Get instant perfect answers during class cold calls.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Button 
                size="lg" 
                onClick={() => {
                  try {
                    window.location.href = '/api/auth/login';
                  } catch (error) {
                    console.error('Failed to redirect to login:', error);
                    alert('Failed to start sign-in process. Please try again.');
                  }
                }}
                className="group text-lg px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <Zap className="w-5 h-5 mr-2" />
                <span>Create My Helper (2 min)</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
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
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-20 bg-gray-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-thin text-gray-900 mb-4">
                How it works
              </h2>
              <p className="text-xl font-light text-gray-600">
                Three simple steps to cold call confidence
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <GlassCard 
                className="p-8 text-center backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02]"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Create Your Professor</h3>
                <p className="text-gray-600 leading-relaxed">
                  Enter your professor's name and course. Optional: Add teaching style details for more accuracy.
                </p>
              </GlassCard>

              <GlassCard 
                className="p-8 text-center backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02]"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Ask During Class</h3>
                <p className="text-gray-600 leading-relaxed">
                  When cold called, quickly type your question or case name for an instant perfect answer.
                </p>
              </GlassCard>

              <GlassCard 
                className="p-8 text-center backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02]"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Impress Your Professor</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get answers that match your professor's exact style and expectations. Sound prepared every time.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Emergency Cold Call Helper */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-thin text-gray-900 mb-4">
                Emergency Cold Call Helper
              </h2>
              <p className="text-xl font-light text-gray-600">
                Prepare for your cold call right now
              </p>
            </div>

            <GlassCard 
              className="p-8 md:p-12 backdrop-blur-3xl border-red-200/30 shadow-xl"
              opacity={0.05}
              blur="xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quick Cold Call Prep</h3>
                <p className="text-gray-600 font-light">Fill out what you know, then create your AI professor</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">Topic/Question (optional)</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Offer and acceptance, Constitutional interpretation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">Case Name (optional)</label>
                  <input
                    type="text"
                    value={caseName}
                    onChange={(e) => setCaseName(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Marbury v. Madison, Pennoyer v. Neff"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">Quick context</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {commonQuickHelps.map((help, index) => (
                      <button
                        key={index}
                        onClick={() => setQuickHelp(help)}
                        className={`p-3 text-sm text-left rounded-xl border transition-all duration-200 ${
                          quickHelp === help
                            ? 'border-red-300 bg-red-50 text-red-800'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {help}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={quickHelp}
                    onChange={(e) => setQuickHelp(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all duration-200"
                    placeholder="Or describe your professor's style..."
                  />
                </div>
                
                <Button
                  onClick={handleColdCallPrep}
                  size="lg"
                  className="group w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  <span>Create My Emergency Helper</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                
                <p className="text-sm text-gray-600 text-center font-light">
                  💡 The more details you provide, the better your answers will be!
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-20 bg-gray-50/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-thin text-gray-900 mb-4">
                Trusted by law students nationwide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="text-4xl font-thin text-gray-900">1,724+</div>
                </div>
                <div className="text-lg font-medium text-gray-600 mb-1">Students Protected</div>
                <div className="text-sm text-gray-500">From cold call surprises</div>
              </GlassCard>
              
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Clock className="w-8 h-8 text-green-500" />
                  <div className="text-4xl font-thin text-gray-900">2</div>
                </div>
                <div className="text-lg font-medium text-gray-600 mb-1">Minute Setup</div>
                <div className="text-sm text-gray-500">Start using immediately</div>
              </GlassCard>
              
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div className="text-4xl font-thin text-gray-900">4.9</div>
                </div>
                <div className="text-lg font-medium text-gray-600 mb-1">Student Rating</div>
                <div className="text-sm text-gray-500">Highly recommended</div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-thin text-gray-900 mb-4">
                Why students love it
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02]"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Perfect Answers</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Get the exact answer your professor wants to hear, structured the way they like it, with the right level of detail.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02]"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Works on Any Topic</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Constitutional law, contracts, torts, criminal law - your AI professor handles any subject or case.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02]"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Professor's Teaching Style</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Answers match your professor's personality, preferred case citations, and communication patterns.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02]"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Always Prepared</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Never worry about cold calls again. Feel confident and prepared in every class discussion.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-32 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-thin text-gray-900 mb-8 leading-tight">
              <span className="block">Ready to never get caught</span>
              <span className="block text-red-600">unprepared again?</span>
            </h2>
            
            <p className="text-xl font-light text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of law students who never stress about cold calls anymore.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                onClick={() => {
                  try {
                    window.location.href = '/api/auth/login';
                  } catch (error) {
                    console.error('Failed to redirect to login:', error);
                    alert('Failed to start sign-in process. Please try again.');
                  }
                }}
                className="group text-lg px-12 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <Zap className="w-5 h-5 mr-2" />
                <span>Create my cold call helper</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              <Link to="/demo">
                <Button 
                  variant="ghost"
                  size="lg"
                  className="group text-lg px-12 py-4 text-gray-700 hover:text-black rounded-full border-0 font-medium hover:bg-gray-100/50 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span>See demo first</span>
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-gray-500 text-sm font-light">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="w-px h-4 bg-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>2-minute setup</span>
              </div>
              <div className="w-px h-4 bg-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Works in any class</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
