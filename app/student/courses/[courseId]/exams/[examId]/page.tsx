import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExamTaker from '@/components/exams/ExamTaker';
import api from '@/src/api/axios';

async function fetchExam(courseId: string, examId: string, token: string) {
  try {
    const res: any = await api.get(`/courses/${courseId}/exams/${examId}`, {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.exam || null;
  } catch (error: any) {
    if (error.statusCode === 403 || error.statusCode === 404) {
      redirect('/student/exams');
    }
    return null;
  }
}

export default async function StudentExamTakePage({
  params,
}: {
  params: { courseId: string; examId: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get('jwt')?.value;
  if (!token) redirect('/login');

  const exam = await fetchExam(params.courseId, params.examId, token);

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-full">
         <p className="text-slate-500 font-bold">Exam not found or you are not authorized.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <ExamTaker courseId={params.courseId} exam={exam} />
    </div>
  );
}
