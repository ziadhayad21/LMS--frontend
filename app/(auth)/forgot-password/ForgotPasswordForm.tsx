'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

export default function ForgotPasswordForm() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return setError('Please enter your email or phone number.');

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res: any = await apiClient.post('/auth/forgot-password', { identifier: identifier.trim() });
      setMessage(res?.message || 'A reset link has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 animate-fade-in shadow-sm p-1 rounded-2xl">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl animate-shake">
          {error}
        </div>
      )}
      
      {message ? (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-indigo-900 font-semibold">{message}</p>
          <p className="text-sm text-indigo-600/70">Please check your inbox (and spam folder) for the reset link.</p>
          <button 
            type="button" 
            onClick={() => setMessage('')}
            className="text-xs font-medium text-indigo-500 hover:underline pt-2"
          >
            Didn&apos;t receive it? Try again
          </button>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Email or Phone Number</label>
            <div className="relative group">
              <input
                type="text"
                className="input-field pl-11 focus:ring-indigo-500/20"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or 01xxxxxxxxx"
                required
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full h-12 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Link...
              </span>
            ) : 'Send Reset Link'}
          </button>

          <div className="text-sm text-center pt-2">
            <Link href="/login" className="text-slate-500 hover:text-indigo-600 font-medium transition-colors">
              Back to Login
            </Link>
          </div>
        </>
      )}
    </form>
  );
}

