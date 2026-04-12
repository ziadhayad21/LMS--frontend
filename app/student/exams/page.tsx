import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ExamCard from '@/components/exams/ExamCard';
import { Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Available Exams',
  description: 'View and take exams for your enrolled courses.',
};

import api from '@/src/api/axios';

async function fetchStudentExams(token: string) {
  try {
    const res: any = await api.get('/exams', {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.exams || [];
  } catch (error) {
    return [];
  }
}

export default async function StudentExamsPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const exams = await fetchStudentExams(token);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Available Assessments</h1>
        <p className="text-slate-500 mt-2">Test your knowledge across your enrolled courses</p>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-soft">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight font-display">No Exams Available</h3>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            You don&apos;t have any pending assessments at the moment. Keep learning and check back later!
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
