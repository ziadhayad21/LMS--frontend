import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Browse Courses',
  description: 'Explore all available English courses — grammar, speaking, writing, listening and more.',
};

import api from '@/src/api/axios';
import { cookies } from 'next/headers';
import { getServerAuthUser } from '@/lib/server/auth';
import DeleteCourseButton from '@/components/course/DeleteCourseButton';

async function fetchCourses(searchParams: Record<string, string>, token?: string) {
  try {
    const params = new URLSearchParams(searchParams).toString();
    const res: any = await api.get(`/courses?${params}`, {
      headers: token ? { Cookie: `jwt=${token}` } : {},
    });
    return { courses: res.data?.courses ?? [], meta: res.meta ?? null };
  } catch (error) {
    return { courses: [], meta: null };
  }
}

const LEVELS = ['أولى إعدادي', 'تانية إعدادي', 'تالتة إعدادي', 'أولى ثانوي', 'تانية ثانوي', 'تالتة ثانوي'];
const CATEGORIES = ['grammar', 'speaking', 'writing', 'reading', 'listening', 'vocabulary', 'general'];

const levelColors: Record<string, string> = {
  'أولى إعدادي': 'badge-green', 'تانية إعدادي': 'badge-green', 'تالتة إعدادي': 'badge-green',
  'أولى ثانوي': 'badge-blue', 'تانية ثانوي': 'badge-blue', 'تالتة ثانوي': 'badge-blue',
};

interface Props { searchParams: Record<string, string> }

export default async function BrowseCoursesPage({ searchParams }: Props) {
  const token = cookies().get('jwt')?.value;
  const user = await getServerAuthUser();
  const { courses, meta } = await fetchCourses(searchParams, token);

  const isManagement = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Browse Courses</h1>
          <p className="text-slate-500 text-sm mt-1">{meta?.total ?? courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
        </div>

        {isManagement && (
          <Link href="/teacher/courses/new" className="btn-primary flex items-center gap-2">
            <span>➕</span> Create New Course
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card p-5 flex items-center gap-3 flex-wrap border-slate-200">
        <Link
          href={user?.role === 'teacher' ? '/teacher/courses' : '/student/courses'}
          className={`badge cursor-pointer transition-colors ${!searchParams.level && !searchParams.category ? 'badge-blue' : 'badge-slate hover:bg-slate-200'}`}
        >
          All
        </Link>
        {LEVELS.map((l) => (
          <Link key={l} href={`${user?.role === 'teacher' ? '/teacher/courses' : '/student/courses'}?level=${l}`}
            className={`badge cursor-pointer capitalize transition-colors ${searchParams.level === l ? 'badge-blue' : 'badge-slate hover:bg-slate-200'}`}>
            {l}
          </Link>
        ))}
        <div className="h-4 w-px bg-slate-300" />
        {CATEGORIES.map((c) => (
          <Link key={c} href={`${user?.role === 'teacher' ? '/teacher/courses' : '/student/courses'}?category=${c}`}
            className={`badge cursor-pointer capitalize transition-colors ${searchParams.category === c ? 'badge-blue' : 'badge-slate hover:bg-slate-200'}`}>
            {c}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {courses.length === 0 ? (
        <div className="card p-14 text-center border-slate-200">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-slate-600 font-medium">No courses found for these filters.</p>
          <Link href={user?.role === 'teacher' ? '/teacher/courses' : '/student/courses'} className="btn-secondary mt-4 inline-flex">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <div
              key={course._id}
              className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2"
            >
              {/* Thumbnail / Image Container */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

                <Link href={isManagement ? `/teacher/courses/${course._id}` : `/student/courses/${course._id}`} className="block h-full">
                  {course.thumbnailUrl ? (
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                      <span className="text-6xl grayscale opacity-20">📚</span>
                    </div>
                  )}
                </Link>

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${course.category === 'grammar' ? 'bg-indigo-600' :
                      course.category === 'speaking' ? 'bg-emerald-600' :
                        course.category === 'writing' ? 'bg-rose-600' : 'bg-slate-800'
                    }`}>
                    {course.category}
                  </div>
                </div>

                {!course.isPublished && (
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                    Draft
                  </div>
                )}

                <div className="absolute bottom-4 left-4 z-20">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
                    {course.level}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <Link href={isManagement ? `/teacher/courses/${course._id}` : `/student/courses/${course._id}`}>
                    <h3 className="font-display text-xl font-black text-slate-800 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {course.description}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">
                      {course.teacher?.name?.[0] || 'T'}
                    </div>
                    <span className="text-xs font-bold text-slate-600 truncate max-w-[100px]">
                      {course.teacher?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      {course.lessons?.length || 0} Lessons
                    </span>
                  </div>
                </div>

                {isManagement ? (
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/teacher/courses/${course._id}`}
                      className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl text-center transition-all shadow-md hover:shadow-lg"
                    >
                      Manage
                    </Link>
                    <DeleteCourseButton courseId={course._id} />
                  </div>
                ) : (
                  <Link
                    href={`/student/courses/${course._id}`}
                    className="mt-4 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl text-center transition-all shadow-[0_10px_20px_rgba(79,70,229,0.2)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.3)]"
                  >
                    View Course
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
