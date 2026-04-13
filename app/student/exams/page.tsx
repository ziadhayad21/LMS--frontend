import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExamCard from '@/components/exams/ExamCard';
import { Trophy } from 'lucide-react';
import api from '@/src/api/axios';

export const metadata: Metadata = {
  title: 'Available Exams',
  description: 'View and take exams for your enrolled courses.',
};

async function fetchExamsAndUser(token: string) {
  try {
    const [examsRes, userRes]: any = await Promise.all([
      api.get('/exams', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/auth/me', { headers: { Cookie: `jwt=${token}` } }),
    ]);

    const user = userRes.data?.user ?? null;
    const exams = examsRes.data?.exams ?? [];

    return { exams, user };
  } catch {
    return { exams: [], user: null };
  }
}

export default async function StudentExamsPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const { exams, user } = await fetchExamsAndUser(token);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Available Assessments</h1>
          <p className="text-slate-500 mt-2">Test your knowledge across your enrolled courses</p>
        </div>
        {user?.level && (
          <span className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full border border-indigo-100 shadow-sm">
            {user.level}
          </span>
        )}
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-soft">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight font-display">No Exams Available</h3>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            You don&apos;t have any pending assessments for your level at the moment. Keep learning and check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam: any) => (
            <ExamCard
              key={exam._id}
              courseId={exam.course?._id || exam.course}
              exam={exam}
            />
          ))}
        </div>
      )}
    </div>
  );
}
