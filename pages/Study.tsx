import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/react-app/components/AuthContext";
import { useNavigate, useParams, Link } from "react-router";
import { 
  ArrowLeft, 
  Brain, 
  Send, 
  BookOpen,
  Save,
  FileText,
  MessageCircle,
  Loader2,
  Target,
  HelpCircle,
  Lightbulb,
  Archive
} from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Footer from "@/react-app/components/Footer";
import ColdCallHelper from "@/react-app/components/ColdCallHelper";

import type { ProfessorClone } from "@/shared/types";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  canSave?: boolean;
}

interface SavedMaterial {
  id: number;
  title: string;
  content: string;
  material_type: string;
  topic: string;
  created_at: string;
}

export default function Study() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { cloneId } = useParams();
  
  const [clone, setClone] = useState<ProfessorClone | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  
  const [savedMaterials, setSavedMaterials] = useState<SavedMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [messageCount, setMessageCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }

    if (user && cloneId) {
      fetchCloneData();
    }
  }, [user, authLoading, navigate, cloneId]);

  const fetchCloneData = async () => {
    if (!cloneId) return;

    try {
      const [clonesRes, savedRes, subscriptionRes] = await Promise.all([
        fetch("/api/professor-clones"),
        fetch(`/api/saved-materials/${cloneId}`),
        fetch("/api/subscription")
      ]);

      if (clonesRes.ok) {
        const clonesData = await clonesRes.json();
        const cloneList = Array.isArray(clonesData) ? clonesData : [];
        const currentClone = cloneList.find((c: ProfessorClone) => c.id === parseInt(cloneId));
        setClone(currentClone || null);
        
        if (currentClone) {
          // Initialize with welcome message
          const welcomeMessage: ChatMessage = {
            id: '1',
            content: `Hello! I'm Professor ${currentClone.professor_name}. I'm here to help you prepare for ${currentClone.course_name}. Ask me anything about the course material, and I'll respond in my teaching style. What would you like to discuss today?`,
            isUser: false,
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        }
      } else if (clonesRes.status === 401) {
        navigate("/");
        return;
      } else {
        console.error("Failed to fetch clones:", clonesRes.status);
      }

      if (savedRes.ok) {
        const savedData = await savedRes.json();
        setSavedMaterials(Array.isArray(savedData) ? savedData : []);
      } else {
        setSavedMaterials([]);
      }

      if (subscriptionRes.ok) {
        const subscriptionData = await subscriptionRes.json();
        setSubscription(subscriptionData);
      } else {
        console.error("Failed to fetch subscription:", subscriptionRes.status);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setSavedMaterials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message?: string) => {
    const messageToSend = message || inputValue.trim();
    if (!messageToSend || isSending || !cloneId) return;

    // Check message limits for free users
    if (subscription?.subscription_type !== 'premium' && messageCount >= 20) {
      // Show premium lock instead of sending message
      const premiumLockElement = document.createElement('div');
      premiumLockElement.innerHTML = `
        <div style="position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);">
          <div style="background: white; border-radius: 1rem; padding: 2rem; max-width: 400px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
            <div style="margin-bottom: 1rem; font-size: 1.5rem;">🔒</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Daily Message Limit Reached</h3>
            <p style="color: #666; margin-bottom: 1.5rem;">Upgrade to Premium for unlimited professor chat messages.</p>
            <button onclick="window.location.href='/upgrade?feature=advanced_chat&return=' + encodeURIComponent(window.location.pathname)" style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; border: none; border-radius: 9999px; padding: 0.75rem 2rem; font-weight: 500; cursor: pointer; transition: all 0.3s;">Upgrade to Premium</button>
            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="margin-left: 1rem; background: #f3f4f6; color: #374151; border: none; border-radius: 9999px; padding: 0.75rem 1rem; font-weight: 500; cursor: pointer;">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(premiumLockElement);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);
    setMessageCount(prev => prev + 1);

    try {
      const response = await fetch('/api/professor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clone_id: parseInt(cloneId),
          message: messageToSend 
        })
      });

      if (response.ok) {
        const data = await response.json();
        const professorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date(),
          canSave: true
        };
        setMessages(prev => [...prev, professorMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const saveMessage = async (message: ChatMessage) => {
    if (!cloneId) return;

    try {
      const response = await fetch('/api/save-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professor_clone_id: parseInt(cloneId),
          content: message.content,
          title: `Saved from chat - ${new Date().toLocaleDateString()}`,
          material_type: 'chat_response'
        })
      });

      if (response.ok) {
        await fetchCloneData(); // Refresh saved materials
        alert('Material saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save material:', error);
      alert('Failed to save material. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateCourseSpecificQuestions = (courseName: string): string[] => {
    const lowerCourseName = courseName.toLowerCase();
    
    // Skip if course name is too short or looks like placeholder text
    if (!courseName || courseName.length < 3 || courseName.match(/^(test|asd|abc|xyz|demo)$/i)) {
      return [
        'What should I focus on most for my exam?',
        'Can you give me practice questions?',
        'What are the most common mistakes students make on exams?',
        'How should I structure my exam answers?',
        'What cases are most important to memorize?',
        'Give me hypotheticals to practice with'
      ];
    }
    
    if (lowerCourseName.includes('contract')) {
      return [
        'What should I focus on when studying offer and acceptance?',
        'Can you explain the key elements of consideration?',
        'What are the most common exam mistakes with statute of frauds?',
        'How do I approach breach of contract fact patterns?',
        'What cases should I know for contract defenses?',
        'Give me practice questions about parol evidence rule'
      ];
    } else if (lowerCourseName.includes('tort')) {
      return [
        'What should I focus on when studying negligence elements?',
        'Can you explain the key elements of intentional torts?',
        'What are the most common exam mistakes with strict liability?',
        'How do I approach products liability fact patterns?',
        'What cases should I know for defamation?',
        'Give me practice questions about causation in torts'
      ];
    } else if (lowerCourseName.includes('constitutional')) {
      return [
        'What should I focus on when studying Commerce Clause?',
        'Can you explain the key elements of equal protection analysis?',
        'What are the most common exam mistakes with due process?',
        'How do I approach First Amendment fact patterns?',
        'What cases should I know for judicial review?',
        'Give me practice questions about separation of powers'
      ];
    } else if (lowerCourseName.includes('criminal')) {
      return [
        'What should I focus on when studying mens rea?',
        'Can you explain the key elements of homicide crimes?',
        'What are the most common exam mistakes with criminal defenses?',
        'How do I approach search and seizure fact patterns?',
        'What cases should I know for Fourth Amendment violations?',
        'Give me practice questions about actus reus'
      ];
    } else if (lowerCourseName.includes('property')) {
      return [
        'What should I focus on when studying adverse possession?',
        'Can you explain the key elements of estates and future interests?',
        'What are the most common exam mistakes with easements?',
        'How do I approach landlord tenant fact patterns?',
        'What cases should I know for real property transactions?',
        'Give me practice questions about recording acts'
      ];
    } else if (lowerCourseName.includes('civil procedure') || lowerCourseName.includes('civ pro')) {
      return [
        'What should I focus on when studying personal jurisdiction?',
        'Can you explain the key elements of subject matter jurisdiction?',
        'What are the most common exam mistakes with discovery?',
        'How do I approach summary judgment fact patterns?',
        'What cases should I know for pleading standards?',
        'Give me practice questions about Erie doctrine'
      ];
    } else if (lowerCourseName.includes('evidence')) {
      return [
        'What should I focus on when studying hearsay exceptions?',
        'Can you explain the key elements of relevance?',
        'What are the most common exam mistakes with character evidence?',
        'How do I approach expert testimony fact patterns?',
        'What cases should I know for privilege rules?',
        'Give me practice questions about authentication'
      ];
    } else {
      // Generic law questions as fallback
      return [
        `What should I focus on most for ${courseName} exams?`,
        `Can you give me practice questions for ${courseName}?`,
        `What are the most common mistakes students make in ${courseName}?`,
        `How should I structure my ${courseName} exam answers?`,
        `What cases are most important to memorize for ${courseName}?`,
        `Give me hypotheticals to practice for ${courseName}`
      ];
    }
  };

  const popularQuestions = clone?.course_name ? generateCourseSpecificQuestions(clone.course_name) : [];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Loading Study Session</h2>
          <p className="text-gray-600">Preparing your AI professor...</p>
        </div>
      </div>
    );
  }

  if (!clone) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Professor Clone Not Found</h2>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{clone.professor_name}</h1>
                <p className="text-gray-600 text-sm font-light">{clone.course_name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to={`/exam-prediction/${cloneId}`}>
              <Button 
                variant="secondary"
                className="group px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 hover:scale-105"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span>Exam prediction</span>
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => setShowSaved(!showSaved)}
              className="px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full border-0 font-medium transition-all duration-300"
            >
              <Archive className="w-4 h-4 mr-2" />
              <span>Saved ({savedMaterials.length})</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <GlassCard 
              className="h-[600px] flex flex-col backdrop-blur-3xl border-gray-200/30 shadow-xl"
              opacity={0.05}
              blur="xl"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Chat with Professor {clone.professor_name}</h3>
                    <p className="text-sm text-gray-600 font-light">Ask for hypotheticals, explanations, or practice questions</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-4xl">
                      <div
                        className={`p-4 rounded-2xl transition-all duration-200 ${
                          message.isUser
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-900 border border-gray-200'
                        }`}
                      >
                        <div 
                          className="text-sm leading-relaxed whitespace-pre-wrap font-light" 
                          dangerouslySetInnerHTML={{ 
                            __html: message.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/\n/g, '<br>')
                          }}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div className={`text-xs font-light ${message.isUser ? 'text-gray-300' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {message.canSave && !message.isUser && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveMessage(message)}
                              className="text-xs px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 border border-gray-200 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                        <span className="text-sm text-gray-600 font-light">Professor {clone.professor_name} is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask Professor ${clone.professor_name} anything about ${clone.course_name}...`}
                    className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                    disabled={isSending}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!inputValue.trim() || isSending}
                    className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-2xl border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Questions */}
            <GlassCard 
              className="p-6 backdrop-blur-3xl border-gray-200/30"
              opacity={0.05}
              blur="lg"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Popular Questions
              </h3>
              
              <div className="space-y-3">
                {popularQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="w-full p-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-600 transition-colors">
                        <HelpCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-relaxed">
                        {question}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Cold Call Emergency Helper */}
            <ColdCallHelper
              onSendMessage={sendMessage}
            />

            {/* Case Analysis */}
            <GlassCard 
              className="p-6 backdrop-blur-3xl border-gray-200/30 shadow-lg"
              opacity={0.05}
              blur="xl"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Case Analysis
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => sendMessage("Help me understand [case name]. Break down this case like you would in class - what are the key facts, holding, reasoning, and why do you think this case matters? What questions might you ask about it?")}
                  className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block mb-1">
                        Case Breakdown
                      </span>
                      <span className="text-xs text-gray-600 font-light">
                        Master any case with professor-level analysis
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </GlassCard>

            {/* Study Actions */}
            <GlassCard 
              className="p-6 backdrop-blur-3xl border-gray-200/30"
              opacity={0.05}
              blur="lg"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                <Lightbulb className="w-5 h-5 text-purple-500" />
                Study Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => sendMessage("Give me a practice quiz question that matches your exam style")}
                  className="w-full p-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                      <HelpCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Practice Quiz
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => sendMessage("Explain a complex topic in simple terms using your teaching style")}
                  className="w-full p-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                      <Lightbulb className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Explain Concept
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => sendMessage("What are the most common mistakes students make on your exams and how can I avoid them?")}
                  className="w-full p-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                      <Target className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Avoid Mistakes
                    </span>
                  </div>
                </button>
              </div>
            </GlassCard>

            {/* Saved Materials */}
            {showSaved && (
              <GlassCard 
                className="p-6 backdrop-blur-3xl border-gray-200/30"
                opacity={0.05}
                blur="lg"
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  Saved Materials ({savedMaterials.length})
                </h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {savedMaterials.length > 0 ? (
                    savedMaterials.map((material) => (
                      <div key={material.id} className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {material.title}
                        </div>
                        <div className="text-xs text-gray-600 mb-2 font-light">
                          {new Date(material.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-700 line-clamp-3 font-light">
                          {material.content.substring(0, 100)}...
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 text-center py-4 font-light">
                      No saved materials yet. Click the Save button on professor responses to store them.
                    </p>
                  )}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
