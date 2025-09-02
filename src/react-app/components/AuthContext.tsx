import React, { createContext, useContext } from 'react';
import { useAuth as useAuthHook } from '@/react-app/hooks/useAuth';
import type { User, AuthError } from '@/react-app/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  signIn: (mode?: 'signin' | 'signup') => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Simple component that renders children immediately - no auth blocking
export function ProtectedRoute({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useAuth();
  
  // Don't block on auth - render immediately
  if (!isInitialized) {
    return <>{children}</>;
  }
  
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">You need to sign in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
