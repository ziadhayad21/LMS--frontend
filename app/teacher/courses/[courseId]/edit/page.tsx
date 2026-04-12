import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import CourseForm from '@/components/course/CourseForm';
import Link from 'next/link';

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

export const metadata: Metadata = { title: 'Edit Course' };

export default async function EditCoursePage({ params }: Props) {
  const token  = cookies().get('jwt')?.value ?? '';
  const course = await fetchCourse(params.courseId, token);
  if (!course) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href={`/teacher/courses/${course._id}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Course
        </Link>
        <h1 className="page-title mt-2">Edit Course</h1>
        <p className="text-slate-500 text-sm mt-1">Update your course details below.</p>
      </div>
      <div className="card p-8">
        <CourseForm mode="edit" course={course} />
      </div>
    </div>
  );
}
