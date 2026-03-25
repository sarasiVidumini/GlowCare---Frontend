import React from 'react';

export default function StatCard({ label, value, icon, isDark }) {
    return (
        <div className={`p-7 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] ${
            isDark ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'
        }`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'} text-emerald-500`}>
                    {icon}
                </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">{label}</p>
            <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
        </div>
    );
}