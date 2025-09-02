import { Heart, Shield, Scale } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-white/20 backdrop-blur-sm border-t border-gray-200/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Legal Disclaimer */}
        <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 rounded-lg flex-shrink-0">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">Important Legal Disclaimer</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                <strong>This is not legal advice.</strong> OutLaw is an educational study tool designed to help law students prepare for exams. 
                The AI-generated content, predictions, and study materials are for educational purposes only and should not be relied upon as legal advice. 
                Always consult with qualified legal professionals for actual legal matters. The accuracy of exam predictions cannot be guaranteed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-black rounded-2xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-semibold text-black tracking-tight">
                OutLaw
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              AI-powered exam prediction and study materials for law students. Study smarter, not harder.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for law students</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-black transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-black transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-black transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-gray-600 hover:text-black transition-colors">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-black transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-black transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-600 hover:text-black transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-600 hover:text-black transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200/50 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 OutLaw. Made with <Heart className="w-4 h-4 inline text-red-500 fill-current" /> by law students, for law students.
            </p>
            <p className="text-xs text-gray-400 text-center md:text-right">
              This application generates AI-powered study materials for educational purposes only.<br />
              Always verify information with authoritative legal sources.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
