import type { Metadata } from 'next';
import ForgotPasswordForm from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md card p-8 space-y-6 animate-fade-in">
        <div>
          <h1 className="page-title">Forgot password</h1>
          <p className="text-sm text-slate-500 mt-2">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

