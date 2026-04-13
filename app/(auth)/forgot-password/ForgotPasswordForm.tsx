'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res: any = await apiClient.post('/auth/forgot-password', { email: email.trim() });
      setMessage(res?.message || 'If that email exists, a reset link has been sent.');
    } catch (e: any) {
      setError(e.message || 'Request failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      ) : null}
      {message ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl">
          {message}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
        <input
          type="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? 'Sending…' : 'Send reset link'}
      </button>

      <div className="text-sm text-slate-500 flex items-center justify-between">
        <Link href="/login" className="hover:underline">Back to login</Link>
        <Link href="/register" className="hover:underline">Create account</Link>
      </div>
    </form>
  );
}

