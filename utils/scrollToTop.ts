/**
 * Smooth scroll to top utility function
 */
export function scrollToTop(): void {
  if (typeof window !== 'undefined') {
    // Use multiple methods to ensure scroll works in all browsers
    try {
      // Method 1: Modern smooth scroll
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto' // Use 'auto' for instant scroll on route changes
      });
      
      // Method 2: Fallback for older browsers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 3: Additional fallback
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
      }
    } catch (error) {
      // Silent fallback - just scroll without animation
      try {
        window.scrollTo(0, 0);
      } catch (fallbackError) {
        // Last resort
        document.documentElement.scrollTop = 0;
      }
    }
  }
}

/**
 * Smooth scroll to a specific element
 */
export function scrollToElement(elementId: string, offset = 0): void {
  if (typeof window !== 'undefined') {
    const element = document.getElementById(elementId);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  }
}

/**
 * Check if element is in viewport
 */
export function isElementInViewport(element: HTMLElement): boolean {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
