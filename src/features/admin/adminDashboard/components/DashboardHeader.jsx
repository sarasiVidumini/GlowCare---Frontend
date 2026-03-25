import React from 'react';

export default function DashboardHeader() {
    return (
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Nexus Command</h1>
                <div className="flex items-center gap-4 mt-4">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        System: Operational
                    </span>
                    <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">GlowCare OS v2.4.0</span>
                </div>
            </div>
            <div className="text-right hidden md:block">
                <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">Last Neural Sync</p>
                <p className="text-sm font-bold tabular-nums">{new Date().toLocaleTimeString()}</p>
            </div>
        </header>
    );
}