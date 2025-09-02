import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

interface SmoothTransitionProps {
  children: ReactNode;
  duration?: number;
  className?: string;
}

export default function SmoothTransition({ 
  children, 
  duration = 300,
  className = ''
}: SmoothTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = () => {
    if (transitionStage === 'fadeOut') {
      setDisplayLocation(location);
      setTransitionStage('fadeIn');
    }
  };

  return (
    <div
      className={`${className} transition-opacity ease-in-out ${
        transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${duration}ms` }}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
}

// Hook for programmatic page transitions
export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const startTransition = (callback: () => void, duration = 300) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      callback();
      setTimeout(() => {
        setIsTransitioning(false);
      }, duration);
    }, duration);
  };

  return {
    isTransitioning,
    startTransition
  };
}

// Page fade transition component
export function PageFadeTransition({ 
  children,
  isVisible = true,
  duration = 300
}: {
  children: ReactNode;
  isVisible?: boolean;
  duration?: number;
}) {
  return (
    <div
      className={`transition-all ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// Stagger animation for lists
export function StaggeredList({ 
  children, 
  staggerDelay = 100,
  className = ''
}: {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}) {
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems(prev => {
        if (prev < children.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, staggerDelay);

    return () => clearInterval(timer);
  }, [children.length, staggerDelay]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-500 ease-out ${
            index < visibleItems
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
