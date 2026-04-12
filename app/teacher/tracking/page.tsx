import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StudentTrackingSection from '@/components/dashboard/StudentTrackingSection';

export const metadata: Metadata = {
  title: 'Student Tracking | Teacher Dashboard',
  description: 'Monitor student activity and progress.',
};

import api from '@/src/api/axios';

async function fetchTracking(token: string) {
  try {
    const res: any = await api.get('/progress/tracking', {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.tracking ?? [];
  } catch (error) {
    return null;
  }
}

export default async function TrackingPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const students = await fetchTracking(token);
  if (!students) redirect('/login');

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <StudentTrackingSection initial={students} />
    </div>
  );
}
