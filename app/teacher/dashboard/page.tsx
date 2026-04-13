import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import StatsCard from '@/components/dashboard/StatsCard';
import StudentTrackingSection from '@/components/dashboard/StudentTrackingSection';
import { Book, CheckCircle, Clock, Users, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Teacher Dashboard',
  description: 'Manage academic lessons and student approvals.',
};

import api from '@/src/api/axios';

async function fetchTeacherDashboard(token: string) {
  try {
    const [dashboardRes, lessonsRes, pendingRes, trackingRes]: any = await Promise.all([
      api.get('/courses/teacher/dashboard', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/lessons', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/auth/students?status=pending', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/progress/tracking', { headers: { Cookie: `jwt=${token}` } }),
    ]);

    return {
      stats: dashboardRes.data ?? { totalStudents: 0 },
      lessons: lessonsRes.data?.lessons ?? [],
      pendingStudents: pendingRes.data?.students ?? [],
      tracking: trackingRes.data?.tracking ?? [],
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

  const data = await fetchTeacherDashboard(token);
  if (!data) redirect('/login');
  const { stats, lessons, pendingStudents, tracking } = data;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight font-display">Faculty Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm font-bold uppercase tracking-widest leading-loose">Academic Administration & Analytics</p>
        </div>
        <Link href="/teacher/courses" className="btn-primary flex items-center gap-2 px-8">
          <Book className="w-5 h-5" /> ALL Courses
        </Link>
      </div>

      {searchParams.approved === '1' && (
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-[2rem] flex items-center gap-4 text-emerald-800 text-sm font-black uppercase tracking-widest">
          <UserCheck className="w-5 h-5" />
          Student approved successfully.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Curriculum" value={lessons.length} icon={Book} color="indigo" />
        <StatsCard label="Live Modules" value={lessons.filter((l: any) => l.isPublished).length} icon={CheckCircle} color="emerald" />
        <StatsCard label="Pending Approval" value={pendingStudents.length} icon={Clock} color="amber" />
        <StatsCard label="Enrolled Students" value={stats.totalStudents} icon={Users} color="rose" />
      </div>

      {/* Student Tracking */}
      <StudentTrackingSection initial={tracking} compact />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Pending Students */}
        <div className="xl:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight font-display">Student Admissions</h2>
              <span className="px-4 py-2 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                {pendingStudents.length} Pending
              </span>
            </div>

            {pendingStudents.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-soft">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="w-10 h-10 text-emerald-500 opacity-20" />
                </div>
                <p className="text-slate-600 font-black text-lg">Classroom is up to date.</p>
                <p className="text-slate-400 text-sm mt-1">No pending student approvals at the moment.</p>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="text-left px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Full Name</th>
                        <th className="text-left px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Email Address</th>
                        <th className="text-right px-8 py-5 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingStudents.map((student: any) => (
                        <tr key={student._id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <p className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{student.name}</p>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-slate-500 font-medium">{student.email}</p>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <Link
                              href={`/teacher/dashboard?approveStudentId=${student._id}`}
                              className="px-6 py-3 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
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

        <div className="xl:col-span-1 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight font-display">Recent Lessons</h2>
              <Link href="/teacher/courses" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-700">All Courses</Link>
            </div>

            {lessons.length === 0 ? (
              <div className="p-10 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">No modules created.</div>
            ) : (
              <div className="space-y-4">
                {lessons.slice(0, 6).map((lesson: any) => (
                  <div key={lesson._id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-soft hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${lesson.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {lesson.isPublished ? 'Live' : 'Draft'}
                      </span>
                      <Clock className="w-3 h-3 text-slate-200" />
                    </div>
                    <p className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{lesson.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {lesson.course?.title ?? 'Uncategorized'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
