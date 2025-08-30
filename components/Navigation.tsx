import { useState } from "react";
import { Link } from "react-router";
import { Brain, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/react-app/components/AuthContext";
import NewAuthModal from "@/react-app/components/NewAuthModal";

export default function Navigation() {
  const { isAuthenticated, signOut, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">OutLaw</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Features
              </Link>
              <Link to="/demo" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Demo
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                About
              </Link>
              <Link to="/faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                FAQ
              </Link>
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Show loading state or normal buttons */}
                  {isLoading ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">Loading...</div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAuthClick('signin')}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-300"
                      >
                        Sign In
                      </button>
                      
                      <button
                        onClick={() => handleAuthClick('signup')}
                        className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200/50">
              <div className="flex flex-col gap-4">
                <Link 
                  to="/features" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/demo" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Demo
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/faq" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                
                <div className="pt-4 border-t border-gray-200/50">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <Link 
                        to="/dashboard"
                        className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="text-left text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          handleAuthClick('signin');
                          setIsMenuOpen(false);
                        }}
                        className="text-left text-gray-700 hover:text-gray-900 font-medium transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          handleAuthClick('signup');
                          setIsMenuOpen(false);
                        }}
                        className="text-left px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-300 w-fit"
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <NewAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
}
