import { useState } from "react";
import { Link } from "react-router";
import { Mail, Send, CheckCircle } from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Button from "@/react-app/components/Button";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import SEOHead from "@/react-app/components/SEOHead";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (formData.email.length > 254) {
      newErrors.email = "Email address is too long";
    }
    
    // Subject validation
    if (formData.subject.length > 200) {
      newErrors.subject = "Subject must be less than 200 characters";
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 5000) {
      newErrors.message = "Message must be less than 5000 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      setErrors({ form: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEOHead 
        title="Contact Us - Get Help with OutLaw"
        description="Contact OutLaw for support with AI professor clones, exam predictions, and law school study tools. Get help from our expert team."
        keywords="OutLaw contact, law school support, AI study help, customer service, legal education assistance"
        canonical="/contact"
      />
      <Navigation />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pt-16 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/70 backdrop-blur-xl rounded-full text-sm font-medium text-gray-700 border border-gray-200/50">
                <Mail className="w-4 h-4 text-blue-600" />
                Get in touch
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-thin tracking-tight leading-tight mb-8">
              <span className="block text-gray-900">Contact</span>
              <span className="block text-gray-900">OutLaw.</span>
            </h1>
            
            <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about our AI-powered study platform? We're here to help law students succeed.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              
              {/* Contact Form */}
              <div>
                <GlassCard 
                  className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
                  opacity={0.05}
                  blur="xl"
                >
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Message Sent!</h3>
                      <p className="text-gray-600 font-light leading-relaxed mb-8">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="secondary"
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 hover:scale-105"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Send us a message</h2>
                        <p className="text-gray-600 font-light">
                          Whether you need technical support, have feature requests, or just want to share feedback, we'd love to hear from you.
                        </p>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-3 text-gray-700">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              minLength={2}
                              maxLength={100}
                              className={`w-full p-4 bg-white border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                                errors.name 
                                  ? 'border-red-300 focus:ring-red-300' 
                                  : 'border-gray-200 focus:ring-gray-300'
                              }`}
                              placeholder="Your full name"
                              aria-describedby="name-error"
                            />
                            {errors.name && (
                              <p id="name-error" className="mt-2 text-sm text-red-600 font-light">
                                {errors.name}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-3 text-gray-700">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              maxLength={254}
                              className={`w-full p-4 bg-white border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                                errors.email 
                                  ? 'border-red-300 focus:ring-red-300' 
                                  : 'border-gray-200 focus:ring-gray-300'
                              }`}
                              placeholder="your.email@lawschool.edu"
                              aria-describedby="email-error"
                            />
                            {errors.email && (
                              <p id="email-error" className="mt-2 text-sm text-red-600 font-light">
                                {errors.email}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-3 text-gray-700">
                            Subject
                          </label>
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            maxLength={200}
                            className={`w-full p-4 bg-white border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                              errors.subject 
                                ? 'border-red-300 focus:ring-red-300' 
                                : 'border-gray-200 focus:ring-gray-300'
                            }`}
                            placeholder="What's this about?"
                            aria-describedby="subject-error"
                          />
                          {errors.subject && (
                            <p id="subject-error" className="mt-2 text-sm text-red-600 font-light">
                              {errors.subject}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-3 text-gray-700">
                            Message *
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            minLength={10}
                            maxLength={5000}
                            rows={6}
                            className={`w-full p-4 bg-white border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
                              errors.message 
                                ? 'border-red-300 focus:ring-red-300' 
                                : 'border-gray-200 focus:ring-gray-300'
                            }`}
                            placeholder="Tell us what's on your mind..."
                            aria-describedby="message-error"
                          />
                          {errors.message && (
                            <p id="message-error" className="mt-2 text-sm text-red-600 font-light">
                              {errors.message}
                            </p>
                          )}
                          <div className="mt-2 text-xs text-gray-500 font-light">
                            {formData.message.length}/5000 characters
                          </div>
                        </div>
                        
                        {errors.form && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                            <p className="text-sm text-red-700 font-light">{errors.form}</p>
                          </div>
                        )}
                        
                        <Button
                          type="submit"
                          isLoading={isSubmitting}
                          disabled={isSubmitting}
                          className="group w-full py-4 bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl text-lg"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                        </Button>
                      </form>
                    </>
                  )}
                </GlassCard>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-thin text-gray-900 mb-8">Other ways to reach us</h2>
                  
                  <div className="space-y-6">
                    <GlassCard 
                      className="p-6 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
                      opacity={0.05}
                      blur="xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Support</h3>
                          <p className="text-gray-600 font-light">dandreamaxwell@gmail.com</p>
                          <p className="text-sm text-gray-500 font-light">We respond within 24 hours</p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
                
                {/* FAQ Preview */}
                <GlassCard 
                  className="p-8 backdrop-blur-3xl border-gray-200/30 shadow-lg"
                  opacity={0.05}
                  blur="xl"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Questions?</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">How accurate are the exam predictions?</h4>
                      <p className="text-sm text-gray-600 font-light">Our AI analyzes your professor's teaching patterns and achieves 87% accuracy in predicting exam content.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Is my data secure?</h4>
                      <p className="text-sm text-gray-600 font-light">Yes, all your study materials and professor clones are private and encrypted.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">How long does it take to set up?</h4>
                      <p className="text-sm text-gray-600 font-light">Creating your first professor clone takes about 5-10 minutes. Just upload your syllabus and answer a few questions.</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200/50">
                    <Link 
                      to="/faq" 
                      className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors duration-200"
                    >
                      View all FAQs →
                    </Link>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
