import type { Metadata } from 'next';
import ResetPasswordForm from './ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md card p-8 space-y-6 animate-fade-in">
        <div>
          <h1 className="page-title">Reset password</h1>
          <p className="text-sm text-slate-500 mt-2">
            Set a new password for your account.
          </p>
        </div>
        <ResetPasswordForm token={params.token} />
      </div>
    </div>
  );
}

