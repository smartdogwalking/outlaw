import { Brain, Sparkles } from "lucide-react";

interface LoadingScreenProps {
  text?: string;
  subtext?: string;
}

export default function LoadingScreen({ 
  text = "Loading...", 
  subtext 
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Animated background circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full animate-pulse opacity-60"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full animate-pulse opacity-40 animation-delay-300"></div>
          </div>
          
          {/* Main icon */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          
          {/* Floating sparkles */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-4 h-4 text-violet-400 animate-bounce" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles className="w-3 h-3 text-blue-400 animate-bounce animation-delay-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{text}</h2>
        {subtext && (
          <p className="text-gray-600 font-light">{subtext}</p>
        )}
        
        {/* Loading dots */}
        <div className="flex justify-center items-center mt-6 space-x-1">
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}
