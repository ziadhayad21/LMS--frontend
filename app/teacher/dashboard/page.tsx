import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Book, Clock, Users, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Teacher Dashboard',
  description: 'Manage student admissions.',
};

import api from '@/src/api/axios';

async function fetchTeacherAdmissions(token: string) {
  try {
    const [dashboardRes, pendingRes]: any = await Promise.all([
      api.get('/courses/teacher/dashboard', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/auth/students?status=pending', { headers: { Cookie: `jwt=${token}` } }),
    ]);

    return {
      stats: dashboardRes.data ?? { totalStudents: 0 },
      pendingStudents: pendingRes.data?.students ?? [],
    };
  } catch (error) {
    return null;
  }
}

async function approveStudent(token: string, studentId: string) {
  try {
    await api.patch(`/auth/students/${studentId}/status`,
      { status: 'active' },
      { headers: { Cookie: `jwt=${token}` } }
    );
  } catch (error) {
    console.error('Failed to approve student:', error);
  }
}

export default async function TeacherDashboardPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  if (searchParams.approveStudentId) {
    await approveStudent(token, searchParams.approveStudentId);
    redirect('/teacher/dashboard?approved=1');
  }

  const data = await fetchTeacherAdmissions(token);
  if (!data) redirect('/login');
  const { stats, pendingStudents } = data;

  return (
    <div className="space-y-10 animate-fade-in pb-20 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight font-display">Faculty Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm font-bold uppercase tracking-widest leading-loose">Student Admissions & Management</p>
        </div>
        <Link href="/teacher/courses" className="btn-primary flex items-center gap-2 px-8">
          <Book className="w-5 h-5" /> Go to Courses
        </Link>
      </div>

      {searchParams.approved === '1' && (
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-[2rem] flex items-center gap-4 text-emerald-800 text-sm font-black uppercase tracking-widest animate-in slide-in-from-top duration-500">
          <UserCheck className="w-5 h-5" />
          Student approved successfully.
        </div>
      )}

      {/* Simplified Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium flex items-center gap-6">
          <div className="w-20 h-20 bg-amber-50 rounded-[1.8rem] flex items-center justify-center text-amber-500">
            <Clock className="w-10 h-10" />
          </div>
          <div>
            <p className="text-4xl font-black text-slate-800">{pendingStudents.length}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pending Approval</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-50 rounded-[1.8rem] flex items-center justify-center text-indigo-500">
            <Users className="w-10 h-10" />
          </div>
          <div>
            <p className="text-4xl font-black text-slate-800">{stats.totalStudents}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Enrolled Students</p>
          </div>
        </div>
      </div>

      {/* Admissions Table */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight font-display">Student Admissions</h2>
          <span className="px-4 py-2 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            {pendingStudents.length} Requests
          </span>
        </div>

        {pendingStudents.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-premium">
            <div className="w-24 h-24 bg-emerald-50 rounded-[2.2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
              <UserCheck className="w-12 h-12 text-emerald-500 opacity-40" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 font-display">All Caught Up!</h3>
            <p className="text-slate-400 text-lg">No pending student approvals at the moment.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-10 py-6 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Full Name</th>
                    <th className="text-left px-10 py-6 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Email Address</th>
                    <th className="text-right px-10 py-6 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingStudents.map((student: any) => (
                    <tr key={student._id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="px-10 py-7">
                        <p className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{student.name}</p>
                      </td>
                      <td className="px-10 py-7">
                        <p className="text-slate-500 font-medium text-base">{student.email}</p>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <Link
                          href={`/teacher/dashboard?approveStudentId=${student._id}`}
                          className="px-8 py-3.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.2rem] hover:bg-black transition-all shadow-lg hover:shadow-indigo-200"
                        >
                          Approve Entry
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
