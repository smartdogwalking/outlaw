import { useSearchParams, useNavigate } from "react-router";
import { X, ArrowLeft, CreditCard } from "lucide-react";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const returnUrl = searchParams.get('return') || '/upgrade';

  const handleRetryPayment = () => {
    navigate('/upgrade');
  };

  const handleGoBack = () => {
    navigate(returnUrl);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <main className="relative z-10">
        <section className="px-6 py-32 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg">
              <X className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-thin text-gray-900 mb-6">
              Payment Cancelled
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              No worries! Your payment was cancelled and no charges were made. 
              You can try again whenever you're ready.
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={handleRetryPayment}
                size="lg"
                className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg mr-4"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                <span>Try Payment Again</span>
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="secondary"
                size="lg"
                className="group px-12 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Go Back</span>
              </Button>
            </div>

            <div className="mt-16 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2">Still interested in Premium?</h3>
              <p className="text-gray-600 text-sm mb-4">
                OutLaw Premium gives you unlimited access to AI professor clones, 
                advanced exam predictions, and personalized study materials.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>✓ 7-day free trial</span>
                <span>✓ Cancel anytime</span>
                <span>✓ No hidden fees</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
