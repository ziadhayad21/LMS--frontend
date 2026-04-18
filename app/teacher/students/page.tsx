import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Users, Trash2, ShieldCheck, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Students Management',
  description: 'View and manage all enrolled students.',
};

import api from '@/src/api/axios';

async function fetchStudents(token: string) {
  try {
    const res: any = await api.get('/auth/students', {
      headers: { Cookie: `jwt=${token}` },
    });
    return res.data?.students || res.students || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return []; // Return empty array instead of null to prevent redirect loop
  }
}

async function deleteStudentAction(token: string, studentId: string) {
  try {
    await api.delete(`/auth/students/${studentId}`, {
      headers: { Cookie: `jwt=${token}` },
    });
  } catch (error) {
    console.error('Failed to delete student:', error);
  }
}

export default async function StudentsManagementPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const token = cookies().get('jwt')?.value;
  if (!token) redirect('/login');

  if (searchParams.deleteId) {
    await deleteStudentAction(token, searchParams.deleteId);
    redirect('/teacher/students?deleted=1');
  }

  const students = await fetchStudents(token);
  if (!students) redirect('/login');

  return (
    <div className="space-y-10 animate-fade-in pb-20 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight font-display">Student Records</h1>
          <p className="text-slate-400 mt-1 text-sm font-bold uppercase tracking-widest leading-loose">
            Manage your academic community
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-5 py-2 bg-primary-50 text-primary-700 text-xs font-black uppercase tracking-widest rounded-full border border-primary-100">
            {students.length} Total Students
          </span>
        </div>
      </div>

      {searchParams.deleted === '1' && (
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-[2rem] flex items-center gap-4 text-rose-800 text-sm font-black uppercase tracking-widest animate-in slide-in-from-top duration-500">
          <Trash2 className="w-5 h-5 text-rose-500" />
          Student record removed successfully.
        </div>
      )}

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="text-left px-10 py-6 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Student</th>
                <th className="text-left px-10 py-6 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Registration</th>
                <th className="text-left px-10 py-6 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="text-right px-10 py-6 font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Administrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student: any) => (
                <tr key={student._id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm transition-transform group-hover:rotate-6">
                        {student.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg">{student.name}</p>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail className="w-3 h-3" />
                          <span className="text-xs font-medium">{student.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      <span className="font-bold">{new Date(student.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      student.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <Link
                      href={`/teacher/students?deleteId=${student._id}`}
                      className="inline-flex items-center justify-center w-12 h-12 bg-white hover:bg-rose-50 text-slate-300 hover:text-rose-500 border border-slate-100 hover:border-rose-100 rounded-2xl transition-all shadow-sm active:scale-90 group/btn"
                      onClick={(e) => {
                         if(!confirm('Are you absolutely sure you want to delete this student and all their data?')) {
                           e.preventDefault();
                         }
                      }}
                    >
                      <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {students.length === 0 && (
        <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-premium">
           <Users className="w-20 h-20 text-slate-200 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-slate-900">No Students Found</h3>
           <p className="text-slate-400 mt-2">When students register, they will appear here for management.</p>
        </div>
      )}
    </div>
  );
}
