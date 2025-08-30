import { Link } from "react-router";
import { ExternalLink, Home, Info, HelpCircle, FileText, Users, Shield, AlertTriangle, Mail, Play, User, BookOpen, Brain, Target } from "lucide-react";
import GlassCard from "@/react-app/components/GlassCard";
import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";

interface SitePage {
  path: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  auth?: boolean;
}

interface SiteCategory {
  category: string;
  pages: SitePage[];
}

const sitePages: SiteCategory[] = [
  {
    category: "Main Pages",
    pages: [
      { path: "/", title: "Home", description: "Main landing page with hero section and features", icon: Home },
      { path: "/demo", title: "Interactive Demo", description: "Try OutLaw's AI features with sample data", icon: Play },
      { path: "/about", title: "About OutLaw", description: "Learn about our mission and how OutLaw works", icon: Info },
      { path: "/features", title: "Features", description: "Explore OutLaw's powerful AI features and capabilities", icon: Brain },
      { path: "/contact", title: "Contact Us", description: "Get in touch with our team", icon: Mail },
      { path: "/faq", title: "FAQ", description: "Frequently asked questions and answers", icon: HelpCircle }
    ]
  },
  {
    category: "User Features",
    pages: [
      { path: "/dashboard", title: "Dashboard", description: "Your personal study dashboard and professor clones", icon: Users, auth: true },
      { path: "/create-clone", title: "Create Professor Clone", description: "Upload materials and create AI professor clones", icon: Brain, auth: true },
      { path: "/study/:cloneId", title: "Study Session", description: "Chat with AI professors and study materials", icon: BookOpen, auth: true },
      { path: "/exam-prediction/:cloneId", title: "Exam Predictions", description: "AI-generated exam predictions and practice questions", icon: Target, auth: true },
      { path: "/account", title: "Account Settings", description: "Manage your profile and preferences", icon: User, auth: true },
      { path: "/onboarding", title: "Account Setup", description: "Set up your law school and preferences", icon: Users, auth: true }
    ]
  },
  {
    category: "Legal Pages",
    pages: [
      { path: "/terms", title: "Terms of Service", description: "Legal terms and conditions for using OutLaw", icon: FileText },
      { path: "/privacy", title: "Privacy Policy", description: "How we protect and handle your data", icon: Shield },
      { path: "/disclaimer", title: "Legal Disclaimer", description: "Important legal disclaimers and limitations", icon: AlertTriangle }
    ]
  }
];

export default function Sitemap() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />

      <main className="relative z-10">
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-thin tracking-tight leading-tight mb-6">
                <span className="block text-gray-900">Site Map</span>
              </h1>
              
              <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Navigate all pages and features available on OutLaw
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                All OutLaw pages and features
              </div>
            </div>

            <div className="space-y-12">
              {sitePages.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    {category.category}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.pages.map((page, pageIndex) => (
                      <GlassCard 
                        key={pageIndex}
                        className="group p-6 backdrop-blur-3xl border-gray-200/30 hover:border-gray-300/40 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                        opacity={0.05}
                        blur="xl"
                      >
                        <Link to={page.path} className="block">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                              <page.icon className="w-6 h-6 text-gray-600" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                  {page.title}
                                </h3>
                                {page.auth && (
                                  <div className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                    Login Required
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                {page.description}
                              </p>
                              
                              <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                                <span>Visit page</span>
                                <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional Information */}
            <div className="mt-16 pt-12 border-t border-gray-100">
              <GlassCard 
                className="p-8 backdrop-blur-3xl border-gray-200/30 text-center"
                opacity={0.05}
                blur="xl"
              >
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help Finding Something?</h3>
                  <p className="text-gray-600 font-light mb-6 leading-relaxed">
                    Can't find what you're looking for? Our support team is here to help you navigate OutLaw and make the most of your AI study companion.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contact">
                      <button className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-full border-0 font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                        Contact Support
                      </button>
                    </Link>
                    
                    <Link to="/faq">
                      <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full border-0 font-medium transition-all duration-300 hover:scale-105">
                        View FAQ
                      </button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
