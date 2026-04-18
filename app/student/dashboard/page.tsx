import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import RecentResults from '@/components/dashboard/RecentResults';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Track your English learning progress, completed lessons, and exam scores.',
};

import api from '@/src/api/axios';

async function fetchDashboardData(token: string) {
  try {
    const [progressRes, resultsRes, userRes]: any = await Promise.all([
      api.get('/progress/overview', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/results/my', { headers: { Cookie: `jwt=${token}` } }),
      api.get('/auth/me', { headers: { Cookie: `jwt=${token}` } }),
    ]);

    return {
      progresses: progressRes.data?.progresses ?? [],
      results: resultsRes.data?.results ?? [],
      user: userRes.data?.user ?? null,
    };
  } catch (error) {
    return { progresses: [], results: [], user: null };
  }
}


import { Book, CheckCircle, Video, Trophy, ArrowRight } from 'lucide-react';

export default async function StudentDashboard() {
  const cookieStore = cookies();
  const token = cookieStore.get('jwt')?.value;
  if (!token) redirect('/login');




  const { progresses, results, user } = await fetchDashboardData(token);

  const totalCourses = progresses.length;
  const completedCourses = progresses.filter((p: any) => p.isCompleted).length;
  const totalLessons = progresses.reduce((acc: number, p: any) => acc + (p.completedLessons?.length ?? 0), 0);
  const avgScore = results.length
    ? Math.round(results.reduce((acc: number, r: any) => acc + r.score, 0) / results.length)
    : 0;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight font-display">Student Portal</h1>
            {user?.level && (
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-black rounded-full border border-brand-100 shadow-sm">
                {user.level}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            Welcome back, <span className="text-slate-600">{user?.name}</span>
          </p>
        </div>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Enrolled Courses" value={totalCourses} icon={Book} color="indigo" />
        <StatsCard label="Achievements" value={completedCourses} icon={Trophy} color="emerald" />
        <StatsCard label="Lessons Viewed" value={totalLessons} icon={Video} color="rose" />
        <StatsCard label="Avg Performance" value={`${avgScore}%`} icon={CheckCircle} color="amber" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <ProgressChart progresses={progresses} />

          <section>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-black text-slate-800 tracking-tight font-display">Active Curriculum</h2>
              <Link href="/student/courses" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:text-indigo-700 transition-colors flex items-center gap-1.5">
                View All Courses <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {progresses.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-premium">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Book className="w-10 h-10 text-indigo-500 opacity-20" />
                </div>
                <p className="text-slate-600 font-black text-lg">Your desk is currently empty.</p>
                <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Enroll in a course to start your linguistic journey.</p>
                <Link href="/student/courses" className="btn-primary mt-8">
                  Explore Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {progresses.map((p: any) => (
                  <div key={p._id} className="bg-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border border-slate-100 shadow-premium hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                      <Book className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <p className="font-black text-slate-800 truncate text-base leading-none mb-3 group-hover:text-indigo-600 transition-colors">
                        {p.course?.title}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <span>{p.completedLessons?.length || 0} Lessons Complete</span>
                        <span>•</span>
                        <span>{p.course?.level || 'Academic'}</span>
                      </div>
                    </div>
                    <Link
                      href={`/student/courses/${p.course?._id}`}
                      className="btn-primary py-2.5 px-6 text-[10px] flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      <Video className="w-3.5 h-3.5" /> Continue
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="xl:col-span-1">
          <RecentResults results={results.slice(0, 6)} />
        </div>
      </div>
    </div>
  );
}
