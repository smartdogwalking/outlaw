import { ReactNode, useState, useEffect } from "react";
import { Lock, Crown, Zap, ArrowRight, X } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/react-app/components/AuthContext";
import GlassCard from "./GlassCard";
import Button from "./Button";

interface PremiumLockProps {
  children: ReactNode;
  feature: string;
  title?: string;
  description?: string;
  showPreview?: boolean;
  className?: string;
}

export default function PremiumLock({ 
  children, 
  feature, 
  title, 
  description,
  showPreview = true,
  className = ""
}: PremiumLockProps) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const response = await fetch('/api/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to check subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If user has premium, show the content
  if (subscription?.subscription_type === 'premium' && subscription?.is_active) {
    return <>{children}</>;
  }

  // Feature-specific content
  const getFeatureInfo = (feature: string) => {
    switch (feature) {
      case 'unlimited_clones':
        return {
          title: title || "Create Unlimited Professor Clones",
          description: description || "Premium users can create AI clones for all their professors and courses.",
          icon: Crown,
          benefits: [
            "Unlimited professor clones",
            "All course subjects supported", 
            "Advanced personality modeling",
            "Priority AI processing"
          ]
        };
      case 'multiple_clones':
        return {
          title: title || "Create Multiple Professor Clones", 
          description: description || "Free accounts are limited to one professor clone. Upgrade to create clones for all your courses.",
          icon: Crown,
          benefits: [
            "Unlimited professor clones",
            "Create clones for all courses",
            "Advanced features unlocked",
            "Priority support"
          ]
        };
      case 'advanced_chat':
        return {
          title: title || "Unlimited Professor Chat",
          description: description || "Free users are limited to 20 messages per day. Premium users get unlimited chat access.",
          icon: Zap,
          benefits: [
            "Unlimited chat messages",
            "Advanced conversation memory",
            "Faster response times",
            "Priority AI access"
          ]
        };
      case 'exam_predictions':
        return {
          title: title || "Advanced Exam Predictions",
          description: description || "Get detailed exam predictions with question types, topics, and practice materials.",
          icon: Lock,
          benefits: [
            "Detailed exam predictions",
            "Question type analysis", 
            "Topic probability scoring",
            "Practice question generation"
          ]
        };
      default:
        return {
          title: title || "Premium Feature",
          description: description || "This feature requires a Premium subscription.",
          icon: Crown,
          benefits: [
            "All premium features",
            "Unlimited access",
            "Priority support",
            "Advanced AI models"
          ]
        };
    }
  };

  const featureInfo = getFeatureInfo(feature);
  const IconComponent = featureInfo.icon;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Blurred Preview */}
        {showPreview && (
          <div className="relative">
            <div className="blur-sm opacity-50 pointer-events-none select-none">
              {children}
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent"></div>
          </div>
        )}

        {/* Lock Overlay */}
        <div className={`${showPreview ? 'absolute inset-0' : ''} flex items-center justify-center p-8`}>
          <GlassCard 
            className="max-w-md w-full p-8 backdrop-blur-3xl border-gray-200/30 shadow-xl text-center"
            opacity={0.1}
            blur="xl"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {featureInfo.title}
            </h3>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {featureInfo.description}
            </p>

            <div className="space-y-3 mb-8">
              {featureInfo.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <Link to={`/upgrade?feature=${feature}&return=${encodeURIComponent(window.location.pathname)}`}>
                <Button 
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  <span>Upgrade to Premium</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
              >
                Learn more about Premium
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Premium Info Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xl">
          <div className="absolute inset-0" onClick={() => setShowModal(false)}></div>
          
          <GlassCard 
            className="relative max-w-lg w-full p-8 backdrop-blur-3xl border-gray-200/30 shadow-2xl"
            opacity={0.15}
            blur="xl"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">OutLaw Premium</h2>
              <p className="text-gray-600">Unlock the full power of AI-driven legal education</p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "Unlimited professor clones",
                "Unlimited AI chat messages", 
                "Advanced exam predictions",
                "Priority customer support",
                "Early access to new features",
                "7-day free trial"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">$9.99<span className="text-lg font-normal text-gray-600">/month</span></div>
              <p className="text-sm text-gray-500">Cancel anytime • No hidden fees</p>
            </div>

            <Link to={`/upgrade?feature=${feature}&return=${encodeURIComponent(window.location.pathname)}`}>
              <Button 
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                onClick={() => setShowModal(false)}
              >
                <Crown className="w-5 h-5 mr-2" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </GlassCard>
        </div>
      )}
    </>
  );
}
