import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mr Abdallah Elhayad — English Mastery',
  description: 'Welcome to the official learning platform of Mr Abdallah Elhayad.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fcfdff] relative overflow-hidden px-6 py-20">
      {/* Decorative High-End Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(79,70,229,0.08)_0%,transparent_70%)] -z-10" />
      <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-[140px] -z-10 animate-float" />
      <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-accent-100/20 rounded-full blur-[140px] -z-10 animate-float" style={{ animationDelay: '-3s' }} />

      <div className="w-full max-w-2xl text-center space-y-16 animate-fade-in relative z-10">
        {/* Branding Cluster */}
        <div className="flex flex-col items-center gap-10">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary-500/20 rounded-[3rem] blur-2xl group-hover:bg-primary-500/30 transition-all duration-700 opacity-0 group-hover:opacity-100" />
            <div className="w-28 h-28 bg-slate-900 border-4 border-white shadow-premium rounded-[2.8rem] flex items-center justify-center text-white text-4xl font-black relative z-10 transform group-hover:rotate-12 transition-transform duration-700 ease-out">
              AE
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="font-display text-6xl md:text-8xl font-black text-slate-900 tracking-tightest leading-[0.85]">
              Mr Abdallah <br />
              <span className="text-primary-600 block mt-2">Elhayad</span>
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-8 bg-slate-200" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">
                Educational Excellence
              </p>
              <div className="h-[1px] w-8 bg-slate-200" />
            </div>
          </div>
        </div>

        {/* Dynamic Action Zone */}
        <div className="max-w-md mx-auto space-y-4">
          <Link 
            href="/login" 
            className="group w-full h-20 bg-slate-900 hover:bg-primary-600 text-white font-black rounded-[2.5rem] shadow-premium transition-all duration-500 active:scale-95 flex items-center justify-center gap-4 text-lg overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            <span>Enter the Platform</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
          
          <Link 
            href="/register" 
            className="w-full h-20 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-[2.5rem] border border-slate-200 shadow-sm transition-all duration-500 active:scale-95 flex items-center justify-center gap-2"
          >
            New here? Create an account
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="pt-10 flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-30 grayscale contrast-125">
          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
            <div className="w-2 h-2 bg-slate-400 rounded-full" />
            Quality Content
          </div>
          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
            <div className="w-2 h-2 bg-slate-400 rounded-full" />
            Academic Mastery
          </div>
          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
            <div className="w-2 h-2 bg-slate-400 rounded-full" />
            Verified Skills
          </div>
        </div>
      </div>

      {/* Footer Minimalist Tag */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center">
         <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">
            Curated by AE Studio • 2026
         </p>
      </div>
    </main>
  );
}
