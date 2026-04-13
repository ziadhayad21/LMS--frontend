import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DeleteCourseButton from '@/components/course/DeleteCourseButton';

interface Props { params: { courseId: string } }

import api from '@/src/api/axios';

async function fetchCourse(courseId: string, token: string) {
  try {
    const res: any = await api.get(`/courses/${courseId}`, {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.course ?? null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const token = cookies().get('jwt')?.value ?? '';
  const course = await fetchCourse(params.courseId, token);
  return { title: course ? `Manage: ${course.title}` : 'Manage Course' };
}

export default async function TeacherCourseDetailPage({ params }: Props) {
  const token = cookies().get('jwt')?.value ?? '';
  const course = await fetchCourse(params.courseId, token);
  if (!course) notFound();

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/teacher/courses" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Back to ALL Courses
          </Link>
          <h1 className="page-title mt-2">{course.title}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={course.isPublished ? 'badge-green' : 'badge-amber'}>
              {course.isPublished ? 'Published' : 'Draft'}
            </span>
            <span className="badge-slate capitalize">{course.level}</span>
            <span className="badge-slate capitalize">{course.category}</span>
            <span className="text-sm text-slate-400">👥 {course.enrollmentCount} students</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/teacher/courses/${course._id}/edit`} className="btn-secondary text-sm">Edit Course</Link>
          <Link href={`/teacher/courses/${course._id}/students`} className="btn-secondary text-sm">View Students</Link>
          <DeleteCourseButton courseId={course._id} />
        </div>
      </div>

      {/* ── Quick Actions Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* ADD LESSON — primary action */}
        <Link
          href={`/teacher/courses/${course._id}/lessons/new`}
          className="group flex flex-col items-center justify-center gap-3 p-8 bg-indigo-600 hover:bg-indigo-700 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 text-white transition-all active:scale-95"
        >
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl border border-white/20 group-hover:scale-110 transition-transform">
            🎬
          </div>
          <div className="text-center">
            <p className="font-black text-base tracking-tight">Add Lesson</p>
            <p className="text-indigo-200 text-xs mt-0.5">{course.lessons?.length ?? 0} lesson{course.lessons?.length !== 1 ? 's' : ''} so far</p>
          </div>
        </Link>

        {/* CREATE EXAM */}
        <Link
          href={`/teacher/courses/${course._id}/exams/new`}
          className="group flex flex-col items-center justify-center gap-3 p-8 bg-white hover:bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-soft transition-all active:scale-95"
        >
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl border border-amber-100 group-hover:scale-110 transition-transform">
            📝
          </div>
          <div className="text-center">
            <p className="font-black text-slate-800 text-base tracking-tight">Create Exam</p>
            <p className="text-slate-400 text-xs mt-0.5">{course.exams?.length ?? 0} exam{course.exams?.length !== 1 ? 's' : ''}</p>
          </div>
        </Link>
      </div>

      {/* ── Lessons List ────────────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Lessons in this Course</h2>
          <Link
            href={`/teacher/courses/${course._id}/lessons/new`}
            className="btn-primary text-sm"
          >
            + Add Lesson
          </Link>
        </div>

        {course.lessons?.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-slate-600 font-black text-lg">No lessons yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-8">All lessons (with videos & PDFs) must be added here.</p>
            <Link href={`/teacher/courses/${course._id}/lessons/new`} className="btn-primary">
              + Add First Lesson
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
            <div className="divide-y divide-slate-100">
              {course.lessons?.map((lesson: any, i: number) => (
                <div key={lesson._id} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm shrink-0 border border-indigo-100">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {lesson.isPublished
                        ? <span className="badge-green text-xs">Published</span>
                        : <span className="badge-amber text-xs">Draft</span>
                      }
                      {lesson.level && <span className="badge-slate text-xs">{lesson.level}</span>}
                      {lesson.isPreview && <span className="badge-blue text-xs">Preview</span>}
                      {lesson.pdfFile && <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 font-bold uppercase tracking-tight">PDF Material</span>}
                    </div>
                  </div>
                  <Link
                    href={`/teacher/courses/${course._id}/lessons/${lesson._id}/edit`}
                    className="btn-secondary text-xs px-3 py-1.5 shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Exams List ──────────────────────────────────────────────────────────── */}
      {course.exams?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Exams</h2>
            <Link href={`/teacher/courses/${course._id}/exams/new`} className="btn-primary text-sm">
              + Create Exam
            </Link>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
            <div className="divide-y divide-slate-100">
              {course.exams?.map((exam: any) => (
                <div key={exam._id} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                  <span className="text-xl shrink-0">📝</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm">{exam.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Passing: {exam.passingScore}%{exam.timeLimit ? ` · ${exam.timeLimit} min` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/teacher/courses/${course._id}/exams/${exam._id}/results`} className="btn-secondary text-xs px-3 py-1.5">
                      Results
                    </Link>
                    <Link href={`/teacher/courses/${course._id}/exams/${exam._id}`} className="btn-secondary text-xs px-3 py-1.5">
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
