import React from 'react';
import { Sparkles, Clock } from 'lucide-react';

export default function RoutineHeader({ isDark, nextRoutine, path }) {
    return (
        <div className={`max-w-[1200px] mx-auto mb-8 p-6 rounded-[2rem] border flex flex-col md:flex-row items-center justify-between transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Sparkles size={20} className="text-emerald-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-black italic uppercase tracking-tight">
                        {path} <span className="text-emerald-500">Timeline.</span>
                    </h1>
                </div>
            </div>

            {/* 🚀 FIXED: DYNAMIC UPCOMING NOTIFICATION */}
            {nextRoutine ? (
                <div className={`mt-4 md:mt-0 flex items-center gap-3 px-5 py-3 rounded-2xl border ${isDark ? 'bg-black/50 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                    <Clock size={16} className="text-emerald-500 animate-pulse" />
                    <div>
                        <p className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Upcoming Step</p>
                        <p className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {nextRoutine.name} <span className="opacity-50 text-xs px-1">AT</span> {nextRoutine.stepTime}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mt-4 md:mt-0 text-[10px] font-black uppercase tracking-widest opacity-50">
                    No Routines Scheduled
                </div>
            )}
        </div>
    );
}