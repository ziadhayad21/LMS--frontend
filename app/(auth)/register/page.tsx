import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Join the Academy — Mr Abdallah Elhayad',
  description: 'Begin your journey towards English mastery with Mr Abdallah Elhayad.',
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-[#fcfdff] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[120px] pointer-events-none -z-10 animate-float" />

      <div className="w-full max-w-lg lg:max-w-xl animate-fade-in py-12">
        <div className="text-center mb-10 space-y-4">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center shadow-premium ring-4 ring-white/60 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-2xl tracking-tighter">AE</span>
            </div>
            <div className="space-y-1">
              <span className="font-display font-black text-slate-950 text-2xl tracking-tighter uppercase block">Create Your Profile</span>
              <span className="text-xs font-black text-primary-600 uppercase tracking-[0.2em]">English Mastery Platform</span>
            </div>
          </Link>
        </div>

        <div className="relative bg-white p-10 rounded-[3rem] border border-slate-100 shadow-premium animate-fade-in">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Join the Academy</h1>
            <p className="text-slate-500 font-medium">Create your student account to access premium lessons</p>
          </div>

          <RegisterForm />
        </div>

        <div className="text-center mt-10 space-y-2">
          <p className="text-sm text-slate-400 font-black uppercase tracking-widest leading-none">
            Already have an account?
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 text-brand-600 font-black hover:text-brand-700 transition-colors group">
            Sign In to Dashboard
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
