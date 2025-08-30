import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Brain, Target, Shield } from "lucide-react";
import { Link } from "react-router";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import GlassCard from "@/react-app/components/GlassCard";
import SEOHead from "@/react-app/components/SEOHead";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "accuracy" | "privacy" | "usage";
}

const faqs: FAQItem[] = [
  {
    category: "general",
    question: "How does OutLaw work?",
    answer: "OutLaw uses proprietary AI algorithms to analyze your professor's teaching patterns, lecture style, and historical exam data to create personalized study materials and exam predictions. You upload your syllabus and answer questions about your professor's teaching style, and our AI creates a digital clone that thinks and tests like your actual professor."
  },
  {
    category: "accuracy",
    question: "How accurate are the exam predictions?",
    answer: "Our system achieves 87% accuracy in predicting exam topics and question types. We analyze thousands of data points including lecture emphasis, professor communication patterns, and historical exam trends to make these predictions. However, we always recommend using OutLaw as a study supplement, not a replacement for attending class and reading assignments."
  },
  {
    category: "general",
    question: "What law school subjects does OutLaw support?",
    answer: "OutLaw works with all core law school subjects including Constitutional Law, Contracts, Torts, Criminal Law, Civil Procedure, Property Law, Evidence, and more. Our AI adapts to any legal subject matter and professor teaching style."
  },
  {
    category: "usage",
    question: "How long does it take to set up a professor clone?",
    answer: "Setting up your first professor clone takes about 5-10 minutes. You'll upload your syllabus, answer questions about your professor's teaching style and personality, and our AI will generate your personalized study materials within minutes."
  },
  {
    category: "privacy",
    question: "Is my data secure and private?",
    answer: "Yes, we take data privacy extremely seriously. All your study materials, professor information, and personal data are encrypted and stored securely. We never share your information with third parties, and you can delete your account and all associated data at any time."
  },
  {
    category: "accuracy",
    question: "What if the predictions are wrong?",
    answer: "While our system is 87% accurate, no prediction system is perfect. We recommend using OutLaw as a comprehensive study tool rather than relying solely on predictions. Our AI also provides broad topic coverage and study materials that will help you regardless of specific question variations."
  },
  {
    category: "usage",
    question: "Can I use OutLaw for multiple professors?",
    answer: "Absolutely! You can create professor clones for all your classes. Each clone is tailored to that specific professor's teaching style and subject matter. Many students create clones for their entire semester's worth of classes."
  },
  {
    category: "general",
    question: "Does OutLaw work with online classes?",
    answer: "Yes! OutLaw works whether your classes are in-person, online, or hybrid. Our AI analyzes professor patterns from any format of instruction, including recorded lectures, discussion posts, and virtual office hours."
  },
  {
    category: "usage",
    question: "How much does OutLaw cost?",
    answer: "OutLaw offers a free tier to get started, with premium features available through our subscription plans. We believe every law student should have access to better study tools, so we keep our pricing student-friendly."
  },
  {
    category: "accuracy",
    question: "How do you ensure accuracy across different law schools?",
    answer: "Our algorithms are trained on data from 198 law schools and have been tested across different institutions, professor types, and teaching styles. We continuously update our models based on feedback and outcomes to maintain high accuracy across all schools."
  },
  {
    category: "privacy",
    question: "Do professors know I'm using OutLaw?",
    answer: "No, OutLaw is a private study tool. We don't contact your professors or share any information with your school. Everything you do on OutLaw is completely confidential and designed to supplement your personal study routine."
  },
  {
    category: "usage",
    question: "Can OutLaw help with bar exam preparation?",
    answer: "While OutLaw is primarily designed for law school exams, the study techniques and comprehensive subject matter coverage can be helpful for bar exam preparation. However, we recommend using dedicated bar prep courses for comprehensive bar exam study."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "general", label: "General", icon: Brain },
    { id: "accuracy", label: "Accuracy", icon: Target },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "usage", label: "Usage", icon: HelpCircle },
  ];

  const filteredFAQs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead 
        title="FAQ - Frequently Asked Questions"
        description="Find answers to common questions about OutLaw's AI professor clones, exam predictions, pricing, and how our law school study platform works."
        keywords="law school FAQ, AI study questions, exam prediction questions, OutLaw help, legal study platform"
        canonical="/faq"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="px-6 py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/70 backdrop-blur-xl rounded-full text-sm font-medium text-gray-700 border border-gray-200/50">
              <HelpCircle className="w-4 h-4" />
              Get answers to common questions
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-thin tracking-tight leading-tight mb-8">
            <span className="block text-gray-900">Questions?</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">We have answers.</span>
          </h1>
          
          <p className="text-xl font-light text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            Find answers to the most common questions about OutLaw and how it can help you succeed in law school.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-black text-white shadow-lg scale-105'
                      : 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70 hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <GlassCard 
                key={index}
                className="backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-300 overflow-hidden"
                opacity={0.05}
                blur="xl"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openItems.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {openItems.has(index) && (
                  <div className="px-8 pb-8 pt-0">
                    <div className="border-t border-gray-200/50 pt-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-20 bg-gray-50/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-thin text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg font-light text-gray-600 mb-8">
            We're here to help. Get in touch with our team.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
