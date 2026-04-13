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
              className="card flex flex-col overflow-hidden hover:shadow-lg border-slate-200 hover:border-primary-300 transition-all group bg-white"
            >
              {/* Thumbnail */}
              <Link href={isManagement ? `/teacher/courses/${course._id}` : `/student/courses/${course._id}`} className="block overflow-hidden relative h-44">
                <div className="h-full bg-slate-100 flex items-center justify-center">
                  {course.thumbnailUrl
                    ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )
                    : <span className="text-5xl opacity-30">📚</span>}
                </div>
                {!course.isPublished && (
                  <div className="absolute top-4 right-4 badge-amber shadow-sm">Draft</div>
                )}
              </Link>

              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={levelColors[course.level] ?? 'badge-slate'}>{course.level}</span>
                  <span className="badge-slate capitalize">{course.category}</span>
                </div>

                <div>
                  <Link href={isManagement ? `/teacher/courses/${course._id}` : `/student/courses/${course._id}`}>
                    <h3 className="font-display font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">{course.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>👩‍🏫 {course.teacher?.name}</span>
                  {isManagement && <span>👥 {course.enrollmentCount}</span>}
                </div>

                {isManagement && (
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      href={`/teacher/courses/${course._id}/edit`}
                      className="flex-1 btn-secondary !py-2 text-[10px] text-center"
                    >
                      Edit
                    </Link>
                    <DeleteCourseButton courseId={course._id} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
