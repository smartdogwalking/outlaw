import { useEffect, useState } from "react";
import { Loader2, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";

type AuthCallbackState = 
  | 'processing'
  | 'authenticating'
  | 'success'
  | 'error';

export default function AuthCallback() {
  const [state, setState] = useState<AuthCallbackState>('processing');
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Starting authentication...");
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const processAuthCallback = async () => {
      console.log('🔐 AuthCallback: Starting process');
      console.log('🔐 AuthCallback: Current URL:', window.location.href);
      
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const errorParam = urlParams.get('error');
        const mode = urlParams.get('mode') || 'signin';
        
        const debug = {
          fullUrl: window.location.href,
          hasCode: !!code,
          codeLength: code?.length || 0,
          errorParam,
          mode,
          allParams: Object.fromEntries(urlParams.entries())
        };
        
        setDebugInfo(debug);
        console.log('🔐 AuthCallback: Debug info:', debug);
        
        // Handle OAuth errors from Google
        if (errorParam) {
          console.error('❌ AuthCallback: OAuth error from Google:', errorParam);
          setError(`Authentication cancelled: ${errorParam}`);
          setState('error');
          setTimeout(() => window.location.href = "/", 3000);
          return;
        }
        
        // Check for authorization code
        if (!code) {
          console.error('❌ AuthCallback: No authorization code found');
          setError("No authorization code received. Please try signing in again.");
          setState('error');
          setTimeout(() => window.location.href = "/", 3000);
          return;
        }

        // Exchange code for session token
        setState('authenticating');
        setStatusMessage("Completing authentication...");
        console.log('🔐 AuthCallback: Exchanging code for session token...');
        console.log('🔐 AuthCallback: Code preview:', code.substring(0, 20) + '...');
        
        const sessionResponse = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code })
        });
        
        console.log('🔐 AuthCallback: Session API response status:', sessionResponse.status);
        console.log('🔐 AuthCallback: Session API response ok:', sessionResponse.ok);
        console.log('🔐 AuthCallback: Response headers:', Object.fromEntries(sessionResponse.headers.entries()));
        
        // Read the response
        const responseText = await sessionResponse.text();
        console.log('🔐 AuthCallback: Raw response text:', responseText);
        
        if (!sessionResponse.ok) {
          console.error('❌ AuthCallback: Session creation failed');
          console.error('❌ AuthCallback: Status:', sessionResponse.status);
          console.error('❌ AuthCallback: Response:', responseText);
          
          setError(`Authentication failed (${sessionResponse.status}). Please try signing in again.`);
          setState('error');
          setTimeout(() => window.location.href = "/", 3000);
          return;
        }
        
        // Parse JSON response
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('🔐 AuthCallback: Parsed session data:', data);
        } catch (parseError) {
          console.error('❌ AuthCallback: Failed to parse response JSON:', parseError);
          console.error('❌ AuthCallback: Raw response was:', responseText);
          
          setError("Invalid response from server. Please try again.");
          setState('error');
          setTimeout(() => window.location.href = "/", 3000);
          return;
        }
        
        if (!data || !data.success) {
          console.error('❌ AuthCallback: Session creation returned error:', data?.error || 'No success flag');
          setError(data?.error || "Authentication failed. Please try signing in again.");
          setState('error');
          setTimeout(() => window.location.href = "/", 3000);
          return;
        }
        
        console.log('✅ AuthCallback: Authentication successful! Preparing redirect...');
        setState('success');
        setStatusMessage("Authentication successful! Redirecting...");
        
        // Wait a moment to show success, then redirect
        setTimeout(() => {
          if (mode === 'signup') {
            console.log('🔐 AuthCallback: Redirecting to onboarding for new user');
            window.location.href = '/onboarding';
          } else {
            console.log('🔐 AuthCallback: Redirecting to dashboard for existing user');
            window.location.href = '/dashboard';
          }
        }, 1500);
        
      } catch (error) {
        console.error('❌ AuthCallback: Unexpected error:', error);
        const err = error as Error;
        
        // Provide specific error messages based on error type
        let errorMessage = "Unexpected error occurred.";
        if (err.message?.includes('fetch')) {
          errorMessage = "Network error during authentication. Please check your connection.";
        } else if (err.message?.includes('JSON')) {
          errorMessage = "Invalid response from server. Please try again.";
        } else {
          errorMessage = `Unexpected error: ${err.message}`;
        }
        
        console.error('❌ AuthCallback: Setting error state:', errorMessage);
        setError(errorMessage);
        setState('error');
        setTimeout(() => window.location.href = "/", 3000);
      }
    };

    // Only process once when component mounts
    if (state === 'processing') {
      processAuthCallback();
    }
  }, [state]);

  const getIcon = () => {
    switch (state) {
      case 'error':
        return <AlertCircle className="w-10 h-10 text-white" />;
      case 'success':
        return <CheckCircle className="w-10 h-10 text-white" />;
      default:
        return <Sparkles className="w-10 h-10 text-white animate-pulse" />;
    }
  };

  const getIconColor = () => {
    switch (state) {
      case 'error':
        return 'from-red-500 to-orange-500';
      case 'success':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  const getTitle = () => {
    switch (state) {
      case 'error':
        return "Authentication Failed";
      case 'success':
        return "Welcome to OutLaw!";
      case 'authenticating':
        return "Almost There...";
      default:
        return "Signing You In";
    }
  };

  const getDescription = () => {
    if (error) return error;
    return statusMessage;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 text-center">
        <GlassCard 
          className="p-12 backdrop-blur-3xl border-gray-200/30 shadow-2xl max-w-md mx-auto"
          opacity={0.1}
          blur="xl"
        >
          <div className="mb-8">
            <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl bg-gradient-to-br ${getIconColor()}`}>
              {getIcon()}
            </div>
            
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              {getTitle()}
            </h1>
            
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              {getDescription()}
            </p>
          </div>

          {!error && state !== 'success' && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="text-gray-600 font-medium">
                Please wait...
              </span>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-sm text-gray-500 font-light">
              {error 
                ? "You'll be redirected to the homepage shortly" 
                : state === 'success'
                  ? "Automatically redirecting you now..."
                  : "This should only take a moment"
              }
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 bg-gradient-to-r ${getIconColor()} rounded-full transition-all duration-1000 ${
                  state === 'processing' ? 'w-1/3' :
                  state === 'authenticating' ? 'w-2/3' :
                  state === 'success' ? 'w-full' :
                  state === 'error' ? 'w-full bg-gradient-to-r from-red-500 to-red-600' : 'w-1/3'
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className={state === 'processing' ? 'text-blue-600 font-medium' : ''}>
                Starting
              </span>
              <span className={state === 'authenticating' ? 'text-blue-600 font-medium' : ''}>
                Authenticating
              </span>
              <span className={state === 'success' ? 'text-green-600 font-medium' : state === 'error' ? 'text-red-600 font-medium' : ''}>
                {state === 'error' ? 'Failed' : 'Complete'}
              </span>
            </div>
          </div>

          {/* Debug info - always visible for now */}
          <details className="mt-6 text-left">
            <summary className="text-xs text-gray-400 cursor-pointer">Debug Info</summary>
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
              <div><strong>State:</strong> {state}</div>
              <div><strong>URL:</strong> {window.location.href}</div>
              <div><strong>Has Code:</strong> {debugInfo.hasCode ? 'Yes' : 'No'}</div>
              <div><strong>Code Length:</strong> {debugInfo.codeLength}</div>
              <div><strong>Mode:</strong> {debugInfo.mode || 'None'}</div>
              <div><strong>Error Param:</strong> {debugInfo.errorParam || 'None'}</div>
              <div><strong>All Params:</strong> {JSON.stringify(debugInfo.allParams || {})}</div>
            </div>
          </details>
        </GlassCard>
      </div>
    </div>
  );
}
