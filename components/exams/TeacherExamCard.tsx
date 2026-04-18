import Link from 'next/link';
import { CalendarClock, CheckCircle2, Pencil, FileText } from 'lucide-react';
import type { Exam } from '@/types';

function fmt(dt?: string) {
  if (!dt) return null;
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString();
}

export default function TeacherExamCard({ exam }: { exam: Exam & { course?: any; questionCount?: number } }) {
  const schedule =
    fmt(exam.availableFrom) || fmt(exam.availableUntil)
      ? `${fmt(exam.availableFrom) ?? '—'} → ${fmt(exam.availableUntil) ?? '—'}`
      : null;

  const manageHref = exam.course?._id
    ? `/teacher/courses/${exam.course._id}/exams/${exam._id}`
    : `/teacher/exams/${exam._id}`;

  return (
    <div className="bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-premium hover:shadow-xl transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
          <FileText className="w-6 h-6 text-amber-600" />
        </div>
        {exam.isPublished ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" /> Published
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200">
            Draft
          </span>
        )}
      </div>

      <div className="mt-5 space-y-2">
        <h3 className="text-lg font-black text-slate-800 tracking-tight line-clamp-2">{exam.title}</h3>
        <p className="text-sm text-slate-500 font-medium line-clamp-2">{exam.description || '—'}</p>
      </div>

      <div className="mt-5 space-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="badge-slate">{exam.level || 'No level'}</span>
          {exam.course?.title ? <span className="badge-blue">{exam.course.title}</span> : null}
          {typeof (exam as any).questionCount === 'number' ? (
            <span className="badge-slate">{(exam as any).questionCount} Q</span>
          ) : null}
        </div>
        {schedule ? (
          <div className="flex items-center gap-2">
            <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{schedule}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex gap-2">
        <Link href={manageHref} className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2">
          <Pencil className="w-4 h-4" /> Manage
        </Link>
      </div>
    </div>
  );
}

