import { Brain } from "lucide-react";

interface AppLoaderProps {
  text?: string;
  showLogo?: boolean;
}

export default function AppLoader({ 
  text = "Loading OutLaw...", 
  showLogo = true
}: AppLoaderProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {showLogo && (
          <div className="mb-8">
            <div className="w-20 h-20 bg-black rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">OutLaw</h1>
          </div>
        )}
        
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
          <span className="text-sm text-gray-600 font-medium">{text}</span>
        </div>
      </div>
    </div>
  );
}

// Smooth page transition loader
export function PageTransitionLoader({ text = "Loading page..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
        <span className="text-sm text-gray-600 font-medium">{text}</span>
      </div>
    </div>
  );
}

// Inline content loader for smoother transitions
export function ContentLoader({ 
  text = "Loading...",
  size = "md" 
}: { 
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin`}></div>
      <span className="text-sm text-gray-600 font-medium">{text}</span>
    </div>
  );
}
