import { useState, useEffect } from "react";
import { useAuth } from "@/react-app/components/AuthContext";
import { useNavigate } from "react-router";
import { Brain, ChevronLeft, FileText, BookOpen, Presentation, HelpCircle, AlertTriangle, ArrowRight } from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import PremiumLock from "@/react-app/components/PremiumLock";
import type { ProfessorQuestionnaireResponse } from "@/shared/types";

export default function CreateClone() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  
  // File uploads
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [lectureNotesFile, setLectureNotesFile] = useState<File | null>(null);
  const [additionalMaterialsFile, setAdditionalMaterialsFile] = useState<File | null>(null);
  const [practiceQuestionsFile] = useState<File | null>(null);
  const [pastExamsFile, setPastExamsFile] = useState<File | null>(null);
  
  // Loading states for file uploads
  const [uploadingFiles, setUploadingFiles] = useState({
    syllabus: false,
    lectureNotes: false,
    additionalMaterials: false,
    pastExams: false
  });
  
  // Basic form data
  const [formData, setFormData] = useState({
    professor_name: "",
    course_name: "",
    department: "",
    specialties: ""
  });

  // Enhanced questionnaire data focused on professor recreation
  const [questionnaireData, setQuestionnaireData] = useState<Partial<ProfessorQuestionnaireResponse>>({
    humor_level: 3,
    strictness_level: 3,
    legal_interpretation_style: "",
    exam_format_preference: "",
    theoretical_vs_practical: 3,
    practical_application_focus: 3,
    case_analysis_emphasis: 3,
    technology_usage: "",
    professor_formality_level: 3,
    professor_age_range: "",
    professor_gender: "",
    professor_tenure_at_school: "",
    professor_dress_style: "",
    professor_uses_profanity: "",
    professor_personality_type: "",
    professor_teaching_energy: 3,
    professor_quirks_and_hints: ""
  });
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAccuracyPopup, setShowAccuracyPopup] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [existingClones, setExistingClones] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
      return;
    }

    if (user) {
      checkUserSetup();
    }
  }, [user, isLoading, navigate]);

  const checkUserSetup = async () => {
    try {
      const [profileRes, subscriptionRes, clonesRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/subscription"),
        fetch("/api/professor-clones")
      ]);

      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (!profile.law_school_id) {
          // Redirect to onboarding if not set up
          navigate("/onboarding");
          return;
        }
      } else if (profileRes.status === 401) {
        navigate("/");
        return;
      }

      if (subscriptionRes.ok) {
        const subscriptionData = await subscriptionRes.json();
        setSubscription(subscriptionData);
      }

      if (clonesRes.ok) {
        const clonesData = await clonesRes.json();
        setExistingClones(Array.isArray(clonesData) ? clonesData : []);
      } else {
        setExistingClones([]);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setExistingClones([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateQuestionnaireData = (field: keyof ProfessorQuestionnaireResponse, value: any) => {
    setQuestionnaireData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File, setter: (file: File | null) => void, uploadKey: string) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, Word document, or text file.');
      return;
    }

    // Set loading state
    setUploadingFiles(prev => ({ ...prev, [uploadKey]: true }));
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setter(file);
    
    // Clear loading state
    setUploadingFiles(prev => ({ ...prev, [uploadKey]: false }));
  };

  const processFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.readAsText(file);
    });
  };

  const handleCreateClone = async () => {

    // Validate required basic fields and files
    if (!formData.professor_name || !formData.course_name || !syllabusFile || !lectureNotesFile) {
      alert('Please fill in all required fields and upload required files.');
      return;
    }

    // Validate all mandatory questionnaire fields
    const requiredFields = [
      'legal_interpretation_style',
      'exam_format_preference', 
      'technology_usage'
    ];

    for (const field of requiredFields) {
      const value = questionnaireData[field as keyof ProfessorQuestionnaireResponse];
      if (!value || value === "") {
        alert(`Please complete all required questionnaire fields before proceeding. Missing: ${field}`);
        return;
      }
    }

    setIsSaving(true);
    try {
      // Process file contents
      const syllabusContent = await processFileContent(syllabusFile);
      const lectureNotesContent = await processFileContent(lectureNotesFile);
      const additionalMaterialsContent = additionalMaterialsFile ? await processFileContent(additionalMaterialsFile) : "";
      const practiceQuestionsContent = practiceQuestionsFile ? await processFileContent(practiceQuestionsFile) : "";
      const pastExamsContent = pastExamsFile ? await processFileContent(pastExamsFile) : "";

      // Get user profile to get law school
      const profileResponse = await fetch("/api/profile");
      const profile = await profileResponse.json();
      
      // Create new professor
      const profResponse = await fetch("/api/professors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.professor_name,
          law_school_id: profile.law_school_id,
          department: formData.department,
          specialties: formData.specialties
        }),
      });

      let professorId;
      if (profResponse.ok) {
        const newProf = await profResponse.json();
        professorId = newProf.id;
      } else {
        const errorText = await profResponse.text();
        throw new Error(`Failed to create professor: ${errorText}`);
      }

      // Create the clone with questionnaire data
      const cloneResponse = await fetch("/api/professor-clones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professor_id: professorId,
          professor_name: formData.professor_name,
          course_name: formData.course_name,
          syllabus_content: syllabusContent,
          lecture_notes: lectureNotesContent,
          additional_materials: additionalMaterialsContent,
          practice_questions: practiceQuestionsContent,
          past_exams: pastExamsContent,
          questionnaire_data: questionnaireData
        }),
      });

      if (cloneResponse.ok) {
        await cloneResponse.json();
        navigate("/dashboard");
      } else {
        const errorText = await cloneResponse.text();
        throw new Error(`Failed to create clone: ${errorText}`);
      }
    } catch (error) {
      const err = error as Error;
      alert(`Failed to create professor clone: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Loading Create Clone</h2>
          <p className="text-gray-600">Setting up the creation wizard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <main className="relative z-10">
        {/* Check if user has clones and isn't premium */}
        {existingClones.length > 0 && subscription?.subscription_type !== 'premium' ? (
          <section className="px-6 py-32">
            <div className="max-w-4xl mx-auto">
              <PremiumLock
                feature="multiple_clones"
                title="Create More Professor Clones"
                description="You've reached the limit for free accounts. Upgrade to Premium to create unlimited professor clones for all your courses."
                showPreview={false}
              >
                <div />
              </PremiumLock>
            </div>
          </section>
        ) : (
          <>
            {/* Progress Indicator */}
        <section className="px-6 pt-8 pb-6 border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      i === step 
                        ? 'bg-black text-white shadow-lg' 
                        : i < step 
                          ? 'bg-gray-200 text-gray-600' 
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {i}
                    </div>
                    {i < 3 && (
                      <div className={`w-12 h-px mx-2 transition-all duration-300 ${
                        i < step ? 'bg-gray-300' : 'bg-gray-100'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-gray-500">
                Step {step} of 3
              </div>
            </div>
          </div>
        </section>

        {/* Step 1: Basic Information & File Uploads */}
        {step === 1 && (
          <section className="px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-thin tracking-tight leading-tight mb-6">
                  <span className="block text-gray-900">Create your</span>
                  <span className="block text-gray-900">exam predictor.</span>
                </h1>
                <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Upload course materials to predict exactly what will be on your exam
                </p>
              </div>

              <GlassCard 
                className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                opacity={0.05}
                blur="xl"
              >
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-700">Professor Name *</label>
                      <input
                        type="text"
                        value={formData.professor_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, professor_name: e.target.value }))}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                        placeholder="Enter professor's name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-700">Course Name *</label>
                      <input
                        type="text"
                        value={formData.course_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, course_name: e.target.value }))}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Constitutional Law, Contracts"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-700">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Constitutional Law"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-700">Specialties</label>
                      <input
                        type="text"
                        value={formData.specialties}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Civil Rights, Federal Courts"
                      />
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Materials</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Syllabus Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-3 text-gray-700">
                          Course Syllabus *
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], setSyllabusFile, 'syllabus')}
                            className="hidden"
                            id="syllabus-upload"
                            disabled={uploadingFiles.syllabus}
                          />
                          <label
                            htmlFor="syllabus-upload"
                            className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all duration-200 group"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                              {uploadingFiles.syllabus ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <FileText className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {uploadingFiles.syllabus ? 'Processing...' : syllabusFile ? syllabusFile.name : 'Upload syllabus'}
                              </div>
                              <div className="text-sm text-gray-500">PDF, Word, or text file</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Lecture Notes Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-3 text-gray-700">
                          Lecture Notes *
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], setLectureNotesFile, 'lectureNotes')}
                            className="hidden"
                            id="lecture-notes-upload"
                            disabled={uploadingFiles.lectureNotes}
                          />
                          <label
                            htmlFor="lecture-notes-upload"
                            className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all duration-200 group"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                              {uploadingFiles.lectureNotes ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <BookOpen className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {uploadingFiles.lectureNotes ? 'Processing...' : lectureNotesFile ? lectureNotesFile.name : 'Upload lecture notes'}
                              </div>
                              <div className="text-sm text-gray-500">PDF, Word, or text file</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Additional Materials Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-3 text-gray-700">
                          Additional Materials
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], setAdditionalMaterialsFile, 'additionalMaterials')}
                            className="hidden"
                            id="additional-materials-upload"
                            disabled={uploadingFiles.additionalMaterials}
                          />
                          <label
                            htmlFor="additional-materials-upload"
                            className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all duration-200 group"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                              {uploadingFiles.additionalMaterials ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <Presentation className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {uploadingFiles.additionalMaterials ? 'Processing...' : additionalMaterialsFile ? additionalMaterialsFile.name : 'Upload slides, handouts'}
                              </div>
                              <div className="text-sm text-gray-500">Optional materials</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Past Exams Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-3 text-gray-700">
                          Past Professor Exams
                        </label>
                        <div className="p-3 mb-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200/50">
                          <p className="text-sm text-amber-800">
                            <strong>🎯 Highly Recommended:</strong> Past exams improve prediction accuracy by 60%+
                          </p>
                        </div>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], setPastExamsFile, 'pastExams')}
                            className="hidden"
                            id="past-exams-upload"
                            disabled={uploadingFiles.pastExams}
                          />
                          <label
                            htmlFor="past-exams-upload"
                            className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all duration-200 group"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                              {uploadingFiles.pastExams ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                <HelpCircle className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {uploadingFiles.pastExams ? 'Processing...' : pastExamsFile ? pastExamsFile.name : 'Upload past exams'}
                              </div>
                              <div className="text-sm text-gray-500">From exam banks or previous students</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button
                      onClick={() => setShowAccuracyPopup(true)}
                      disabled={!formData.professor_name || !formData.course_name || !syllabusFile || !lectureNotesFile}
                      className="group w-full py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg"
                    >
                      <span>Continue to professor psychology</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>
        )}

        {/* Step 2: Professor Psychology */}
        {step === 2 && (
          <section className="px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-thin tracking-tight leading-tight mb-6">
                  <span className="block text-gray-900">Professor</span>
                  <span className="block text-gray-900">psychology.</span>
                </h1>
                <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Essential questions to predict your professor's exam style and preferences
                </p>
                <p className="text-sm text-red-600 font-medium mt-4">All fields are required for accurate exam predictions</p>
              </div>

              <GlassCard 
                className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                opacity={0.05}
                blur="xl"
              >
                <div className="space-y-8">
                  {/* Humor Level */}
                  <div>
                    <label className="block text-lg font-medium mb-4 text-gray-900">How humorous is this professor in class?</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={questionnaireData.humor_level || 3}
                      onChange={(e) => updateQuestionnaireData('humor_level', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Very Serious</span>
                      <span>Balanced</span>
                      <span>Very Humorous</span>
                    </div>
                  </div>

                  {/* Strictness Level */}
                  <div>
                    <label className="block text-lg font-medium mb-4 text-gray-900">How strict is this professor?</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={questionnaireData.strictness_level || 3}
                      onChange={(e) => updateQuestionnaireData('strictness_level', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Very Lenient</span>
                      <span>Balanced</span>
                      <span>Very Strict</span>
                    </div>
                  </div>

                  {/* Legal Philosophy */}
                  <div>
                    <label className="block text-lg font-medium mb-4 text-gray-900">Legal Philosophy Approach *</label>
                    <select
                      value={questionnaireData.legal_interpretation_style || ""}
                      onChange={(e) => updateQuestionnaireData('legal_interpretation_style', e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select teaching approach (required)</option>
                      <option value="strict_textual">Focuses on exact text and original meaning</option>
                      <option value="evolving_interpretation">Believes law should adapt to modern society</option>
                      <option value="policy_focused">Emphasizes practical outcomes and policy implications</option>
                      <option value="case_law_heavy">Relies heavily on precedent and case analysis</option>
                      <option value="balanced_approach">Uses multiple approaches depending on the issue</option>
                      <option value="student_driven">Encourages students to form their own interpretations</option>
                    </select>
                  </div>

                  {/* Exam Format */}
                  <div>
                    <label className="block text-lg font-medium mb-4 text-gray-900">Primary Exam Format *</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: "closed_book_essays", label: "Closed Book Essays" },
                        { value: "open_book_essays", label: "Open Book Essays" },
                        { value: "take_home_exam", label: "Take Home Exam" },
                        { value: "mixed_format", label: "Mixed Format" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateQuestionnaireData('exam_format_preference', option.value)}
                          className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left font-medium ${
                            questionnaireData.exam_format_preference === option.value
                              ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                              : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Technology Usage */}
                  <div>
                    <label className="block text-lg font-medium mb-4 text-gray-900">Technology Usage in Class *</label>
                    <select
                      value={questionnaireData.technology_usage || ""}
                      onChange={(e) => updateQuestionnaireData('technology_usage', e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select technology usage level (required)</option>
                      <option value="minimal">Minimal - Traditional teaching methods</option>
                      <option value="moderate">Moderate - Some PowerPoint, online resources</option>
                      <option value="extensive">Extensive - Interactive tools, frequent tech integration</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full border-0 font-medium transition-all duration-300"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      <span>Back</span>
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="group flex-1 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      <span>Final step</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>
        )}

        {/* Step 3: Professor Quirks */}
        {step === 3 && (
          <section className="px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-thin tracking-tight leading-tight mb-6">
                  <span className="block text-gray-900">Exam prediction</span>
                  <span className="block text-gray-900">intelligence.</span>
                </h1>
                <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Capture key details to predict your professor's exact exam patterns and preferences
                </p>
              </div>

              <GlassCard 
                className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                opacity={0.05}
                blur="xl"
              >
                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-medium mb-4 text-gray-900">
                      Professor's Quirks, Hints & Key Information
                    </label>
                    <div className="mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                      <p className="text-sm text-blue-800 mb-3 font-medium">Please include any of the following:</p>
                      <ul className="text-sm text-blue-700 space-y-2">
                        <li>• Key words or phrases the professor uses frequently in class</li>
                        <li>• Favorite cases or examples the professor loves to discuss</li>
                        <li>• Random things the professor talks about (hobbies, interests, stories)</li>
                        <li>• Exam hints - anything the professor says like "this would look good on the final"</li>
                        <li>• Teaching patterns or preferences you've noticed</li>
                        <li>• Grading preferences or what the professor emphasizes</li>
                      </ul>
                    </div>
                    <textarea
                      value={questionnaireData.professor_quirks_and_hints || ""}
                      onChange={(e) => updateQuestionnaireData('professor_quirks_and_hints', e.target.value)}
                      className="w-full p-6 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 h-48 resize-none"
                      placeholder="Example: Professor Smith always says 'Remember this for the exam!' when discussing constitutional interpretation. She loves citing Marbury v. Madison and frequently mentions her dog Max during class. She emphasizes IRAC format and always says students should 'think like a lawyer, not a law student.' She gives hints like 'I'd love to see this issue on your final exam.'"
                    />
                    <p className="text-sm text-gray-500 mt-3">
                      The more specific details you provide, the better your AI professor clone will be at mimicking their actual teaching style and creating realistic study materials.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full border-0 font-medium transition-all duration-300"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      <span>Back</span>
                    </Button>
                    <Button
                      onClick={handleCreateClone}
                      isLoading={isSaving}
                      className="group flex-1 py-4 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg"
                    >
                      <span>Create AI exam predictor</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>
        )}
          </>
        )}
      </main>

      {/* Accuracy Information Popup */}
      {showAccuracyPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <GlassCard className="p-8 max-w-lg mx-4" opacity={0.4} blur="xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Maximize Your Exam Prediction Accuracy
              </h3>
              
              <div className="text-left mb-8 space-y-4">
                <p className="text-gray-700">
                  <strong className="text-violet-600">Important:</strong> The accuracy of your AI exam predictor depends entirely on the information you provide in the next steps.
                </p>
                
                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-4 rounded-2xl border border-violet-200">
                  <p className="text-sm text-gray-700 mb-2 font-medium">For the best results:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Answer every question as accurately as possible</li>
                    <li>• Think carefully about your professor's teaching style</li>
                    <li>• Include specific details and examples when prompted</li>
                    <li>• The more precise your responses, the better your predictions</li>
                  </ul>
                </div>
                
                <p className="text-sm text-gray-600 italic">
                  Students who provide detailed, accurate information see 40% better exam prediction accuracy compared to those who rush through the questionnaire.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowAccuracyPopup(false)}
                  className="flex-1 py-3 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full border-0 font-medium"
                >
                  I'll be quick
                </Button>
                <Button
                  onClick={() => {
                    setShowAccuracyPopup(false);
                    setStep(2);
                  }}
                  className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium"
                >
                  I'll be thorough
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      <Footer />
    </div>
  );
}
