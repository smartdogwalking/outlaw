import { useState, useCallback, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  google_user_data: {
    given_name: string;
    family_name: string;
    picture?: string;
  };
}

export interface AuthError {
  message: string;
  type: 'network' | 'server' | 'auth' | 'validation';
}

// Mock user for fallback authentication
const MOCK_USER: User = {
  id: 'mock-user-123',
  email: 'student@lawschool.edu',
  google_user_data: {
    given_name: '',
    family_name: '',
    picture: 'https://via.placeholder.com/150'
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Changed: start as false
  const [error, setError] = useState<AuthError | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth status - non-blocking
  const initialize = useCallback(async () => {
    if (isInitialized) return;
    
    console.log('🔐 Initializing auth...');
    setIsLoading(true);
    
    try {
      // Check for existing mock user first
      const mockUser = localStorage.getItem('outlaw_mock_user');
      if (mockUser) {
        const parsedUser = JSON.parse(mockUser);
        console.log('🔐 Found existing mock user:', parsedUser);
        setUser(parsedUser);
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }

      // Try to check real auth status (with timeout and error handling)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const userData = await response.json();
          console.log('🔐 Found authenticated user:', userData);
          setUser(userData);
        } else if (response.status === 401) {
          console.log('🔐 No authenticated user (401)');
          setUser(null);
        } else if (response.status === 503) {
          // Backend service unavailable (handled by Vite proxy)
          const errorData = await response.json().catch(() => ({ error: 'Backend unavailable' }));
          console.log('🔐 Backend service unavailable:', errorData.message || 'Service down');
          setUser(null);
        } else {
          console.log('🔐 Auth check failed, status:', response.status);
          setUser(null);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        // Handle various fetch errors
        const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
        
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('Failed to fetch')) {
          console.warn('🔐 Backend connection refused - backend server not running');
          console.warn('💡 Start backend with: npm run dev:backend');
        } else if (errorMessage.includes('AbortError') || errorMessage.includes('timeout')) {
          console.warn('🔐 Auth service timeout - backend may be starting up');
        } else {
          console.warn('🔐 Auth service unavailable:', errorMessage);
        }
        
        setUser(null);
      }
    } catch (error) {
      console.warn('🔐 Auth check failed (continuing without auth):', error);
      setUser(null);
    } finally {
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Sign in function
  const signIn = useCallback(async (mode: 'signin' | 'signup' = 'signin'): Promise<boolean> => {
    console.log(`🔐 Starting ${mode}...`);
    setIsLoading(true);
    setError(null);

    try {
      // Try real OAuth first with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`/api/auth/oauth/start?provider=google&mode=${mode}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.redirectUrl) {
          console.log('🔐 Redirecting to OAuth...');
          window.location.href = data.redirectUrl;
          return true;
        }
      }
      
      // If OAuth endpoint doesn't work, fall back to mock auth
      console.log('🔐 OAuth endpoint returned error, using mock auth');
      throw new Error('OAuth not available');
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn('🔐 Auth service timeout, using mock authentication');
        } else {
          console.warn('🔐 Auth service unavailable, using mock authentication:', error.message);
        }
      } else {
        console.warn('🔐 Auth service unavailable, using mock authentication:', String(error));
      }
      
      // Simulate auth process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        ...MOCK_USER,
        google_user_data: {
          given_name: 'Demo',
          family_name: 'Student',
          picture: 'https://via.placeholder.com/150'
        }
      };
      
      localStorage.setItem('outlaw_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsLoading(false);
      
      console.log('🔐 Mock auth successful');
      return true;
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    console.log('🔐 Signing out...');
    setIsLoading(true);
    
    try {
      localStorage.removeItem('outlaw_mock_user');
      
      // Try to call logout endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      await fetch('/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    } catch (error) {
      console.warn('🔐 Logout endpoint unavailable (continuing with local logout):', error instanceof Error ? error.message : String(error));
    } finally {
      setUser(null);
      setIsLoading(false);
      window.location.href = '/';
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-initialize on mount (non-blocking)
  useEffect(() => {
    // Use setTimeout to avoid blocking render
    const timer = setTimeout(() => {
      initialize();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initialize]);

  // Listen for auth events
  useEffect(() => {
    const handleAuthEvent = () => {
      console.log('🔐 Auth event received');
      initialize();
    };

    window.addEventListener('auth-success', handleAuthEvent);
    window.addEventListener('auth-refresh', handleAuthEvent);
    
    return () => {
      window.removeEventListener('auth-success', handleAuthEvent);
      window.removeEventListener('auth-refresh', handleAuthEvent);
    };
  }, [initialize]);

  return {
    user,
    isLoading,
    error,
    isInitialized,
    isAuthenticated: !!user,
    signIn,
    signOut,
    clearError,
    refresh: initialize
  };
}
