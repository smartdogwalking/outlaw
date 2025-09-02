import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ToastProvider } from "@/react-app/components/Toast";
import ScrollToTop from "@/react-app/components/ScrollToTop";
import Analytics from "@/react-app/components/Analytics";
import ErrorBoundary from "@/react-app/components/ErrorBoundary";
import LexChatbot from "@/react-app/components/LexChatbot";
import { AuthProvider } from "@/react-app/components/AuthContext";

// Import pages
import HomePage from "@/react-app/pages/Home";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import DashboardPage from "@/react-app/pages/Dashboard";
import OnboardingPage from "@/react-app/pages/Onboarding";
import CreateClonePage from "@/react-app/pages/CreateClone";
import QuickClonePage from "@/react-app/pages/QuickClone";
import StudyPage from "@/react-app/pages/Study";
import ExamPredictionPage from "@/react-app/pages/ExamPrediction";
import UpgradePage from "@/react-app/pages/Upgrade";
import PaymentSuccess from "@/react-app/pages/PaymentSuccess";
import PaymentCancel from "@/react-app/pages/PaymentCancel";
import DemoPage from "@/react-app/pages/DemoPage";
import AccountPage from "@/react-app/pages/Account";
import AboutPage from "@/react-app/pages/About";
import FeaturesPage from "@/react-app/pages/Features";
import FAQPage from "@/react-app/pages/FAQ";
import TermsPage from "@/react-app/pages/Terms";
import PrivacyPage from "@/react-app/pages/Privacy";
import DisclaimerPage from "@/react-app/pages/Disclaimer";
import ContactPage from "@/react-app/pages/Contact";
import SitemapPage from "@/react-app/pages/Sitemap";
import ColdCallHelpPage from "@/react-app/pages/ColdCallHelp";

// Emergency fallback component
function EmergencyFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">OutLaw</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          AI-powered law school study companion
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-300"
        >
          Refresh App
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallback={<EmergencyFallback />}>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/create-clone" element={<CreateClonePage />} />
              <Route path="/quick-clone" element={<QuickClonePage />} />
              <Route path="/cold-call-help" element={<ColdCallHelpPage />} />      
              <Route path="/study/:cloneId" element={<StudyPage />} />
              <Route path="/exam-prediction/:cloneId" element={<ExamPredictionPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/upgrade" element={<UpgradePage />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
            </Routes>
            <LexChatbot />
            <Analytics />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
