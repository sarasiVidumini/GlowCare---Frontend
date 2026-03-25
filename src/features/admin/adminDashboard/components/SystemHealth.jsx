import React from 'react';

/**
 * SystemHealth Component
 * Displays the current database/system integrity percentage.
 * * @param {number} efficiency - The percentage value from the backend (0-100)
 * @param {boolean} isDark - Current theme state
 */
export default function SystemHealth({ efficiency, isDark }) {
    return (
        <div className={`p-8 rounded-[3rem] border transition-all duration-500 ${
            isDark
                ? 'bg-white/5 border-white/10 shadow-2xl backdrop-blur-md'
                : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'
        }`}>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                Integrity Check
            </span>

            <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-black italic tracking-tighter">
                    {efficiency || 0}%
                </span>
                <span className="text-emerald-500 font-bold mb-2 text-[10px] uppercase tracking-wider">
                    ↑ Stable
                </span>
            </div>

            {/* Visual Progress Bar */}
            <div className={`mt-6 w-full h-2 rounded-full overflow-hidden ${
                isDark ? 'bg-white/10' : 'bg-slate-100'
            }`}>
                <div
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${efficiency || 0}%` }}
                />
            </div>

            <p className="mt-4 text-[9px] font-medium opacity-30 uppercase tracking-[0.1em]">
                Neural Latency: Optimized
            </p>
        </div>
    );
}