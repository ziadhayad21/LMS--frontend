import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LessonListClient from './LessonListClient';
import api from '@/src/api/axios';

export const metadata: Metadata = {
  title: 'All Lessons',
  description: 'Manage all your created lessons.',
};

async function fetchLessons(token: string) {
  try {
    const res: any = await api.get('/lessons', {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.lessons || [];
  } catch (error) {
    return [];
  }
}

export default async function TeacherLessonsPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const lessons = await fetchLessons(token);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Manage Lessons</h1>
          <p className="text-slate-500 mt-1 text-sm">View, edit, and delete your lessons</p>
        </div>
        <Link href="/teacher/lessons/new" className="btn-primary">
          + Add Lesson
        </Link>
      </div>

      <div className="card">
        <LessonListClient initialLessons={lessons} />
      </div>
    </div>
  );
}
