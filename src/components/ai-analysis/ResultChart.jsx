import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingDown, Zap, Calendar, ArrowUpRight } from 'lucide-react';

const ResultChart = ({ data, stats }) => {
    // Mock data representing the 6-month journey mentioned in your docs
    const chartData = data || [
        { month: 'Mar', score: 45 },
        { month: 'Apr', score: 52 },
        { month: 'May', score: 48 },
        { month: 'Jun', score: 61 },
        { month: 'Jul', score: 74 },
        { month: 'Aug', score: 82 },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in p-2">

            {/* --- Analytical Comparison Tiles --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-3xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Redness Reduction</p>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">25.4%</h3>
                        <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/60 mt-1 flex items-center gap-1">
                            <TrendingDown size={12} /> Significant improvement since March
                        </p>
                    </div>
                    <div className="bg-emerald-500/20 p-3 rounded-2xl">
                        <Zap className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-3xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Moisture Retention</p>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">+18.2%</h3>
                        <p className="text-[10px] text-blue-600/80 dark:text-blue-400/60 mt-1 flex items-center gap-1">
                            <ArrowUpRight size={12} /> Improved epidermal barrier
                        </p>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-2xl">
                        <Calendar className="text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </div>

            {/* --- Main Visual Analytics Chart --- */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">6-Month Visual Analytics</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Quantifiable Skin Health Progression</p>
                    </div>
                    <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                        {['Score', 'Texture', 'UV'].map((tab) => (
                            <button key={tab} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${tab === 'Score' ? 'bg-white dark:bg-blue-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-white/5" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: 'none',
                                    borderRadius: '16px',
                                    color: '#fff',
                                    fontSize: '12px'
                                }}
                                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#3b82f6"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorScore)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-[11px] text-slate-400 uppercase font-bold tracking-[0.2em]">
                    <span>Baseline: March 2026</span>
                    <span className="text-blue-500">Current: August 2026</span>
                </div>
            </div>
        </div>
    );
};

export default ResultChart;