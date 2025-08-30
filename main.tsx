import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/react-app/index.css";
import App from "@/react-app/App.tsx";

// Immediate render with no blocking operations
console.log('OutLaw starting...');

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  // Create and render immediately - no delays
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  console.log('OutLaw rendered successfully');

  // Background setup (non-blocking)
  setTimeout(() => {
    try {
      // Setup analytics and other features in background
      import("@/react-app/components/Analytics").then(({ setupAnalytics }) => {
        setupAnalytics();
      });
    } catch (e) {
      console.warn('Background setup failed:', e);
    }
  }, 1000);

} catch (error) {
  console.error('Critical error starting OutLaw:', error);
  
  // Emergency fallback
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div style="text-center; max-width: 500px; padding: 2rem;">
          <h1 style="font-size: 3rem; font-weight: 300; color: #111; margin-bottom: 1rem;">OutLaw</h1>
          <p style="color: #666; margin-bottom: 2rem;">AI-powered law school study companion</p>
          <button 
            onclick="window.location.reload()" 
            style="background: #000; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 2rem; font-size: 1rem; cursor: pointer;"
          >
            Refresh to try again
          </button>
        </div>
      </div>
    `;
  }
}
