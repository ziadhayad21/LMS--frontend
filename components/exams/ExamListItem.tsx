import Link from 'next/link';
import type { Exam } from '@/types';

interface Props {
  courseId: string;
  exam: Exam;
  attemptCount?: number;
  href?: string;
}

export default function ExamListItem({ courseId, exam, attemptCount = 0, href }: Props) {
  const maxAttempts = exam.maxAttempts ?? 1;
  const attemptsUsedUp = maxAttempts !== -1 && attemptCount >= maxAttempts;
  const now = new Date();
  const startsAt = exam.availableFrom ? new Date(exam.availableFrom) : null;
  const endsAt = exam.availableUntil ? new Date(exam.availableUntil) : null;

  const notStarted = !!(startsAt && !Number.isNaN(startsAt.getTime()) && now < startsAt);
  const ended = !!(endsAt && !Number.isNaN(endsAt.getTime()) && now > endsAt);
  const timeLocked = notStarted || ended;

  const disabled = attemptsUsedUp || timeLocked;

  const statusText =
    attemptsUsedUp ? 'Submitted' :
    ended ? 'Closed' :
    notStarted ? 'Scheduled' :
    'Take Exam';

  const helperText =
    ended ? 'Exam window ended' :
    notStarted ? `Starts ${startsAt?.toLocaleString?.() ?? ''}` :
    null;

  return (
    <Link
      href={href ?? `/student/courses/${courseId}/exams/${exam._id}`}
      aria-disabled={disabled}
      className={`card p-4 flex items-center gap-4 transition-colors group ${
        disabled ? 'opacity-60 pointer-events-none' : 'hover:border-primary-200'
      }`}
    >
      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
        <span className="text-lg">📝</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 text-sm truncate">{exam.title}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
          <span>Passing: {exam.passingScore}%</span>
          {exam.timeLimit ? <span>⏱ {exam.timeLimit} min</span> : null}
          <span>
            Max {maxAttempts === -1 ? 'Unlimited' : maxAttempts} attempt{maxAttempts === 1 ? '' : 's'}
          </span>
          {attemptCount > 0 ? <span>Completed: {attemptCount}x</span> : null}
          {helperText ? <span className="text-slate-500 font-semibold">{helperText}</span> : null}
        </div>
      </div>

      <span className="btn-primary text-xs px-3 py-1.5">
        {statusText}
      </span>
    </Link>
  );
}

