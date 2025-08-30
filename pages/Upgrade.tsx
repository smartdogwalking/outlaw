import { useState, useEffect } from "react";
import { useAuth } from "@/react-app/components/AuthContext";
import { useNavigate, useSearchParams } from "react-router";
import { loadStripe } from '@stripe/stripe-js';
import { 
  Crown, 
  Check, 
  X,
  Brain,
  Zap,
  BookOpen,
  MessageSquare,
  FileText,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Rocket
} from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

interface UserSubscription {
  subscription_type: 'free' | 'premium';
  is_active: boolean;
}

export default function Upgrade() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  // Get the feature that triggered the upgrade prompt
  const featureSource = searchParams.get('feature');
  const returnUrl = searchParams.get('return') || '/dashboard';

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
      return;
    }

    if (user) {
      fetchSubscription();
    }
  }, [user, isLoading, navigate]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscription");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      // Create Stripe checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          source: featureSource,
          return_url: returnUrl
        })
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        
        // Redirect to Stripe Checkout
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            console.error('Stripe error:', error);
            alert('Payment failed. Please try again.');
          }
        }
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Failed to start checkout. Please try again or contact support.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const getFeatureMessage = () => {
    switch (featureSource) {
      case 'multiple_clones':
        return {
          title: "Unlock Unlimited Professor Clones",
          description: "Create AI clones for all your courses and professors"
        };
      case 'advanced_chat':
        return {
          title: "Unlock Advanced Professor Chat",
          description: "Get unlimited messages and priority responses from your AI professors"
        };
      case 'exam_predictions':
        return {
          title: "Unlock Enhanced Exam Predictions",
          description: "Get detailed exam predictions with practice questions and study guides"
        };
      case 'study_materials':
        return {
          title: "Unlock Unlimited Study Materials",
          description: "Generate unlimited flashcards, hypotheticals, and practice tests"
        };
      default:
        return {
          title: "Unlock All Premium Features",
          description: "Get the complete OutLaw experience with unlimited access to everything"
        };
    }
  };

  const featureMessage = getFeatureMessage();

  if (isLoading || isPageLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
          <div className="text-xl font-medium text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // If already premium, show success page
  if (subscription?.subscription_type === 'premium' && subscription.is_active) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navigation />

        <main className="relative z-10">
          <section className="px-6 py-32 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-5xl font-thin text-gray-900 mb-6">
                You're Premium!
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                You already have access to all OutLaw Premium features.
              </p>
              
              <Button
                onClick={() => navigate('/dashboard')}
                size="lg"
                className="group px-12 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
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
        {/* Hero Section */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-full text-sm font-medium text-yellow-700">
                <Crown className="w-4 h-4" />
                {featureSource ? featureMessage.title : 'Upgrade to Premium'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-thin tracking-tight leading-tight mb-8">
              <span className="block text-gray-900">Unlock your</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">full potential.</span>
            </h1>
            
            <p className="text-xl font-light text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              {featureSource ? featureMessage.description : 'Get unlimited access to all OutLaw features and study like the top 1% of law students.'}
            </p>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 hover:opacity-80 transition-opacity duration-300 mb-16">
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

        {/* Pricing Plans */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Plan Toggle */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-full">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                    selectedPlan === 'monthly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 relative ${
                    selectedPlan === 'yearly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 25%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-lg relative"
                opacity={0.05}
                blur="xl"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Free Plan</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
                  <p className="text-gray-600">Basic features to get started</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">1 Professor Clone</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Basic Chat (20 messages/day)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Simple Exam Predictions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400">Unlimited Professor Clones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400">Advanced Study Materials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400">Priority Support</span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300"
                  disabled
                >
                  Current Plan
                </Button>
              </GlassCard>

              {/* Premium Plan */}
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-blue-300/50 shadow-2xl relative bg-gradient-to-b from-blue-50/20 to-purple-50/20"
                opacity={0.1}
                blur="xl"
              >
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Premium Plan</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-4">
                    ${selectedPlan === 'monthly' ? '9.99' : '7.49'}
                    <span className="text-lg font-normal text-gray-600">
                      /{selectedPlan === 'monthly' ? 'month' : 'month'}
                    </span>
                  </div>
                  {selectedPlan === 'yearly' && (
                    <div className="text-sm text-green-600 font-medium">Billed yearly - Save $30</div>
                  )}
                  <p className="text-gray-600">Everything you need to excel</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Unlimited Professor Clones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Unlimited Chat Messages</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Advanced Exam Predictions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Unlimited Study Materials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Priority AI Processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Email Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 font-medium">Export Study Materials</span>
                  </div>
                </div>

                <Button
                  onClick={handleUpgrade}
                  isLoading={isUpgrading}
                  size="lg"
                  className="group w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  <span>Upgrade to Premium</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Cancel anytime. 7-day free trial.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Premium Features Showcase */}
        <section className="px-6 py-20 bg-gray-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-thin text-gray-900 mb-4">
                What you get with Premium
              </h2>
              <p className="text-xl font-light text-gray-600">
                Unlock the complete OutLaw experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Unlimited Professor Clones</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create AI clones for all your professors and courses. No limits, no restrictions.
                </p>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Unlimited Chat</h3>
                <p className="text-gray-600 leading-relaxed">
                  Chat with your AI professors as much as you want. No daily message limits.
                </p>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Predictions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get detailed exam predictions with practice questions and comprehensive study guides.
                </p>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Unlimited Materials</h3>
                <p className="text-gray-600 leading-relaxed">
                  Generate unlimited flashcards, hypotheticals, practice tests, and study materials.
                </p>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Priority Processing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get faster AI responses and priority access during peak usage times.
                </p>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get priority email support and faster response times when you need help.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-thin text-gray-900 mb-4">
                Success stories from Premium users
              </h2>
              <p className="text-xl font-light text-gray-600">
                See what students achieve with OutLaw Premium
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-lg"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-800 text-lg leading-relaxed mb-6 italic">
                  "I went from struggling with C+ grades to earning an A- on my Constitutional Law final. 
                  The unlimited professor clones let me study for all my courses with personalized AI tutors."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    SM
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah M.</div>
                    <div className="text-sm text-gray-600">Georgetown Law, 2L</div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-lg"
                opacity={0.05}
                blur="xl"
              >
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-800 text-lg leading-relaxed mb-6 italic">
                  "The unlimited chat feature saved my law school career. I could ask my AI professors 
                  questions 24/7 and get instant help. Worth every penny for the peace of mind."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    AC
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Alex C.</div>
                    <div className="text-sm text-gray-600">NYU Law, 3L</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-5xl font-thin mb-8 leading-tight">
              <span className="block">Ready to unlock</span>
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">your potential?</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of law students who've transformed their study experience with OutLaw Premium.
            </p>
            
            <Button
              onClick={handleUpgrade}
              isLoading={isUpgrading}
              size="lg"
              className="group text-lg px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              <Crown className="w-5 h-5 mr-2" />
              <span>Upgrade to Premium Now</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <p className="text-sm text-gray-400 mt-6">
              7-day free trial • Cancel anytime • No hidden fees
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
