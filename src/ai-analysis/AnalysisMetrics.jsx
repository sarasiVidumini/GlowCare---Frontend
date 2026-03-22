import React from 'react';
import { TrendingDown, Droplets, Sun, Sparkles, ChevronRight } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, description, colorClass }) => (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-3xl p-5 shadow-sm transition-all hover:scale-[1.02]">
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-white font-mono">{value}</span>
        </div>
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{description}</p>
    </div>
);

const AnalysisMetrics = ({ metrics, healthScore = 82 }) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">

            {/* --- Main Score Header --- */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-slate-900 dark:to-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black tracking-tight mb-2">Skin Health Score</h2>
                        <p className="text-blue-100/80 text-sm max-w-xs">
                            Based on high-resolution visual feature extraction and moisture retention analysis.
                        </p>
                    </div>

                    {/* Circular Score Visual */}
                    <div className="relative flex items-center justify-center w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                    strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * healthScore) / 100}
                                    className="text-white transition-all duration-1000 ease-out" strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-3xl font-black">{healthScore}</span>
                    </div>
                </div>

                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            </div>

            {/* --- Detailed Analysis Grid (Computer Vision Markers) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    icon={TrendingDown}
                    label="Acne & Lesions"
                    value="Low"
                    description="Detection scan shows minor inflammation in the T-zone area."
                    colorClass="bg-emerald-500 text-emerald-500"
                />
                <MetricCard
                    icon={Sun}
                    label="Pigmentation"
                    value="22%"
                    description="Mapping shows slight UV-induced unevenness on cheekbones."
                    colorClass="bg-amber-500 text-amber-500"
                />
                <MetricCard
                    icon={Droplets}
                    label="Texture Analysis"
                    value="Optimum"
                    description="High-res scan indicates well-hydrated lipid barrier."
                    colorClass="bg-blue-500 text-blue-500"
                />
            </div>

            {/* --- Action/Insight Footer --- */}
            <div className="bg-white/40 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-2xl">
                        <Sparkles className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-800 dark:text-white text-sm">Personalized Routine Ready</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Optimized for your current climate and skin condition.</p>
                    </div>
                </div>
                <button className="group flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:gap-4 active:scale-95 pointer-events-auto">
                    View Full Report
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default AnalysisMetrics;