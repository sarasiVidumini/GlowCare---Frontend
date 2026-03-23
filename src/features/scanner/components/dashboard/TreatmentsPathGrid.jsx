import React from 'react';
import { Info } from 'lucide-react';

export default function TreatmentPathGrid({ isDark, pathData, suggestedPath, setSelectedTreatment }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(pathData).map((path) => (
                <button
                    key={path.id}
                    onClick={() => setSelectedTreatment(path)}
                    className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col justify-between overflow-hidden text-left ${isDark ? 'bg-white/[0.03] border-white/5 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500 shadow-xl'} ${suggestedPath === path.id ? `ring-2 ring-${path.color}-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]` : ''}`}
                >
                    <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-${path.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-${path.color}-500/20`}>
                            {React.cloneElement(path.icon, { size: 24, className: `text-${path.color}-500` })}
                        </div>
                        <h3 className="text-2xl font-black italic uppercase leading-tight mb-2 tracking-tighter">{path.t}</h3>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-4 text-${path.color}-500`}>{path.d}</p>
                        <p className="text-xs leading-relaxed opacity-60 font-medium">
                            {path.info}
                        </p>
                    </div>
                    <div className={`relative mt-6 z-10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest group-hover:text-${path.color}-500 transition-colors`}>
                        <Info size={14} /> View Details
                    </div>

                    {/* AI Recommended Badge */}
                    {suggestedPath === path.id && (
                        <div className={`absolute top-0 right-0 px-4 py-2 bg-${path.color}-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-2xl shadow-lg`}>
                            AI Recommended
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}