import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const mode = searchParams.get('mode') || 'signin';

      // Handle OAuth errors
      if (error) {
        setStatus('error');
        setMessage(getErrorMessage(error));
        setTimeout(() => navigate('/'), 5000);
        return;
      }

      // Handle missing authorization code
      if (!code) {
        setStatus('error');
        setMessage('Authorization code not received. Please try signing in again.');
        setTimeout(() => navigate('/'), 5000);
        return;
      }

      // Exchange code for session
      const response = await fetch('/api/auth/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(mode === 'signup' ? 'Account created successfully!' : 'Welcome back!');
        
        // Refresh user data
        await refreshUser();
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Authentication failed');
      setTimeout(() => navigate('/'), 5000);
    }
  };

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'access_denied':
        return 'Authentication was cancelled. You can try again anytime.';
      case 'invalid_request':
        return 'Invalid authentication request. Please try again.';
      case 'server_error':
        return 'Server error occurred. Please try again later.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        {/* Status Icon */}
        <div className="mb-6">
          {status === 'processing' && (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        {/* Status Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'processing' && 'Completing Sign In...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Progress or Action */}
        {status === 'processing' && (
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-gray-500">
              Setting up your account...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full transition-all duration-2000" style={{ width: '100%' }}></div>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Return to Home
            </button>
            <p className="text-sm text-gray-500">
              Redirecting automatically in a few seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}