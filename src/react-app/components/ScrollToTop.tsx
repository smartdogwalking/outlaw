import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { scrollToTop } from '@/react-app/utils/scrollToTop';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Execute immediately
    scrollToTop();
    
    // Execute after a small delay to handle async loading
    const timeoutId = setTimeout(scrollToTop, 50);
    
    // Execute after React has finished rendering (double RAF for safety)
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });

    // Execute after a longer delay to handle slower loading scenarios
    const longerTimeoutId = setTimeout(scrollToTop, 200);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(longerTimeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}
