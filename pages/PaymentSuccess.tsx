import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Check, ArrowRight, Star } from "lucide-react";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import GlassCard from "@/react-app/components/GlassCard";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const returnUrl = searchParams.get('return') || '/dashboard';

  useEffect(() => {
    if (sessionId) {
      // Verify the payment session
      fetch(`/api/verify-payment-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsLoading(false);
        } else {
          setError('Payment verification failed');
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Payment verification error:', err);
        setError('Failed to verify payment');
        setIsLoading(false);
      });
    } else {
      setError('No payment session found');
      setIsLoading(false);
    }
  }, [sessionId]);

  const handleContinue = () => {
    navigate(returnUrl);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
          <div className="text-xl font-medium text-gray-600">Verifying payment...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navigation />
        <main className="relative z-10">
          <section className="px-6 py-32 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">✗</span>
              </div>
              
              <h1 className="text-5xl font-thin text-gray-900 mb-6">
                Payment Error
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                {error}. Please contact support if you continue to have issues.
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/upgrade')}
                  size="lg"
                  className="px-12 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg mr-4"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate('/contact')}
                  variant="secondary"
                  size="lg"
                  className="px-12 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 text-lg"
                >
                  Contact Support
                </Button>
              </div>
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
        <section className="px-6 py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-thin text-gray-900 mb-6">
              Welcome to Premium!
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Your payment was successful. You now have access to all OutLaw Premium features.
            </p>

            {/* Premium Features Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <GlassCard 
                className="p-6 backdrop-blur-3xl border-gray-200/30 shadow-lg"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-white text-sm">∞</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Unlimited Clones</h3>
                <p className="text-sm text-gray-600">Create AI professor clones for all your courses</p>
              </GlassCard>

              <GlassCard 
                className="p-6 backdrop-blur-3xl border-gray-200/30 shadow-lg"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4 flex items-center justify-center shadow-lg mx-auto">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Premium Features</h3>
                <p className="text-sm text-gray-600">Advanced predictions and study materials</p>
              </GlassCard>

              <GlassCard 
                className="p-6 backdrop-blur-3xl border-gray-200/30 shadow-lg"
                opacity={0.05}
                blur="xl"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-4 flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-white text-sm">24/7</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Unlimited Chat</h3>
                <p className="text-sm text-gray-600">Chat with your AI professors anytime</p>
              </GlassCard>
            </div>
            
            <Button
              onClick={handleContinue}
              size="lg"
              className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              <span>Start Using Premium</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <p className="text-sm text-gray-500 mt-8">
              Receipt sent to your email • Manage subscription in Account settings
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
