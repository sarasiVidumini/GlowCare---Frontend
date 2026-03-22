import React from 'react';
import { Zap, Clock } from 'lucide-react';

export default function RoutineHeader({ isDark, nextRoutine, path }) {
    return (
        <div className="max-w-[1200px] mx-auto mb-8 relative z-[100]">
            <div className={`group flex flex-col md:flex-row items-center justify-between p-1 rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 hover:scale-[1.01] ${isDark ? 'bg-white/5 border-white/10 shadow-2xl shadow-emerald-500/10' : 'bg-white/80 border-slate-200 shadow-xl shadow-slate-200/50'}`}>
                <div className="flex items-center gap-4 p-3 pl-6">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                            <Zap className="text-emerald-500 animate-pulse" size={20} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#050505] animate-bounce" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-tighter text-emerald-500">Live Routine Feed</h4>
                        <p className="text-sm font-black italic uppercase leading-none">
                            {nextRoutine ? `Next: ${nextRoutine.name}` : "No more tasks today"}
                            <span className="ml-2 text-[9px] opacity-40 lowercase font-medium">at {nextRoutine?.stepTime || '--'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 pr-2 pb-2 md:pb-0">
                    {nextRoutine && (
                        <div className={`px-5 py-3 rounded-2xl flex items-center gap-3 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <Clock size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase italic">Starts in {Math.floor(nextRoutine.diff / 60000)}m</span>
                        </div>
                    )}
                    <div className="px-6 py-3 bg-emerald-500 rounded-2xl text-black flex items-center gap-3">
                        <div className="w-2 h-2 bg-black rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{path} Path</span>
                    </div>
                </div>
            </div>
        </div>
    );
}