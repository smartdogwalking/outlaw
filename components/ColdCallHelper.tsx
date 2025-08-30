import { useState } from "react";
import { Target, Send, AlertCircle } from "lucide-react";
import GlassCard from "./GlassCard";
import Button from "./Button";

interface ColdCallHelperProps {
  onSendMessage?: (message: string) => void;
}

export default function ColdCallHelper({ onSendMessage }: ColdCallHelperProps) {
  const [topic, setTopic] = useState("");
  const [caseName, setCaseName] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmergencyHelp = async () => {
    if (!topic.trim() && !caseName.trim()) {
      alert("Please enter either a topic or case name for emergency help.");
      return;
    }

    setIsLoading(true);

    // Build emergency message
    let emergencyMessage = "🚨 COLD CALL EMERGENCY! I need immediate help with: ";
    
    if (topic.trim()) emergencyMessage += `Topic: ${topic.trim()}. `;
    if (caseName.trim()) emergencyMessage += `Case: ${caseName.trim()}. `;
    if (context.trim()) emergencyMessage += `Context: ${context.trim()}. `;
    
    emergencyMessage += "Please give me a concise answer that I can use right now in class. Structure it clearly and include the key points my professor would want to hear.";

    try {
      if (onSendMessage) {
        await onSendMessage(emergencyMessage);
      }
      
      // Clear form
      setTopic("");
      setCaseName("");
      setContext("");
    } catch (error) {
      console.error("Failed to send emergency help:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard 
      className="p-6 backdrop-blur-3xl border-red-200/40 shadow-lg bg-gradient-to-r from-red-50/30 to-pink-50/30"
      opacity={0.1}
      blur="xl"
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
        <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
          <Target className="w-4 h-4 text-white" />
        </div>
        Cold Call Emergency
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Topic or Subject</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="e.g., Consideration, Miranda Rights"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Case Name (if applicable)</label>
          <input
            type="text"
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="e.g., Marbury v. Madison"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Additional Context (optional)</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all duration-200 text-sm h-20 resize-none"
            placeholder="Any specific angle or detail the professor mentioned..."
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleEmergencyHelp}
          isLoading={isLoading}
          disabled={isLoading || (!topic.trim() && !caseName.trim())}
          className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm"
        >
          <Send className="w-4 h-4 mr-2" />
          <span>Get Emergency Help Now</span>
        </Button>

        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            This sends an urgent message to your professor AI for immediate help during class. 
            Keep your phone/laptop discreetly positioned to read the response.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
