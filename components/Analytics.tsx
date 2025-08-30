import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Google Analytics 4 tracking
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    if (typeof window.gtag !== 'undefined') {
      const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-OUTLAW2025AI';
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
}

// Google Analytics setup function
export function setupAnalytics() {
  // Only load in production
  if (import.meta.env.MODE !== 'production') {
    return;
  }

  // Use environment variable or fallback ID
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-OUTLAW2025AI';

  // Google Analytics 4
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_title: document.title,
      page_location: window.location.href
    });
  `;
  document.head.appendChild(script2);

  // Set up gtag function
  window.gtag = function(..._args: any[]) {
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push(arguments);
    }
  };
}

// Event tracking helpers
export function trackEvent(action: string, category: string = 'engagement', label?: string, value?: number) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}

export function trackSignup(method: string = 'google') {
  trackEvent('sign_up', 'authentication', method);
}

export function trackProfessorCloneCreated() {
  trackEvent('professor_clone_created', 'feature_usage');
}

export function trackExamPredictionViewed() {
  trackEvent('exam_prediction_viewed', 'feature_usage');
}

export function trackColdCallHelp() {
  trackEvent('cold_call_help', 'feature_usage');
}

export function trackUpgradeAttempt() {
  trackEvent('upgrade_attempt', 'conversion');
}

export function trackUpgradeSuccess() {
  trackEvent('purchase', 'conversion', 'premium_subscription', 9.99);
}
