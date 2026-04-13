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
          <h1 className="page-title">All Lessons</h1>
          <p className="text-slate-500 mt-1 text-sm">
            View and manage lessons across all your courses.
          </p>
        </div>
        {/* Lessons must be added from inside a course — direct the teacher there */}
        <Link href="/teacher/courses" className="btn-primary">
          ← Manage Courses
        </Link>
      </div>

      {/* Informational banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-indigo-600 text-lg">
          ℹ️
        </div>
        <div>
          <p className="font-bold text-indigo-800 text-sm">To add a new lesson, go into a Course first.</p>
          <p className="text-indigo-600 text-xs mt-1">
            All lessons must belong to a course.{' '}
            <Link href="/teacher/courses" className="underline font-bold hover:text-indigo-800">
              Browse your courses →
            </Link>
          </p>
        </div>
      </div>

      <div className="card">
        <LessonListClient initialLessons={lessons} />
      </div>
    </div>
  );
}
