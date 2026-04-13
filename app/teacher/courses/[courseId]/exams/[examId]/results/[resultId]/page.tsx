import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import api from '@/src/api/axios';

interface Props { params: { courseId: string; examId: string; resultId: string } }

export const metadata: Metadata = { title: 'Submission Details' };

async function fetchResult(resultId: string, token: string) {
    try {
        const res: any = await api.get(`/results/${resultId}`, {
            headers: { Cookie: `jwt=${token}` },
        });
        return res.data?.result ?? null;
    } catch (error) {
        return null;
    }
}

export default async function TeacherResultDetailPage({ params }: Props) {
    const token = cookies().get('jwt')?.value ?? '';
    const result = await fetchResult(params.resultId, token);

    if (!result) notFound();

    const { exam, student, answers } = result;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            <div>
                <Link href={`/teacher/courses/${params.courseId}/exams/${params.examId}/results`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                    ← Back to Results
                </Link>
                <div className="flex items-center justify-between mt-2">
                    <div>
                        <h1 className="page-title">{student.name}&apos;s Submission</h1>
                        <p className="text-slate-500 font-medium">Exam: {exam.title}</p>
                    </div>
                    <div className={`px-6 py-4 rounded-[1.5rem] border ${result.passed ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'} text-center`}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{result.passed ? 'PASSED' : 'FAILED'}</p>
                        <p className="text-3xl font-black">{result.score}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card p-5 bg-white border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Correct</p>
                    <p className="text-xl font-bold text-slate-800">{result.correctAnswers}/{result.totalQuestions}</p>
                </div>
                <div className="card p-5 bg-white border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Points</p>
                    <p className="text-xl font-bold text-slate-800">{result.earnedPoints}/{result.totalPoints}</p>
                </div>
                <div className="card p-5 bg-white border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time taken</p>
                    <p className="text-xl font-bold text-slate-800">{Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s</p>
                </div>
                <div className="card p-5 bg-white border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Attempt</p>
                    <p className="text-xl font-bold text-slate-800">#{result.attemptNumber}</p>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="section-title">Question Breakdown</h2>
                {exam.questions.map((q: any, idx: number) => {
                    const studentAnswer = answers.find((a: any) => a.questionId === q._id);
                    const isCorrect = studentAnswer?.isCorrect;

                    return (
                        <div key={q._id} className={`card p-6 border-slate-100 space-y-4 ${!isCorrect ? 'ring-1 ring-red-100 bg-red-50/10' : ''}`}>
                            <div className="flex items-start gap-4">
                                <span className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                    {idx + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="text-lg font-bold text-slate-800 pt-0.5">{q.questionText}</p>
                                    <p className={`text-xs mt-1 font-black uppercase tracking-widest ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {isCorrect ? '✓ Correct Answer' : '✕ Wrong Answer'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
                                {q.options.map((opt: string, oi: number) => {
                                    const isSelected = studentAnswer?.selectedOptionIndex === oi;
                                    const isRight = q.correctOptionIndex === oi;

                                    let borderClass = 'border-slate-100 bg-white text-slate-500';
                                    if (isSelected && isRight) borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-1 ring-emerald-500';
                                    else if (isSelected && !isRight) borderClass = 'border-rose-500 bg-rose-50 text-rose-800 font-bold ring-1 ring-rose-500';
                                    else if (isRight) borderClass = 'border-emerald-200 bg-emerald-50/50 text-emerald-700';

                                    return (
                                        <div key={oi} className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${borderClass}`}>
                                            <span><span className="mr-2 opacity-40">{['A', 'B', 'C', 'D', 'E', 'F'][oi]}.</span> {opt}</span>
                                            {isSelected && <span className="text-[10px] font-black ml-2 uppercase tracking-tighter">{isRight ? 'Your Pick' : 'Mistake'}</span>}
                                        </div>
                                    );
                                })}
                            </div>

                            {q.explanation && (
                                <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-sm text-indigo-700 italic">
                                    <span className="font-bold not-italic">Teacher Tip:</span> {q.explanation}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
