import { useState, useEffect } from "react";
import { X, LogIn, UserPlus, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

interface NewAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signin' | 'signup';
}

export default function NewAuthModal({ isOpen, onClose, mode = 'signup' }: NewAuthModalProps) {
  const { signIn, isLoading, error, clearError } = useAuth();
  const [currentMode, setCurrentMode] = useState(mode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentMode(mode);
      clearError();
      setShowSuccess(false);
      setIsSubmitting(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, mode, clearError]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  const handleAuth = async () => {
    console.log(`🔐 Modal: Starting ${currentMode}...`);
    
    setIsSubmitting(true);
    clearError();
    
    try {
      const success = await signIn(currentMode);
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          // For new users, go to onboarding, for existing users go to dashboard
          if (currentMode === 'signup') {
            window.location.href = '/onboarding';
          } else {
            window.location.href = '/dashboard';
          }
        }, 1500);
      }
    } catch (err) {
      console.error('🔐 Modal auth error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    if (!isSubmitting) {
      setCurrentMode(newMode);
      clearError();
    }
  };

  if (showSuccess) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Welcome to OutLaw!</h2>
          <p className="text-gray-600">You're all set. Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close authentication dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 pt-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              {currentMode === 'signin' ? (
                <LogIn className="w-8 h-8 text-white" />
              ) : (
                <UserPlus className="w-8 h-8 text-white" />
              )}
            </div>
            
            <h1 id="auth-modal-title" className="text-3xl font-semibold text-gray-900 mb-3">
              {currentMode === 'signin' ? 'Welcome back!' : 'Join OutLaw today!'}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {currentMode === 'signin' 
                ? 'Sign in to continue your AI-powered study journey' 
                : 'Start studying smarter with AI professor clones'
              }
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl" role="alert">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700 font-medium mb-1">Authentication Error</p>
                  <p className="text-sm text-red-600">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {(isLoading || isSubmitting) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-700 font-medium">
                  {isSubmitting ? 'Signing you in...' : 'Loading...'}
                </p>
              </div>
            </div>
          )}

          {/* Auth Button */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleAuth}
              disabled={isSubmitting || isLoading}
              className={`w-full py-4 rounded-2xl font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                currentMode === 'signin'
                  ? 'bg-black hover:bg-gray-800 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : currentMode === 'signin' ? (
                <LogIn className="w-5 h-5" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
              {isSubmitting 
                ? 'Signing in...' 
                : currentMode === 'signin'
                  ? 'Sign in with Google'
                  : 'Get started free'
              }
            </button>
            
            {/* Mode Switch */}
            <div className="text-center">
              <span className="text-gray-500 text-sm">
                {currentMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                onClick={() => switchMode(currentMode === 'signin' ? 'signup' : 'signin')}
                disabled={isSubmitting || isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm underline underline-offset-2 hover:no-underline transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentMode === 'signin' ? 'Create account' : 'Sign in here'}
              </button>
            </div>
          </div>

          {/* Features Preview - Only for signup */}
          {currentMode === 'signup' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">What you'll get instantly:</h4>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span>AI professor clones that predict your exact exam questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span>Personalized study materials for every course</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span>24/7 AI chat support when you're stuck</span>
                </div>
              </div>
            </div>
          )}

          {/* Trust indicators */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Free to start
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                1,724+ students
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                87% accuracy
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to our{' '}
              <a 
                href="/terms" 
                className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>{' '}
              and{' '}
              <a 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
