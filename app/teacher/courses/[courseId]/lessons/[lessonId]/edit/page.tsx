import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LessonUploadForm from '@/components/course/LessonUploadForm';
import api from '@/src/api/axios';

interface Props { params: { courseId: string; lessonId: string } }

export const metadata: Metadata = { title: 'Edit Lesson' };

async function fetchLessonData(courseId: string, lessonId: string, token: string) {
    try {
        const res: any = await api.get(`/courses/${courseId}/lessons/${lessonId}`, {
            headers: { Cookie: `jwt=${token}` },
        });
        return res.data?.lesson ?? null;
    } catch (error) {
        return null;
    }
}

export default async function EditLessonPage({ params }: Props) {
    const token = cookies().get('jwt')?.value ?? '';
    const lesson = await fetchLessonData(params.courseId, params.lessonId, token);

    if (!lesson) notFound();

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div>
                <Link href={`/teacher/courses/${params.courseId}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                    ← Back to Course
                </Link>
                <h1 className="page-title mt-2">Edit Lesson</h1>
                <p className="text-slate-500 text-sm mt-1">Update title, video, or PDF materials.</p>
            </div>
            <div className="card p-8">
                <LessonUploadForm courseId={params.courseId} initialData={lesson} />
            </div>
        </div>
    );
}
