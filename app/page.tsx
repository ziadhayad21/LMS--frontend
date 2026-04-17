import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mr Abdallah Elhayad — Learn English with Mastery',
  description: 'Welcome to the official learning platform of Mr Abdallah Elhayad.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden px-6">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-600/5 to-accent-500/5 -z-10" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-xl text-center space-y-12 animate-fade-in">
        {/* Branding */}
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-600 rounded-[2rem] shadow-2xl shadow-brand-500/40 text-white text-4xl font-black mb-4">
            AE
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
            Mr Abdallah <br />
            <span className="text-brand-600">Elhayad</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
            Welcome to your premier destination for professional English mastery. Your journey to fluency starts here.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col gap-4 sm:px-12">
          <Link 
            href="/login" 
            className="group relative flex items-center justify-center gap-3 px-8 py-5 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-[1.5rem] shadow-xl shadow-brand-500/30 transition-all active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Sign In to Dashboard</span>
            <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
          
          <Link 
            href="/register" 
            className="flex items-center justify-center px-8 py-5 bg-white hover:bg-slate-50 text-slate-700 font-black rounded-[1.5rem] border border-slate-200 shadow-soft transition-all active:scale-95"
          >
            Create Student Account
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
          LMS Version 2.0 • Secured Access
        </p>
      </div>

      {/* Footer Branding */}
      <footer className="absolute bottom-10 text-center w-full">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">
          © {new Date().getFullYear()} Mr Abdallah Elhayad | All Rights Reserved
        </p>
      </footer>
    </main>
  );
}
