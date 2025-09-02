import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/react-app/components/AuthContext";
import { 
  ArrowLeft, 
  Brain, 
  Trophy, 
  Flame, 
  BookOpen, 
  Target,
  ChevronRight,
  Plus,
  Sparkles,
  ArrowRight,
  Play,
  FileText,
  MessageSquare,
  Zap,
  Check,
  Star,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

const demoClones = [
  {
    id: 1,
    professor_name: "Professor Sarah Chen",
    course_name: "Constitutional Law", 
    school_name: "Harvard Law School",
    materials_count: 23,
    prediction_accuracy: "87%",
    last_updated: "2 hours ago"
  },
  {
    id: 2,
    professor_name: "Professor Michael Rodriguez",
    course_name: "Contract Law",
    school_name: "Stanford Law School",
    materials_count: 18,
    prediction_accuracy: "91%",
    last_updated: "1 day ago"
  },
  {
    id: 3,
    professor_name: "Professor Jennifer Williams",
    course_name: "Criminal Law",
    school_name: "Yale Law School",
    materials_count: 31,
    prediction_accuracy: "96%",
    last_updated: "3 hours ago"
  }
];

const demoStats = {
  study_streak: 7,
  points: 1250,
  level: 3,
  total_study_sessions: 24
};

export default function DemoPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showEmailCapture, setShowEmailCapture] = useState(true);
  const [showStudyDemo, setShowStudyDemo] = useState(false);
  const [selectedClone, setSelectedClone] = useState(demoClones[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  // Ensure demo always starts with email capture for non-authenticated users
  useEffect(() => {
    if (!user) {
      setShowEmailCapture(true);
      setShowStudyDemo(false);
    }
  }, [user]);

  const handleDemoAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/demo-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() })
      });

      if (response.ok) {
        setShowEmailCapture(false);
      } else {
        alert("Failed to access demo. Please try again.");
      }
    } catch (error) {
      alert("Failed to access demo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showEmailCapture) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navigation />

        <main className="relative z-10">
          <section className="px-6 py-16 min-h-[80vh] flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full text-sm font-medium text-blue-700">
                  <Play className="w-4 h-4" />
                  Exclusive Demo Access
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-thin tracking-tight leading-tight mb-8">
                <span className="block text-gray-900">Experience the future</span>
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">of law school.</span>
              </h1>
              
              <p className="text-xl font-light text-gray-600 mb-12 leading-relaxed">
                See how AI professor clones predict exams with 87% accuracy and generate personalized study materials that actually work.
              </p>

              <GlassCard 
                className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl text-left"
                opacity={0.05}
                blur="xl"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Get Instant Demo Access</h3>
                  <p className="text-gray-600 font-light">Join 1,724+ law students already using OutLaw</p>
                </div>

                <form onSubmit={handleDemoAccess} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    className="group w-full py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    <span>Start Interactive Demo</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
                      <div className="text-xs text-gray-600">Prediction Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 mb-1">1,724+</div>
                      <div className="text-xs text-gray-600">Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">198</div>
                      <div className="text-xs text-gray-600">Law Schools</div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <p className="mt-8 text-sm text-gray-500">
                No spam, ever. Just exclusive access to the most advanced AI study tool for law students.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  if (showStudyDemo) {
    return <StudyDemo onBack={() => setShowStudyDemo(false)} selectedClone={selectedClone} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Demo Banner */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-center py-4 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <Play className="w-3 h-3 text-white" />
          </div>
          <p className="text-sm font-medium text-white">
            Demo Mode - Welcome {name}! Explore OutLaw's AI features
          </p>
        </div>
      </div>

      <Navigation />

      <main className="relative z-10">
        {/* Welcome Section */}
        <section className="px-6 pt-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/70 backdrop-blur-xl rounded-full text-sm font-medium text-gray-700 border border-gray-200/50">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  Interactive Demo Dashboard
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-thin tracking-tight leading-tight mb-6">
                <span className="block text-gray-900">Your AI-powered</span>
                <span className="block text-gray-900">law school companion.</span>
              </h1>
              
              <p className="text-xl font-light text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                This is your personal dashboard where AI professor clones predict exams and generate study materials tailored to your professors' exact teaching styles.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <GlassCard 
                className="group p-6 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                      {demoStats.study_streak}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Day Streak</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="group p-6 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                      {demoStats.points}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Points</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="group p-6 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                      {demoStats.level}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Level</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="group p-6 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {demoStats.total_study_sessions}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Sessions</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Professor Clones Section */}
        <section className="px-6 py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-thin text-gray-900 mb-4">Your AI Professor Clones</h2>
              <p className="text-lg font-light text-gray-600 mb-8">Each clone knows your professor's exact exam patterns and teaching style</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                All clones active and ready
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {demoClones.map((clone) => (
                <GlassCard 
                  key={clone.id} 
                  className="group p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
                  opacity={0.05}
                  blur="xl"
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors duration-300">
                          {clone.professor_name}
                        </h3>
                        <p className="text-gray-600 font-medium mb-1 group-hover:text-gray-700 transition-colors duration-300">
                          {clone.course_name}
                        </p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                          {clone.school_name}
                        </p>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-xs">
                            <Target className="w-3 h-3 text-green-500" />
                            <span className="font-medium text-green-700">{clone.prediction_accuracy} prediction accuracy</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <BookOpen className="w-3 h-3 text-blue-500" />
                            <span className="text-gray-600">{clone.materials_count} study materials generated</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="w-3 h-3 text-purple-500" />
                            <span className="text-gray-600">Updated {clone.last_updated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                      <Button 
                        variant="secondary"
                        className="group w-full py-3 text-gray-700 hover:text-black hover:bg-gray-100/50 rounded-full border-0 font-medium transition-all duration-300"
                        onClick={() => {
                          setSelectedClone(clone);
                          setShowStudyDemo(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span>Chat with professor</span>
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                      
                      <Link to="/dashboard">
                        <Button 
                          variant="ghost"
                          className="group w-full py-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full border-0 font-medium transition-all duration-300"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          <span>View exam prediction</span>
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/dashboard">
                <Button 
                  variant="secondary"
                  className="group px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Create new professor clone</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Demo CTA */}
        <section className="px-6 py-32 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full text-sm font-medium text-blue-700">
                <Sparkles className="w-4 h-4" />
                Ready to create your real professor clones?
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-thin text-gray-900 mb-8 leading-tight">
              <span className="block">Transform your</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">law school experience.</span>
            </h2>
            
            <p className="text-xl font-light text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Sign up to upload your actual course materials and create personalized AI clones of your professors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/">
                <Button 
                  size="lg"
                  className="group text-lg px-12 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Create your account</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/about">
                <Button 
                  variant="ghost"
                  size="lg"
                  className="group text-lg px-12 py-4 text-gray-700 hover:text-black rounded-full border-0 font-medium hover:bg-gray-100/50 transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  <span>Learn more</span>
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-gray-500 text-sm font-light">
              <div className="flex items-center gap-2 hover:text-gray-600 transition-colors duration-300 cursor-pointer group">
                <Check className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                <span>Free to start</span>
              </div>
              <div className="w-px h-4 bg-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2 hover:text-gray-600 transition-colors duration-300 cursor-pointer group">
                <Check className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span>5-minute setup</span>
              </div>
              <div className="w-px h-4 bg-gray-300 hidden md:block"></div>
              <div className="flex items-center gap-2 hover:text-gray-600 transition-colors duration-300 cursor-pointer group">
                <Check className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                <span>Works with any professor</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StudyDemo({ onBack, selectedClone }: { onBack: () => void, selectedClone: any }) {
  const [currentContent, setCurrentContent] = useState("exam_prediction");
  const [showAnswer, setShowAnswer] = useState(false);

  const examPrediction = {
    likely_topics: [
      "Offer and Acceptance Elements",
      "Consideration Requirements", 
      "Contract Formation Defenses",
      "Breach of Contract Remedies",
      "Statute of Frauds Applications"
    ],
    question_types: [
      "Long-Form Essay Questions",
      "Multi-Party Fact Patterns", 
      "Contract Interpretation Issues",
      "Remedies Analysis Questions"
    ],
    practice_question: {
      question: "Sarah, a law student, sees an advertisement in the local newspaper: 'Brand new MacBook Pro for sale - $800 firm. First come, first served. Call 555-1234.' Sarah immediately calls the number and speaks to the seller, Mike, who confirms the laptop is still available. Sarah says, 'I'll take it, but I can only pay $750 cash today.' Mike responds, 'I clearly said $800 firm, but I really need the money. How about $775?' Sarah agrees and says she'll come by at 3 PM with the cash.\n\nAt 2:30 PM, before Sarah arrives, Mike receives a call from Tom, who offers to pay the full $800 immediately. Mike sells the laptop to Tom. When Sarah arrives at 3 PM with $775 cash, Mike informs her the laptop has been sold.\n\nSarah is furious and claims Mike breached their contract. She demands either the laptop or $200 in damages (the difference between Mike's price and market value of $975).\n\nAnalyze all potential contract claims and defenses. Include relevant case law and contract principles in your analysis. What remedies, if any, is Sarah entitled to?",
      answer: "**I. Contract Formation Analysis**\n\n**A. Offer and Acceptance**\nThe newspaper advertisement is likely an invitation to deal rather than an offer. In *Lefkowitz v. Great Minneapolis Surplus Store*, advertisements are generally invitations unless they are definite, explicit, and leave nothing open for negotiation. Here, 'first come, first served' suggests a more definite commitment, creating a stronger argument for an offer.\n\nMike's confirmation that the laptop is available could constitute a valid offer at $800.\n\n**B. Sarah's Response - Counteroffer**\nSarah's statement 'I'll take it, but I can only pay $750' is a counteroffer under the mirror image rule (*Peerless Glass Co. v. Pacific Crockery Co.*). This counteroffer rejected Mike's original offer and terminated it.\n\n**C. Mike's Counteroffer and Acceptance**\nMike's response of '$775' constitutes a new counteroffer. Sarah's agreement creates a valid contract at $775 for 3 PM delivery.\n\n**II. Contract Terms**\n- Price: $775\n- Performance: Sarah to pay cash, Mike to deliver laptop\n- Time: 3 PM meeting\n\n**III. Breach Analysis**\nMike materially breached by selling to Tom before the agreed performance time. This constitutes anticipatory repudiation.\n\n**IV. Remedies**\n**A. Specific Performance**: Generally unavailable for personal property unless unique (*Sedmak v. Charlie's Chevrolet*). A standard MacBook Pro likely fails this test.\n\n**B. Expectation Damages**: \nMarket value ($975) - Contract price ($775) = $200\nThis assumes Sarah can prove $975 market value.\n\n**C. Reliance Damages**: Minimal here - perhaps transportation costs to Mike's location.\n\n**V. Defenses**\nMike might argue:\n1. No contract formed due to indefinite terms\n2. Advertisement was not an offer\n3. Statute of Frauds (unlikely to apply)\n\n**Conclusion**: Sarah likely has a valid contract claim. Expectation damages of $200 represent her best remedy, assuming she can prove market value. Specific performance is unlikely to be granted for a standard laptop."
    }
  };

  const chatMessages = [
    {
      role: "professor",
      content: "Welcome! I'm Professor Rodriguez. I see you're reviewing contract formation. Based on your study patterns, you need to strengthen your understanding of the mirror image rule and consideration. Let's work through a practice scenario."
    },
    {
      role: "student", 
      content: "That's perfect. I'm still confused about when a response counts as acceptance versus a counteroffer. Can you help me understand the mirror image rule better?"
    },
    {
      role: "professor",
      content: "Excellent question! Remember: under the mirror image rule, acceptance must match the offer exactly. ANY change in terms - price, quantity, delivery - creates a counteroffer that rejects the original offer. Think of it like this: if I offer to sell you my casebook for $100, and you say 'I'll take it for $95,' you've just rejected my offer and made a new one. The original $100 offer is dead. Now I can accept your $95 offer, reject it, or make another counteroffer. Does this help clarify the concept?"
    },
    {
      role: "student",
      content: "Yes! So in our practice exam scenario, when Sarah said she'd pay $750 instead of $800, that killed Mike's original offer?"
    },
    {
      role: "professor", 
      content: "Exactly right! You're thinking like a lawyer now. Sarah's $750 response was a counteroffer that terminated Mike's $800 offer. The new negotiation started fresh from that point. This is why contract formation requires such careful analysis of each communication between the parties."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Demo Banner */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-center py-4 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <Play className="w-3 h-3 text-white" />
          </div>
          <p className="text-sm font-medium text-white">
            Interactive Demo - Professor Rodriguez's Contract Law
          </p>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{selectedClone.professor_name}</h1>
                <p className="text-gray-600 text-sm">{selectedClone.course_name} - {selectedClone.school_name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Home
            </Link>
            <div className="text-right">
              <div className="text-sm text-gray-500 font-light">AI Demo</div>
              <div className="text-lg font-semibold text-gray-900">Interactive Experience</div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentContent("exam_prediction")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  currentContent === "exam_prediction" 
                    ? "bg-black text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FileText className="w-4 h-4 mr-2 inline" />
                Exam Prediction
              </button>
              <button
                onClick={() => setCurrentContent("chat")}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  currentContent === "chat" 
                    ? "bg-black text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2 inline" />
                Professor Chat
              </button>
            </div>
          </div>

          {/* Content Areas */}
          {currentContent === "exam_prediction" && (
            <div className="space-y-8">
              {/* Exam Prediction Overview */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-900">AI Exam Prediction</h2>
                    <p className="text-gray-600 font-light">Based on Professor Chen's teaching patterns and past exams</p>
                  </div>
                  <div className="ml-auto">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{selectedClone.prediction_accuracy}</div>
                      <div className="text-sm text-gray-500">Accuracy Rate</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      Likely Exam Topics
                    </h3>
                    <div className="space-y-3">
                      {examPrediction.likely_topics.map((topic, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-900 font-medium">{topic}</span>
                          <div className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            High Priority
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      Question Types
                    </h3>
                    <div className="space-y-3">
                      {examPrediction.question_types.map((type, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:bg-purple-50 transition-colors duration-200 cursor-pointer">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-900 font-medium">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Practice Question */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">AI-Generated Practice Question</h3>
                    <p className="text-gray-600 font-light">Matches Professor Rodriguez's exam style and difficulty</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-white rounded-xl border border-gray-200">
                    <div className="text-gray-900 whitespace-pre-wrap font-light leading-relaxed">
                      {examPrediction.practice_question.question}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowAnswer(!showAnswer)}
                      variant="secondary"
                      className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02]"
                    >
                      {showAnswer ? "Hide Model Answer" : "Show Model Answer"}
                    </Button>
                    
                    <Link to="/">
                      <Button className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                        Get Full Access
                      </Button>
                    </Link>
                  </div>
                  
                  {showAnswer && (
                    <GlassCard 
                      className="p-6 backdrop-blur-lg border-gray-200/30"
                      opacity={0.05}
                      blur="lg"
                    >
                      <div className="text-sm text-gray-600 mb-3 font-medium">Model Answer (Professor Rodriguez's Preferred Style):</div>
                      <div className="text-gray-800 whitespace-pre-wrap font-light leading-relaxed">
                        {examPrediction.practice_question.answer}
                      </div>
                    </GlassCard>
                  )}
                </div>
              </GlassCard>
            </div>
          )}

          {currentContent === "chat" && (
            <GlassCard 
              className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-xl"
              opacity={0.05}
              blur="xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Chat with Professor Rodriguez</h3>
                  <p className="text-gray-600 font-light">AI that thinks and teaches exactly like your real professor</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-4xl">
                      <div
                        className={`p-4 rounded-2xl transition-all duration-200 ${
                          message.role === 'student'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-900 border border-gray-200'
                        }`}
                      >
                        <div className="text-sm leading-relaxed font-light">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask Professor Rodriguez anything about Contract Law..."
                    className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-2xl text-gray-500 cursor-not-allowed"
                    disabled
                  />
                  <Link to="/">
                    <Button className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-2xl border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                      Unlock Chat
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          )}
          
          {/* CTA at bottom */}
          <div className="mt-16 text-center">
            <GlassCard 
              className="p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
              opacity={0.05}
              blur="xl"
            >
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-semibold mb-6 text-gray-900">Ready to Create Your Real Professor Clones?</h3>
                <p className="text-xl text-gray-600 mb-10 font-light leading-relaxed">
                  Upload your actual syllabi and course materials to get personalized study materials tailored to your professors' exact teaching styles and exam preferences.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Link to="/">
                    <Button size="lg" className="group px-12 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl text-lg">
                      <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Sign up for free</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>1,724+ students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>4.9/5 rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>87% exam accuracy</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
