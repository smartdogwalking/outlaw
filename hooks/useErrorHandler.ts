import { useState, useCallback } from 'react';

interface ErrorState {
  message: string;
  details?: any;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
      loadingMessage?: string;
    }
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as Error;
      const errorState: ErrorState = {
        message: error.message || 'An unexpected error occurred',
        details: error
      };
      
      setError(errorState);
      options?.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleApiError = useCallback((response: Response, fallbackMessage: string) => {
    if (response.status === 401) {
      setError({ message: 'Please sign in to continue' });
      // Redirect to home page
      window.location.href = '/';
    } else if (response.status === 403) {
      setError({ message: 'You do not have permission to access this resource' });
    } else if (response.status === 404) {
      setError({ message: 'The requested resource was not found' });
    } else if (response.status >= 500) {
      setError({ message: 'Server error. Please try again later.' });
    } else {
      setError({ message: fallbackMessage });
    }
  }, []);

  return {
    error,
    isLoading,
    clearError,
    handleAsync,
    handleApiError,
    setError
  };
}
