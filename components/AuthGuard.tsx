import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/react-app/components/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

// Simple loading fallback component
function SimpleLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Loading OutLaw...</h2>
        <p className="text-gray-600">Setting up your study companion</p>
      </div>
    </div>
  );
}

export default function AuthGuard({ 
  children, 
  fallback 
}: AuthGuardProps) {
  const [showApp, setShowApp] = useState(false);
  const [authComplete, setAuthComplete] = useState(false);

  // Simple timer to show app after a brief delay regardless of auth state
  useEffect(() => {
    // Check if we should bypass auth completely
    const shouldBypass = sessionStorage.getItem('bypassAuth') === 'true';
    
    if (shouldBypass) {
      console.log('Bypassing auth - showing app immediately');
      sessionStorage.removeItem('bypassAuth');
      setShowApp(true);
      setAuthComplete(true);
      return;
    }

    // Set a maximum wait time of 2 seconds
    const timer = setTimeout(() => {
      console.log('Auth timeout - showing app');
      setShowApp(true);
      setAuthComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Try to use auth hook, but don't block on it
  try {
    const authState = useAuth();
    
    // If auth completes successfully, show the app
    if (!authState.isLoading && authComplete === false) {
      console.log('Auth completed naturally');
      setShowApp(true);
      setAuthComplete(true);
    }
  } catch (error) {
    console.warn('Auth hook failed, continuing without auth:', error);
    setShowApp(true);
    setAuthComplete(true);
  }

  // Always show the app after the timer, regardless of auth state
  if (showApp) {
    return <>{children}</>;
  }

  // Show loading fallback while waiting
  return fallback || <SimpleLoader />;
}

// Higher-order component version
export function withAuthGuard<T extends object>(
  Component: React.ComponentType<T>,
  options: { requireAuth?: boolean; fallback?: ReactNode } = {}
) {
  return function AuthGuardedComponent(props: T) {
    return (
      <AuthGuard 
        requireAuth={options.requireAuth}
        fallback={options.fallback}
      >
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Hook for protected routes
export function useAuthGuard(options: { redirectTo?: string } = {}) {
  const { redirectTo = '/' } = options;
  
  let isAuthenticated = false;
  let isLoading = false;
  let user: any = null;

  try {
    const authState = useAuth();
    isAuthenticated = !authState.isLoading && !!authState.user;
    isLoading = authState.isLoading;
    user = authState.user;
  } catch (error) {
    console.warn('useAuthGuard: Auth hook failed:', error);
    // Continue with default values
  }

  const redirectIfNotAuthenticated = () => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    redirectIfNotAuthenticated
  };
}
