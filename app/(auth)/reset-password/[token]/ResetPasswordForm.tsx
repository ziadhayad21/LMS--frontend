'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const mismatch = useMemo(() => confirm.length > 0 && newPassword !== confirm, [newPassword, confirm]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mismatch) return;

    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res: any = await apiClient.patch(`/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(res?.message || 'Password updated successfully.');
      // User is logged in after reset (backend sets cookie). Redirect to home/login.
      router.push('/');
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Reset failed.');
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
        <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
        <input
          type="password"
          className="input-field"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <p className="text-xs text-slate-400 mt-2">
          Must be at least 8 characters and include upper/lowercase letters and a number.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
        <input
          type="password"
          className="input-field"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {mismatch ? (
          <p className="text-xs text-rose-600 mt-2 font-semibold">Passwords do not match.</p>
        ) : null}
      </div>

      <button type="submit" disabled={saving || mismatch} className="btn-primary w-full">
        {saving ? 'Updating…' : 'Update password'}
      </button>

      <div className="text-sm text-slate-500">
        <Link href="/login" className="hover:underline">Back to login</Link>
      </div>
    </form>
  );
}

