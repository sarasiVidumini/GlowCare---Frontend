import React from 'react';

export default function ScoreCard({ isDark, healthScore }) {
    return (
        <div className={`p-8 rounded-[2.5rem] border flex flex-col justify-center items-center text-center ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">Skin Health Score</p>
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke={isDark ? "#ffffff10" : "#f1f5f9"} strokeWidth="4" />
                    <circle
                        cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="4"
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 - (282.7 * healthScore) / 100}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <span className="text-5xl font-black italic">{healthScore}</span>
            </div>
        </div>
    );
}