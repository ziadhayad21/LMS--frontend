'use client';

import { useState, useEffect } from 'react';
import { Trophy, Award, Star, TrendingUp, Medal, Users } from 'lucide-react';
import api from '@/src/api/axios';

export default function SuccessBoardPage() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/results/leaderboard')
            .then(res => setLeaderboard(res.data.leaderboard))
            .catch(err => setError('Failed to load the Hall of Fame.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <div className="relative p-12 bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />

                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <Trophy className="w-3 h-3" /> Hall of Fame
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight font-display mb-4">Success Board</h1>
                    <p className="text-slate-400 text-lg">Celebrating the top performers of this academic year. Will you be next?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top 3 Podium */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    {leaderboard.slice(0, 3).map((student, index) => {
                        const positions = [
                            { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', size: 'h-80', label: '1st Place' },
                            { color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/20', size: 'h-64', label: '2nd Place' },
                            { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', size: 'h-52', label: '3rd Place' }
                        ];
                        // Order for podium: 2nd, 1st, 3rd
                        const orderIndex = index === 0 ? 1 : index === 1 ? 0 : 2;
                        const item = leaderboard[orderIndex];
                        if (!item) return null;
                        const pos = positions[orderIndex];

                        return (
                            <div key={item._id} className={`relative flex flex-col items-center p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-soft transform transition-all hover:-translate-y-2 duration-500 ${orderIndex === 0 ? 'md:order-2 shadow-2xl' : index === 1 ? 'md:order-1' : 'md:order-3'}`}>
                                <div className={`w-20 h-20 rounded-3xl overflow-hidden mb-4 border-4 ${pos.border} shadow-lg`}>
                                    {item.avatar ? (
                                        <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full ${pos.bg} flex items-center justify-center text-3xl`}>🎓</div>
                                    )}
                                </div>
                                <div className={`text-[10px] font-black uppercase tracking-widest ${pos.color} mb-1`}>{pos.label}</div>
                                <h3 className="font-black text-slate-800 text-center line-clamp-1">{item.name}</h3>
                                <div className="mt-4 flex flex-col items-center">
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{item.avgScore}%</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Average Score</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl shadow-indigo-500/20">
                    <div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                            <Star className="w-6 h-6 text-indigo-200" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-2">My Standing</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed opacity-80">Track your performance compared to the elite group.</p>
                    </div>
                    <div className="mt-12 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest">Global Rank</span>
                            <span className="font-mono font-bold text-xl">#??</span>
                        </div>
                        <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest text-center opacity-60">Complete more exams to unlock rank</p>
                    </div>
                </div>
            </div>

            {/* Full Leaderboard List */}
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-soft overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Top Students</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Full Ranking Table</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-16">Rank</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exams</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Avg Score</th>
                                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {leaderboard.map((student, index) => (
                                <tr key={student._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-6 font-mono font-bold text-slate-400">#{index + 1}</td>
                                    <td className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg shadow-sm border border-white shrink-0">
                                                {student.avatar ? <img src={student.avatar} className="w-full h-full object-cover rounded-xl" /> : '👨‍🎓'}
                                            </div>
                                            <span className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">{student.totalExams} Taken</span>
                                    </td>
                                    <td className="py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-800">{student.avgScore}%</span>
                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${student.avgScore}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 text-right">
                                        <span className="text-sm font-black text-slate-900">{student.totalPoints.toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {leaderboard.length === 0 && (
                        <div className="p-20 text-center text-slate-400 italic">
                            Competition is just heating up. No records found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
