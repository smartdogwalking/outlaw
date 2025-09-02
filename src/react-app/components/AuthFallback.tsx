import { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

interface AuthFallbackProps {
  onTimeout?: () => void;
}

export default function AuthFallback({ onTimeout }: AuthFallbackProps) {
  const [countdown, setCountdown] = useState(3);
  const [showBypass, setShowBypass] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowBypass(true);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const handleBypass = () => {
    console.log('User chose to bypass auth');
    sessionStorage.setItem('bypassAuth', 'true');
    window.location.reload();
  };

  if (showBypass) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Taking longer than expected</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The app is taking a while to load. You can continue to explore OutLaw while we work on this.
          </p>
          <button 
            onClick={handleBypass}
            className="w-full px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
          >
            Continue to OutLaw
          </button>
          <p className="text-xs text-gray-500 mt-4">
            This will skip the loading check and take you straight to the app
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Loading OutLaw...</h2>
        <p className="text-gray-600">
          {countdown > 0 ? `Please wait ${countdown} seconds...` : 'Almost ready...'}
        </p>
      </div>
    </div>
  );
}
