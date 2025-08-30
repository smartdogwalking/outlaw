import { useState } from "react";
import { AlertTriangle, Send, Target, Zap } from "lucide-react";
import GlassCard from "./GlassCard";
import Button from "./Button";

interface ColdCallEmergencyProps {
  onEmergencyHelp: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export default function ColdCallEmergency({ onEmergencyHelp, isLoading = false }: ColdCallEmergencyProps) {
  const [topic, setTopic] = useState("");
  const [caseName, setCaseName] = useState("");
  const [context, setContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!topic.trim() && !caseName.trim()) {
      alert("Please enter either a topic or case name for emergency help.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build comprehensive emergency message
      let emergencyMessage = "🚨 COLD CALL EMERGENCY - I need immediate help with: ";
      
      if (topic.trim()) {
        emergencyMessage += `\n📚 TOPIC: ${topic.trim()}`;
      }
      
      if (caseName.trim()) {
        emergencyMessage += `\n⚖️ CASE: ${caseName.trim()}`;
      }
      
      if (context.trim()) {
        emergencyMessage += `\n💡 CONTEXT: ${context.trim()}`;
      }
      
      emergencyMessage += "\n\n🎯 URGENT REQUEST: Please provide a concise, structured answer that I can use RIGHT NOW in class. Include:\n";
      emergencyMessage += "• Key points my professor would want to hear\n";
      emergencyMessage += "• Proper legal reasoning/structure\n";
      emergencyMessage += "• Any important cases or principles\n";
      emergencyMessage += "• Brief, confident talking points\n\n";
      emergencyMessage += "⏰ This is time-sensitive - I'm being cold called now!";

      await onEmergencyHelp(emergencyMessage);

      // Clear form after successful submission
      setTopic("");
      setCaseName("");
      setContext("");
    } catch (error) {
      console.error("Emergency help failed:", error);
      alert("Failed to get emergency help. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (field !== 'context') {
        handleSubmit();
      }
    }
  };

  return (
    <GlassCard 
      className="p-6 backdrop-blur-3xl border-red-200/50 shadow-xl bg-gradient-to-r from-red-50/40 to-orange-50/40"
      opacity={0.15}
      blur="xl"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
          <AlertTriangle className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">🚨 Cold Call Emergency</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Get instant, perfect answers for unexpected cold calls. Just describe what you need help with.
        </p>
      </div>

      {/* Quick Help Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setTopic("Constitutional Law analysis")}
          disabled={isSubmitting || isLoading}
          className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-xs font-semibold text-blue-700 mb-1">Constitutional</div>
          <div className="text-xs text-blue-600">Quick help</div>
        </button>
        
        <button
          onClick={() => setTopic("Contract law principles")}
          disabled={isSubmitting || isLoading}
          className="p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-xs font-semibold text-green-700 mb-1">Contracts</div>
          <div className="text-xs text-green-600">Quick help</div>
        </button>
        
        <button
          onClick={() => setTopic("Tort law analysis")}
          disabled={isSubmitting || isLoading}
          className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-xs font-semibold text-purple-700 mb-1">Torts</div>
          <div className="text-xs text-purple-600">Quick help</div>
        </button>
        
        <button
          onClick={() => setTopic("Criminal law defense")}
          disabled={isSubmitting || isLoading}
          className="p-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-xs font-semibold text-yellow-700 mb-1">Criminal</div>
          <div className="text-xs text-yellow-600">Quick help</div>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">
            <Target className="w-4 h-4 inline mr-2" />
            Topic or Subject *
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, 'topic')}
            className="w-full p-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all duration-200 text-sm font-medium"
            placeholder="e.g., Due Process Clause, Consideration doctrine"
            disabled={isSubmitting || isLoading}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">
            ⚖️ Case Name (if applicable)
          </label>
          <input
            type="text"
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, 'case')}
            className="w-full p-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all duration-200 text-sm font-medium"
            placeholder="e.g., Marbury v. Madison, Roe v. Wade"
            disabled={isSubmitting || isLoading}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">
            💡 Additional Context
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-3 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all duration-200 text-sm h-20 resize-none font-medium"
            placeholder="Any specific angle, professor's emphasis, or what they just said..."
            disabled={isSubmitting || isLoading}
          />
        </div>
      </div>

      {/* Emergency Button */}
      <div className="mt-6">
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading || (!topic.trim() && !caseName.trim())}
          className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl border-0 font-bold transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-base"
        >
          <div className="flex items-center justify-center gap-2">
            {isSubmitting || isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Getting Help...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>GET EMERGENCY HELP NOW</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </div>
        </Button>
      </div>

      {/* Usage Tip */}
      <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/50 rounded-xl">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong>Pro tip:</strong> Keep your phone/laptop positioned discreetly so you can quickly read the response. 
            The AI will provide structured talking points in your professor's style.
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
