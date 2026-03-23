import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function DashboardHeader() {
    return (
        <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <BarChart3 size={12} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Diagnostic Complete</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight">Objective <span className="text-emerald-500">Baseline.</span></h1>
        </div>
    );
}