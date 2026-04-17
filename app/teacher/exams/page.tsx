import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Trophy, PlusCircle } from 'lucide-react';
import type { Exam } from '@/types';
import TeacherExamCard from '@/components/exams/TeacherExamCard';

export const metadata: Metadata = {
  title: 'Manage Exams',
  description: 'Manage all your created exams.',
};

import api from '@/src/api/axios';

import { getServerAuthUser } from '@/lib/server/auth';

async function fetchExams(token: string) {
  try {
    const res: any = await api.get('/exams', {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.exams || [];
  } catch (error) {
    return [];
  }
}

export default async function TeacherExamsPage() {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  const user = await getServerAuthUser();
  const exams = await fetchExams(token);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Manage Exams</h1>
          <p className="text-slate-500 mt-1 text-sm">View and manage all assessments across your courses</p>
        </div>
        <Link href="/teacher/exams/new" className="btn-primary">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Exam
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-soft p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No Exams Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            You haven&apos;t created any assessments yet. Get started by creating your first exam.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {exams.map((exam: any) => (
            <TeacherExamCard key={exam._id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
