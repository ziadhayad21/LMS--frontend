import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import ExamBuilder from '@/components/exam/ExamBuilder';
import api from '@/src/api/axios';

interface Props { params: { examId: string } }

export const metadata: Metadata = { title: 'Exam Editor' };

async function fetchExam(examId: string, token: string) {
  try {
    const res: any = await api.get(`/exams/${examId}`, {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.exam ?? null;
  } catch {
    return null;
  }
}

export default async function TeacherGlobalExamEditPage({ params }: Props) {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const exam = await fetchExam(params.examId, token);
  if (!exam) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
      <div>
        <Link href="/teacher/exams" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to Exams
        </Link>
        <h1 className="page-title mt-2">{exam.isPublished ? 'View Exam' : 'Edit Draft Exam'}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {exam.isPublished
            ? 'This exam is published. You can review its content.'
            : 'Modify your draft assessment before publishing.'}
        </p>
      </div>

      <ExamBuilder initialData={exam} />
    </div>
  );
}

