import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Brain, Database, Mic, Sparkles, ChevronRight, Zap, Target, Lock, Activity } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-text-primary overflow-x-hidden selection:bg-white/20">
      
      {/* Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <div className="w-4 h-4 bg-black rounded-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white leading-none">Alfred</span>
          <span className="hidden sm:inline-flex items-center px-2 py-[2px] ml-3 text-[10px] font-medium tracking-widest text-white/60 uppercase border border-white/10 rounded-full bg-white/5 h-6">
            Omni Architecture
          </span>
        </div>
        <button 
          onClick={() => navigate('/chat')}
          className="px-5 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg shadow-white/10 flex items-center gap-2"
        >
          Launch <ChevronRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 flex flex-col items-center justify-center text-center z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-white/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white/80">
            <Activity className="w-4 h-4 text-white" />
            Applied Behavioral Sciences
          </div>
          
          <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter text-white mb-6 leading-[1.1]">
            Consumer <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">Intelligence.</span> <br /> Hyper-focused.
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Gain unparalleled access to behavioral analytics, purchase drivers, and ecosystem dynamics. 
            Alfred is an advanced, pocket consumer intelligence oracle built explicitly for the smartphone industry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/chat')}
              className="w-full sm:w-auto px-8 py-3 lg:py-4 text-base font-semibold text-black bg-white rounded-full hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Start analyzing <Zap className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Product Shots/Visuals (Abstract) */}
      <section className="relative px-8 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-6xl mx-auto rounded-2xl border border-white/10 bg-panel/50 backdrop-blur-sm p-4 overflow-hidden shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="h-[400px] md:h-[600px] w-full bg-[#0A0A0A] rounded-xl flex items-center justify-center relative overflow-hidden border border-white/5">
            
            {/* Mock UI Elements */}
            <div className="absolute w-[120%] h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />
            
            <div className="relative z-10 flex flex-col gap-6 w-full max-w-2xl px-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md self-start max-w-[80%] flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4 text-white" />
                 </div>
                 <p className="text-sm text-white/90">"What is the average smartphone replacement cycle in India for 2024?"</p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md self-end max-w-[85%] shadow-lg shadow-white/5">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="w-4 h-4 bg-black rounded-sm" />
                    </div>
                    <span className="font-semibold text-white">Alfred</span>
                 </div>
                 <p className="text-sm leading-relaxed text-white/80">
                   The average replacement cycle has expanded to 28-30 months, heavily influenced by 5G adoption plateaus and the durability of premium devices. However, trade-in programs mitigate this friction by offering high Perceived Behavioural Control (PBC).
                 </p>
                 <div className="mt-4 flex gap-2">
                    <span className="text-[10px] px-2 py-1 rounded bg-white/10 text-white border border-white/5">Data extracted from TAM model</span>
                    <span className="text-[10px] px-2 py-1 rounded bg-white/10 text-white border border-white/5">98% confidence</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-8 py-32 bg-panel/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6">Designed for precision.</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Every aspect of Omni Architecture is built to provide nuanced, actionable intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: <Brain className="w-6 h-6" />, 
                title: "Cognitive & Social Analytics", 
                desc: "Analyzes intent through cognitive beliefs (Perceived Usefulness) and social dimensions (Subjective Norms)." 
              },
              { 
                icon: <Mic className="w-6 h-6" />, 
                title: "Natural Interface", 
                desc: "Frictionless multimodal interactions via text or real-time voice, enabling fluid queries." 
              },
              { 
                icon: <Database className="w-6 h-6" />, 
                title: "Smartphone Ecosystem Data", 
                desc: "Uncover localized intelligence into premiumization trends, EMI dependencies, and structural market shifts." 
              },
              { 
                icon: <Target className="w-6 h-6" />, 
                title: "Strategic Directives", 
                desc: "Translate raw data into actionable managerial implications, optimizing product positioning and marketing levers." 
              },
              { 
                icon: <Shield className="w-6 h-6" />, 
                title: "Unified Framework", 
                desc: "Aggregates fragmented consumer knowledge and academic models into one highly cohesive, reliable oracle." 
              },
              { 
                icon: <Sparkles className="w-6 h-6" />, 
                title: "Unobtrusive Architecture", 
                desc: "A brutalist, Silicon Valley-tier environment designed strictly for analytical focus and zero distractions." 
              }
            ].map((feat, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white-[0.07] transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{feat.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Footer */}
      <footer className="px-8 py-20 border-t border-white/5 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-8">Ready to explore?</h2>
        <button 
          onClick={() => navigate('/chat')}
          className="px-8 py-4 text-base font-semibold text-black bg-white rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
        >
          Access Premium
        </button>
        <div className="mt-20 pt-8 border-t border-white/5 w-full max-w-4xl flex items-center justify-between text-sm text-text-tertiary">
          <span>&copy; {new Date().getFullYear()} Omni Architecture. All rights reserved.</span>
          <span>Powered by SK Industries</span>
        </div>
      </footer>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
