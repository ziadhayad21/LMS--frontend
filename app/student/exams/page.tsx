import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Trophy } from 'lucide-react';
import api from '@/src/api/axios';
import ExamListItem from '@/components/exams/ExamListItem';

export const metadata: Metadata = {
  title: 'Available Exams',
  description: 'View and take exams for your enrolled courses.',
};

async function fetchExamsAndUser(token: string) {
  try {
    const [examsRes, userRes, resultsRes]: any = await Promise.all([
      api.get('/exams', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/auth/me', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/results/my', { headers: { Cookie: `jwt=${token}` } }),
    ]);

    const user = userRes.data?.user ?? null;
    const exams = examsRes.data?.exams ?? [];
    const results = resultsRes.data?.results ?? [];

    // attempt counts by exam id
    const attemptCounts = results.reduce((acc: Record<string, number>, r: any) => {
      const eid = r.exam?._id || r.exam;
      if (!eid) return acc;
      acc[eid] = (acc[eid] || 0) + 1;
      return acc;
    }, {});

    return { exams, user, attemptCounts };
  } catch {
    return { exams: [], user: null, attemptCounts: {} as Record<string, number> };
  }
}

export default async function StudentExamsPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const { exams, user, attemptCounts } = await fetchExamsAndUser(token);

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
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-premium">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight font-display">No Exams Available</h3>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            You don&apos;t have any pending assessments for your level at the moment. Keep learning and check back later!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam: any) => (
            <ExamListItem
              key={exam._id}
              courseId={exam.course?._id || exam.course}
              exam={exam}
              attemptCount={attemptCounts?.[exam._id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
