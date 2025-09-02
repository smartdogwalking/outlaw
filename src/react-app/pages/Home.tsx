@@ .. @@
           <div className="text-center max-w-4xl mx-auto">
             <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
               Never Get
               <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                 Cold Called
               </span>
               Unprepared Again
             </h1>
             
             <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
               Create AI professor clones that predict exactly what will be on your law school exams with <strong>87% accuracy</strong>. Join 1,724+ law students studying smarter.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
-              <Link
-                to="/demo"
-                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
+              <button
+                onClick={() => handleAuthClick('signup')}
+                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
               >
-                Try Free Demo
-              </Link>
+                Start Free Trial
+              </button>
               <Link
                 to="/demo"
                 className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
               >
-                Watch Demo
+                View Demo
               </Link>
             </div>
             
             <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
               <div className="flex items-center gap-2">
                 <CheckCircle className="w-4 h-4 text-green-500" />
                 <span>Free to start</span>
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle className="w-4 h-4 text-green-500" />
                 <span>No credit card required</span>
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle className="w-4 h-4 text-green-500" />
                 <span>87% accuracy rate</span>
               </div>
             </div>
           </div>
         </div>
       </section>

@@ .. @@
 export default function HomePage() {
+  const [showAuthModal, setShowAuthModal] = useState(false);
+  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
+
+  const handleAuthClick = (mode: 'signin' | 'signup') => {
+    setAuthMode(mode);
+    setShowAuthModal(true);
+  };
+
   return (
-    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
+    <>
+      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
       <Header variant="transparent" />

@@ .. @@
       {/* Footer */}
       <Footer />
     </div>
+
+      {/* Auth Modal */}
+      <AuthModal
+        isOpen={showAuthModal}
+        onClose={() => setShowAuthModal(false)}
+        mode={authMode}
+        onSwitchMode={setAuthMode}
+      />
+    </>
   );
 }