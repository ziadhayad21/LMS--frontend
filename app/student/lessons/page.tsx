import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Academic Lessons',
  description: 'View all approved academic English lessons.',
};

import api from '@/src/api/axios';
import LessonCard from '@/components/lessons/LessonCard';

async function fetchLessonsAndUser(token: string) {
  try {
    const [lessonsRes, userRes]: any = await Promise.all([
      api.get('/lessons', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/auth/me', { headers: { Cookie: `jwt=${token}` } }),
    ]);
    const user = userRes.data?.user ?? null;
    const rawLessons = lessonsRes.data?.lessons ?? [];

    // FRONTEND GUARD: Filter out any lessons not matching the student's level
    const lessons = user?.level
      ? rawLessons.filter((l: any) => l.level === user.level)
      : rawLessons;

    return { lessons, user };
  } catch {
    return { lessons: [], user: null };
  }
}

export default async function StudentLessonsPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const { lessons, user } = await fetchLessonsAndUser(token);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight font-display">Classroom Library</h1>
          <p className="text-slate-400 mt-1 text-sm font-bold uppercase tracking-widest">Master Your English Curriculum</p>
        </div>
        {user?.level && (
          <span className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full border border-indigo-100 shadow-sm">
            {user.level}
          </span>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-premium">
          <p className="text-4xl mb-4 opacity-20">📚</p>
          <p className="text-slate-600 font-black text-lg">Knowledge is on its way.</p>
          <p className="text-slate-400 text-sm mt-1">No lessons are available for your level at this moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {lessons.map((lesson: any) => (
            <LessonCard
              key={lesson._id}
              lesson={{
                ...lesson,
                courseId: lesson.course?._id
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
