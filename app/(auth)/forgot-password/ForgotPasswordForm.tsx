'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

type Step = 'IDENTIFIER' | 'OTP';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('IDENTIFIER');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return setError('Please enter your email or phone number.');

    setLoading(true);
    setError('');
    setMessage('');
    try {
      await apiClient.post('/auth/forgot-password', { identifier: identifier.trim() });
      setStep('OTP');
      setMessage('A 6-digit code has been sent to your account.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return setError('Please enter the 6-digit code.');
    if (newPassword.length < 8) return setError('Password must be at least 8 characters.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/verify-reset-otp', {
        identifier: identifier.trim(),
        otp: otp.trim(),
        newPassword,
      });
      setMessage('Password reset successfully! Redirecting...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Invalid code or reset failed.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'IDENTIFIER') {
    return (
      <form onSubmit={handleRequestOtp} className="space-y-5 animate-fade-in">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
        {message && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl">{message}</div>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email or Phone Number</label>
          <input
            type="text"
            className="input-field"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g. 01012345678 or user@gmail.com"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full h-12">
          {loading ? 'Sending Code...' : 'Send Reset Code'}
        </button>

        <div className="text-sm text-center">
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Back to Login
          </Link>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {message && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl">{message}</div>}

      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <div className="text-blue-500 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-xs text-blue-700 leading-relaxed">
          We&apos;ve sent a 6-digit code to <strong>{identifier}</strong>. Please enter it below along with your new password.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
        <input
          type="text"
          maxLength={6}
          className="input-field text-center text-2xl tracking-[0.5em] font-mono h-14"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
        <input
          type="password"
          className="input-field"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
        <input
          type="password"
          className="input-field"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full h-12">
        {loading ? 'Resetting Password...' : 'Reset Password'}
      </button>

      <div className="text-sm text-center">
        <button 
          type="button" 
          onClick={() => setStep('IDENTIFIER')}
          className="text-slate-500 hover:text-slate-700"
        >
          Try another email/phone
        </button>
      </div>
    </form>
  );
}

