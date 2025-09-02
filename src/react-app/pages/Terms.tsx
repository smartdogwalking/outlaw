import Navigation from "@/react-app/components/Navigation";
import Footer from "@/react-app/components/Footer";
import GlassCard from "@/react-app/components/GlassCard";
import { Scale, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "@/react-app/components/Button";

export default function Terms() {
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Terms & Conditions</h1>
                  <p className="text-gray-600 font-light">Legal terms governing your use of OutLaw</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-light mt-4">Last updated: January 2024</p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <GlassCard 
              className="p-8 md:p-12 backdrop-blur-3xl border-gray-200/30 shadow-xl"
              opacity={0.05}
              blur="xl"
            >
              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    By accessing and using OutLaw ("the Service"), you accept and agree to be bound by the terms and 
                    provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                  <p className="text-gray-700 font-light leading-relaxed mb-4">
                    OutLaw is an educational platform that provides AI-powered study materials and exam prediction tools 
                    for law students. The Service includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-light">
                    <li>AI-generated professor clones based on user-provided information</li>
                    <li>Study materials including flashcards, hypotheticals, and practice questions</li>
                    <li>Exam prediction and preparation tools</li>
                    <li>Interactive chat functionality with AI professor clones</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Educational Use Only</h2>
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl mb-4">
                    <p className="text-amber-800 font-semibold">
                      IMPORTANT: OutLaw is designed exclusively for educational purposes and exam preparation.
                    </p>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-light">
                    <li>The Service is NOT a source of legal advice</li>
                    <li>AI-generated content should not be relied upon for actual legal matters</li>
                    <li>Users must verify all information with authoritative legal sources</li>
                    <li>The Service is intended as a study aid only</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
                  <p className="text-gray-700 font-light leading-relaxed mb-4">Users agree to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-light">
                    <li>Provide accurate information when creating professor clones</li>
                    <li>Use the Service in compliance with their law school's academic integrity policies</li>
                    <li>Not share account credentials with other users</li>
                    <li>Not attempt to reverse engineer or copy the Service's AI technology</li>
                    <li>Not use the Service for any unlawful purposes</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    All content, features, and functionality of the Service are owned by OutLaw and are protected by 
                    copyright, trademark, and other intellectual property laws. Users retain ownership of the materials 
                    they upload but grant OutLaw a license to use such materials to provide the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Disclaimers and Limitations</h2>
                  <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl mb-4">
                    <p className="text-red-800 font-semibold">
                      THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
                    </p>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 font-light">
                    <li>We do not guarantee the accuracy of AI-generated predictions or content</li>
                    <li>Exam predictions are estimates based on available data and may not reflect actual exams</li>
                    <li>Users are responsible for their own exam preparation and academic performance</li>
                    <li>OutLaw is not liable for any academic or professional consequences</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Privacy and Data</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                    use, and protect your information. By using the Service, you consent to the collection and use 
                    of your data as described in our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Termination</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    We reserve the right to terminate or suspend access to the Service at any time, with or without 
                    cause or notice. Users may terminate their account at any time by contacting us.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    We reserve the right to modify these terms at any time. Users will be notified of significant 
                    changes via email or through the Service. Continued use after changes constitutes acceptance 
                    of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                  <p className="text-gray-700 font-light leading-relaxed">
                    If you have questions about these Terms & Conditions, please contact us through our Contact page 
                    or email us directly.
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
