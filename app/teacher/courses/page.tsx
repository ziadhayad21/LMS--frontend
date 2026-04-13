import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = { title: 'My Courses' };

import api from '@/src/api/axios';

async function fetchMyCourses(token: string) {
  try {
    const res: any = await api.get('/courses?limit=100', {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.courses ?? [];
  } catch (error) {
    return [];
  }
}

const levelColors: Record<string, string> = {
  beginner: 'badge-green', intermediate: 'badge-amber', advanced: 'badge-red',
};

export default async function TeacherCoursesPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');
  const courses = await fetchMyCourses(token);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">ALL Courses</h1>
          <p className="text-slate-500 text-sm mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/teacher/courses/new" className="btn-primary">+ New Course</Link>
      </div>

      {courses.length === 0 ? (
        <div className="card p-14 text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-slate-700 font-semibold mb-2">No courses yet</p>
          <p className="text-slate-400 text-sm mb-6">Create your first course to get started.</p>
          <Link href="/teacher/courses/new" className="btn-primary inline-flex">Create Course</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <div
              key={course._id}
              className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2"
            >
              <div className="relative h-44 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60" />
                <Link href={`/teacher/courses/${course._id}`} className="block h-full">
                  <div className="h-full bg-slate-100 flex items-center justify-center">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <span className="text-5xl opacity-20">📚</span>
                    )}
                  </div>
                </Link>
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
                    {course.level}
                  </span>
                </div>
                {!course.isPublished ? (
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    Draft
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                    Live
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <Link href={`/teacher/courses/${course._id}`} className="flex-1">
                  <h3 className="font-display text-lg font-black text-slate-800 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                </Link>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
                  <span>👥 {course.enrollmentCount}</span>
                  <span>📖 {course.lessons?.length || 0} Lessons</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={`/teacher/courses/${course._id}`} className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl text-center transition-all">
                    Manage
                  </Link>
                  <Link href={`/teacher/courses/${course._id}/edit`} className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
