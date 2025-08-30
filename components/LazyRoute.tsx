import { Suspense, ReactNode, ComponentType, lazy } from 'react';
import LoadingScreen from './LoadingScreen';
import ErrorBoundary from './ErrorBoundary';

interface LazyRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

export default function LazyRoute({ 
  children, 
  fallback = <LoadingScreen text="Loading page..." />,
  errorFallback
}: LazyRouteProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Helper function to create lazy routes with consistent loading states
export function createLazyRoute<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    fallback?: ReactNode;
    errorFallback?: ReactNode;
  }
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyRouteWrapper(props: React.ComponentProps<T>) {
    return (
      <LazyRoute 
        fallback={options?.fallback}
        errorFallback={options?.errorFallback}
      >
        <LazyComponent {...props} />
      </LazyRoute>
    );
  };
}

// Preload function for better UX
export function preloadRoute(importFn: () => Promise<any>) {
  // Preload the component
  importFn();
}
