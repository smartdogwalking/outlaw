import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Button from "./Button";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showRetry?: boolean;
  showGoHome?: boolean;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message = "We're having trouble loading this page. Please try again.",
  onRetry,
  onGoHome,
  showRetry = true,
  showGoHome = true
}: ErrorMessageProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 font-light leading-relaxed mb-8">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              className="group px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {showGoHome && (
            <Button
              onClick={onGoHome || (() => window.location.href = '/')}
              variant="secondary"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-medium transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
