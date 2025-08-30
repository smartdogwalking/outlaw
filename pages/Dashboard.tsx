import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/react-app/components/AuthContext';
import { Brain, Plus, BookOpen, Target, Sparkles, TrendingUp, Clock, Award } from 'lucide-react';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import Button from '@/react-app/components/Button';
import SEOHead from '@/react-app/components/SEOHead';

interface ProfessorClone {
  id: number;
  professor_name?: string;
  course_name: string;
  created_at: string;
  school_name?: string;
}

interface UserProfile {
  law_school_id?: number;
  year_of_study?: number;
  total_study_sessions?: number;
  current_xp?: number;
  level?: number;
}

interface Subscription {
  subscription_type: string;
  is_active: boolean;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [clones, setClones] = useState<ProfessorClone[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data in background (non-blocking)
  useEffect(() => {
    // Only fetch data if user is authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch data in parallel with timeouts
        const [clonesRes, profileRes, subscriptionRes] = await Promise.allSettled([
          fetch('/api/professor-clones', {
            credentials: 'include',
            signal: AbortSignal.timeout(3000) // 3 second timeout
          }),
          fetch('/api/profile', {
            credentials: 'include', 
            signal: AbortSignal.timeout(3000)
          }),
          fetch('/api/subscription', {
            credentials: 'include',
            signal: AbortSignal.timeout(3000)
          })
        ]);

        // Handle clones
        if (clonesRes.status === 'fulfilled' && clonesRes.value.ok) {
          const clonesData = await clonesRes.value.json();
          setClones(Array.isArray(clonesData) ? clonesData : []);
        }

        // Handle profile
        if (profileRes.status === 'fulfilled' && profileRes.value.ok) {
          const profileData = await profileRes.value.json();
          setProfile(profileData);
        }

        // Handle subscription
        if (subscriptionRes.status === 'fulfilled' && subscriptionRes.value.ok) {
          const subscriptionData = await subscriptionRes.value.json();
          setSubscription(subscriptionData);
        }

      } catch (err) {
        console.warn('Dashboard data fetch failed:', err);
        setError('Some data may not be up to date');
      } finally {
        setIsLoading(false);
      }
    };

    // Delay the data fetch slightly to avoid blocking render
    const timer = setTimeout(loadDashboardData, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <SEOHead 
          title="Dashboard - OutLaw" 
          description="Your AI-powered law school study dashboard"
        />
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to OutLaw</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Sign in to access your AI-powered law school study dashboard
            </p>
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-300"
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Dashboard - OutLaw" 
        description="Your AI-powered law school study dashboard"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to OutLaw! 
              </h1>
              <p className="text-gray-600 mt-2">Ready to ace your law school studies?</p>
            </div>
            <div className="flex items-center gap-4">
              {subscription?.subscription_type === 'premium' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-medium rounded-full">
                  <Sparkles className="w-4 h-4" />
                  Premium
                </div>
              )}
              <Link to="/create-clone">
                <Button className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105">
                  <Plus className="w-4 h-4" />
                  Create Clone
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Professor Clones</p>
                <p className="text-2xl font-bold text-gray-900">{clones.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Study Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.total_study_sessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Level</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.level || 1}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">XP Points</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.current_xp || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/create-clone" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Professor Clone</h3>
              <p className="text-gray-600">Start by creating your first AI professor clone</p>
            </div>
          </Link>

          <Link to="/cold-call-help" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cold Call Emergency</h3>
              <p className="text-gray-600">Get instant help when called on in class</p>
            </div>
          </Link>

          <Link to="/upgrade" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600">Unlock unlimited clones and advanced features</p>
            </div>
          </Link>
        </div>

        {/* Professor Clones */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Professor Clones</h2>
            {isLoading && <LoadingSpinner size="sm" />}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}

          {clones.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Brain className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Professor Clones Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first professor clone to start getting personalized study materials and exam predictions.
              </p>
              <Link to="/create-clone">
                <Button className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-all duration-300">
                  <Plus className="w-4 h-4" />
                  Create Your First Clone
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clones.map((clone) => (
                <div key={clone.id} className="group relative">
                  <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {clone.course_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {clone.professor_name || 'Professor'}
                    </p>
                    {clone.school_name && (
                      <p className="text-xs text-gray-500 mb-4">{clone.school_name}</p>
                    )}
                    
                    <div className="flex gap-2">
                      <Link to={`/study/${clone.id}`} className="flex-1">
                        <Button 
                          variant="secondary"
                          size="sm"
                          className="w-full text-sm"
                        >
                          Study
                        </Button>
                      </Link>
                      <Link to={`/exam-prediction/${clone.id}`}>
                        <Button 
                          variant="secondary"
                          size="sm"
                          className="text-sm"
                        >
                          Exam Prediction
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
