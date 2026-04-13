import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import ExamBuilder from '@/components/exam/ExamBuilder';
import api from '@/src/api/axios';

interface Props { params: { courseId: string; examId: string } }

export const metadata: Metadata = { title: 'Exam Editor' };

async function fetchExam(courseId: string, examId: string, token: string) {
    try {
        const res: any = await api.get(`/courses/${courseId}/exams/${examId}/full`, {
            headers: { Cookie: `jwt=${token}` },
        });
        return res.data?.exam ?? null;
    } catch (error) {
        return null;
    }
}

export default async function TeacherExamEditPage({ params }: Props) {
    const token = cookies().get('jwt')?.value ?? '';
    const exam = await fetchExam(params.courseId, params.examId, token);

    if (!exam) notFound();

    // If already published, show details/results only as requested by user 
    // "After upload, can only see details"
    if (exam.isPublished) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
                <div>
                    <Link href={`/teacher/courses/${params.courseId}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                        ← Back to Course
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                        <h1 className="page-title">{exam.title}</h1>
                        <Link
                            href={`/teacher/courses/${params.courseId}/exams/${params.examId}/results`}
                            className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-indigo-200 transition-all"
                        >
                            View Student Grades
                        </Link>
                    </div>
                    <p className="text-slate-500 mt-2">{exam.description || 'No description provided.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card p-6 bg-slate-50 border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time Limit</p>
                        <p className="text-xl font-bold text-slate-800">{exam.timeLimit ? `${exam.timeLimit} mins` : 'Unlimited'}</p>
                    </div>
                    <div className="card p-6 bg-slate-50 border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Passing Score</p>
                        <p className="text-xl font-bold text-slate-800">{exam.passingScore}%</p>
                    </div>
                    <div className="card p-6 bg-slate-50 border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Questions</p>
                        <p className="text-xl font-bold text-slate-800">{exam.questions?.length || 0}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="section-title">Exam Preview (Read-Only)</h2>
                    {exam.questions.map((q: any, idx: number) => (
                        <div key={idx} className="card p-6 border-slate-100 space-y-4">
                            <div className="flex items-start gap-4">
                                <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                </span>
                                <p className="text-lg font-bold text-slate-800 pt-0.5">{q.questionText}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
                                {q.options.map((opt: string, oi: number) => (
                                    <div key={oi} className={`p-4 rounded-2xl border transition-all ${q.correctOptionIndex === oi
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-bold'
                                            : 'border-slate-100 bg-slate-50 text-slate-500'
                                        }`}>
                                        <span className="mr-2 opacity-40">{['A', 'B', 'C', 'D', 'E', 'F'][oi]}.</span> {opt}
                                    </div>
                                ))}
                            </div>
                            {q.explanation && (
                                <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-sm text-indigo-700 italic">
                                    <span className="font-bold not-italic">Explanation:</span> {q.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Not published yet? Allow editing!
    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-20">
            <div>
                <Link href={`/teacher/courses/${params.courseId}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                    ← Back to Course
                </Link>
                <h1 className="page-title mt-2">Edit Draft Exam</h1>
                <p className="text-slate-500 text-sm mt-1">Modify your draft assessment before sharing it with students.</p>
            </div>
            <ExamBuilder courseId={params.courseId} initialData={exam} />
        </div>
    );
}
