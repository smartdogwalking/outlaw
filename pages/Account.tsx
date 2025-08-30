import { useState, useEffect } from "react";
import { useAuth } from "@/react-app/components/AuthContext";
import { useNavigate } from "react-router";
import { 
  User, 
  GraduationCap, 
  Save,
  Mail,
  Calendar,
  MapPin,
  Edit3,
  ArrowLeft
} from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import LawSchoolSearch from "@/react-app/components/LawSchoolSearch";
import type { LawSchool } from "@/shared/types";

interface UserProfile {
  law_school_id: number | null;
  year_of_study: number | null;
  created_at: string;
}

export default function Account() {
  const { user, isLoading: isPending } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<LawSchool | null>(null);
  const [yearOfStudy, setYearOfStudy] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, isPending, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setYearOfStudy(profileData.year_of_study);
        
        if (profileData.law_school_id) {
          // Fetch the school details
          const schoolResponse = await fetch("/api/law-schools");
          if (schoolResponse.ok) {
            const schools = await schoolResponse.json();
            const school = schools.find((s: LawSchool) => s.id === profileData.law_school_id);
            if (school) {
              setSelectedSchool(school);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedSchool || !yearOfStudy) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          law_school_id: selectedSchool.id,
          year_of_study: yearOfStudy,
        }),
      });

      if (response.ok) {
        await fetchProfile();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
          <div className="text-xl font-medium text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <main className="relative z-10">
        {/* Header */}
        <section className="px-6 pt-8 pb-6 border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
                  <p className="text-gray-600 font-light">Manage your profile and preferences</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Content */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <GlassCard 
              className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
              opacity={0.05}
              blur="xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
                  <p className="text-gray-600 font-light">Your OutLaw account details</p>
                </div>
                
                {!isEditing && (
                  <Button 
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <span className="text-gray-900 font-light">{user?.email}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-light">
                      Managed through your Google account
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <span className="text-gray-900 font-light">
                        {user?.google_user_data.given_name} {user?.google_user_data.family_name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                      <span className="text-gray-900 font-light">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Recently joined'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      <MapPin className="w-4 h-4" />
                      Law School
                    </label>
                    {isEditing ? (
                      <LawSchoolSearch
                        selectedSchool={selectedSchool}
                        onSelect={(school) => setSelectedSchool(school as any)}
                        placeholder="Search for your law school..."
                      />
                    ) : (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                        <span className="text-gray-900 font-light">
                          {selectedSchool?.name || 'Not set'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      <GraduationCap className="w-4 h-4" />
                      Year of Study
                    </label>
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-3">
                        {[1, 2, 3].map((year) => (
                          <button
                            key={year}
                            onClick={() => setYearOfStudy(year)}
                            className={`p-4 rounded-2xl text-center font-medium transition-all duration-300 border-2 hover:scale-[1.02] active:scale-[0.98] ${
                              yearOfStudy === year
                                ? 'bg-black border-black text-white shadow-lg'
                                : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50 shadow-sm'
                            }`}
                          >
                            <div className="text-lg font-semibold mb-1">{year}L</div>
                            <div className="text-xs font-light opacity-80">
                              {year === 1 ? "First Year" : year === 2 ? "Second Year" : "Third Year"}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                        <span className="text-gray-900 font-light">
                          {yearOfStudy ? `${yearOfStudy}L - ${
                            yearOfStudy === 1 ? "First Year" : 
                            yearOfStudy === 2 ? "Second Year" : "Third Year"
                          }` : 'Not set'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-8 border-t border-gray-100 mt-8">
                  <Button
                    onClick={handleSave}
                    disabled={!selectedSchool || !yearOfStudy}
                    isLoading={isSaving}
                    className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02]"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </GlassCard>

            {/* Additional Settings */}
            <GlassCard 
              className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl mt-8"
              opacity={0.05}
              blur="xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Additional Settings</h3>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Account Security</h4>
                  <p className="text-sm text-gray-700 font-light leading-relaxed">
                    Your account is secured through Google authentication. To change your password or security settings, 
                    please visit your Google Account settings.
                  </p>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Data Privacy</h4>
                  <p className="text-sm text-gray-700 font-light leading-relaxed">
                    Your study materials and professor clones are private to your account. We never share your 
                    personal study data with other users or third parties.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
