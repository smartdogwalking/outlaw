import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import GlassCard from "@/react-app/components/GlassCard";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "@/react-app/components/Button";

export default function Privacy() {
  const navigate = useNavigate();

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
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Privacy Policy</h1>
                  <p className="text-gray-600 font-light">How we protect and handle your data</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-light mt-4">Last updated: January 2024</p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <GlassCard 
              className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
              opacity={0.05}
              blur="xl"
            >
              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                  <p className="text-gray-700 font-light leading-relaxed mb-4">We collect the following types of information:</p>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Account Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4 font-light">
                    <li>Google account information (name, email address) when you sign in</li>
                    <li>Law school affiliation and year of study</li>
                    <li>Profile preferences and settings</li>
                  </ul>

                  <h3 className="text-lg font-medium text-gray-900 mb-3">Study Materials</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4 font-light">
                    <li>Course syllabi, lecture notes, and other materials you upload</li>
                    <li>Professor questionnaire responses</li>
                    <li>Chat conversations with AI professor clones</li>
                    <li>Saved study materials and preferences</li>
                  </ul>

                  <h3 className="text-lg font-medium text-gray-900 mb-3">Usage Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-light">
                    <li>Study session data and patterns</li>
                    <li>Feature usage and interaction data</li>
                    <li>Technical information about your device and browser</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 font-light leading-relaxed mb-4">We use your information to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-light">
                    <li>Create and maintain your AI professor clones</li>
                    <li>Generate personalized study materials and exam predictions</li>
                    <li>Provide and improve our services</li>
                    <li>Communicate with you about your account and service updates</li>
                    <li>Analyze usage patterns to enhance the user experience</li>
                    <li>Ensure the security and integrity of our platform</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data Privacy and Security</h2>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl mb-4">
                    <p className="text-blue-800 font-semibold">
                      Your study materials and professor clones are completely private to your account.
                    </p>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-light">
                    <li>We never share your personal study data with other users</li>
                    <li>Your uploaded materials are encrypted and securely stored</li>
                    <li>AI processing occurs on secure servers with appropriate safeguards</li>
                    <li>We implement industry-standard security measures to protect your data</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
                  <p className="text-gray-700 font-light leading-relaxed mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share 
                    aggregated, anonymized data for research or improvement purposes, but this data cannot 
                    be used to identify individual users.
                  </p>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Limited Sharing</h3>
                  <p className="text-gray-700 font-light leading-relaxed mb-4">We may share your information only in these circumstances:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-light">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations or court orders</li>
                    <li>To protect the rights, property, or safety of OutLaw, our users, or the public</li>
                    <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
                  <p className="text-gray-700 font-light leading-relaxed mb-4">OutLaw integrates with the following third-party services:</p>
                  
                  <div className="grid md:grid-cols-1 gap-4">
                    <GlassCard 
                      className="p-4 backdrop-blur-3xl border-gray-200/30"
                      opacity={0.05}
                      blur="lg"
                    >
                      <div className="space-y-3">
                        <div><strong className="text-gray-900">Google Authentication:</strong> <span className="text-gray-700 font-light">For secure account creation and login</span></div>
                        <div><strong className="text-gray-900">OpenAI:</strong> <span className="text-gray-700 font-light">For AI-powered content generation (your data is not used to train their models)</span></div>
                        <div><strong className="text-gray-900">Cloudflare:</strong> <span className="text-gray-700 font-light">For content delivery and security</span></div>
                      </div>
                    </GlassCard>
                  </div>
                  
                  <p className="text-gray-700 font-light leading-relaxed mt-4">
                    Each service has its own privacy policy, and we encourage you to review them.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    We retain your account information and study materials for as long as your account remains active. 
                    You may request deletion of your account and associated data at any time by contacting us. 
                    Some anonymized usage data may be retained for service improvement purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
                  <p className="text-gray-700 font-light leading-relaxed mb-4">You have the right to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-light">
                    <li>Access and review your personal data</li>
                    <li>Correct or update inaccurate information</li>
                    <li>Delete your account and associated data</li>
                    <li>Export your study materials</li>
                    <li>Opt out of non-essential communications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    OutLaw is designed for law students who are typically adults. We do not knowingly collect 
                    personal information from children under 13. If we become aware that we have collected 
                    such information, we will take steps to delete it promptly.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any material 
                    changes by email or through a prominent notice on our platform. Your continued use of 
                    the service after such changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    If you have questions about this Privacy Policy or how we handle your data, please contact 
                    us through our Contact page. We're committed to addressing your privacy concerns promptly.
                  </p>
                </section>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
