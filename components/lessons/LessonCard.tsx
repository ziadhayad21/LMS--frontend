'use client';

import Link from 'next/link';
import { FileText, Play, Download, ChevronRight, Video, BookOpen } from 'lucide-react';

interface LessonCardProps {
  lesson: {
    _id: string;
    courseId?: string;
    course?: any; // Added to fix build error as it is accessed on line 25
    title: string;
    description?: string;
    videoUrl?: string;
    videoFile?: { filename: string };
    pdfFile?: { filename: string; originalName: string; size: number };
    createdAt?: string;
    level?: string;
  };
  mode?: 'student' | 'teacher';
}


export default function LessonCard({ lesson, mode = 'student' }: LessonCardProps) {
  // Extract courseId safely
  // Extract course ID safely from 'course' property
  const cid = (typeof lesson.course === 'object' && lesson.course !== null)
    ? (lesson.course as any)._id
    : (lesson as any).courseId || lesson.course;

  // IMPORTANT: The theater page is at /video, the info page is at /
  // We point to the theater page for the "Watch Video" button.
  const videoPath = mode === 'teacher'
    ? `/teacher/lessons/${lesson._id}/preview?courseId=${cid || ''}`
    : `/student/courses/${cid || 'general'}/lessons/${lesson._id}/video`;

  // Use the authenticated PDF endpoint so access rules apply (student level / teacher ownership)
  const pdfUrl =
    lesson.pdfFile?.filename && cid
      ? `/api/v1/courses/${cid}/lessons/${lesson._id}/pdf`
      : null;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium hover:shadow-premium hover:-translate-y-1.5 transition-all duration-500 overflow-hidden group">
      {/* Visual Header */}
      <div className="relative aspect-[21/9] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-primary-600 group-hover:border-primary-400 transition-all duration-500 z-20">
            <Play className="w-6 h-6 text-white ml-1 fill-white" />
          </div>
        </div>
        {/* Animated accent gradient */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100">
              {lesson.level || 'Academic'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Curriculum'}
          </span>
        </div>

        <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-primary-600 transition-colors tracking-tight font-display">
          {lesson.title}
        </h3>

        {lesson.description && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-8">
            {lesson.description}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Link
            href={videoPath}
            className="flex-1 bg-slate-900 hover:bg-primary-600 text-white text-[11px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Video className="w-4 h-4" /> Watch Lesson
          </Link>

          {pdfUrl && (
            <a
              href={`/pdf-viewer?url=${encodeURIComponent(pdfUrl)}&title=${encodeURIComponent(lesson.pdfFile?.originalName || 'Lesson PDF')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white hover:bg-rose-50 text-rose-500 border border-slate-200 hover:border-rose-100 rounded-2xl flex items-center justify-center transition-all group/pdf shadow-sm active:scale-95"
              title="Download Materials (PDF)"
            >
              <FileText className="w-6 h-6 group-hover/pdf:scale-110 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
