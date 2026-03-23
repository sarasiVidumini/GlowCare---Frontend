import React from 'react';
import { X, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TreatmentInfoModal({ isDark, treatment, onClose, onProceed }) {
    if (!treatment) return null;

    return (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className={`relative w-full max-w-2xl p-8 md:p-10 rounded-[3rem] border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0c0c0d] border-white/10' : 'bg-white border-slate-200'}`}>

                {/* Close Button */}
                <button onClick={onClose} className={`absolute top-6 right-6 p-2.5 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-5 mb-8">
                    <div className={`p-4 rounded-2xl bg-${treatment.color}-500/10 border border-${treatment.color}-500/20 text-${treatment.color}-500 shadow-inner`}>
                        {React.cloneElement(treatment.icon, { size: 32 })}
                    </div>
                    <div>
                        <h2 className={`text-3xl font-black italic uppercase tracking-tighter leading-none text-${treatment.color}-500`}>
                            {treatment.t} Pathway
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mt-1">{treatment.d}</p>
                    </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-6 mb-10">
                    <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {treatment.longInfo}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Benefits Box */}
                        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-3">
                                <CheckCircle2 size={14} /> Expected Benefits
                            </h4>
                            <ul className="space-y-2 text-xs font-bold opacity-80 list-disc pl-4">
                                {treatment.benefits.map((benefit, idx) => (
                                    <li key={idx}>{benefit}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Clinical Notes / Warnings Box */}
                        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-amber-950/20 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">
                                <AlertTriangle size={14} /> Clinical Notes
                            </h4>
                            <ul className="space-y-2 text-xs font-bold opacity-80 list-disc pl-4">
                                {treatment.warnings.map((warning, idx) => (
                                    <li key={idx}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-dashed border-slate-500/30">
                    <div className="flex items-center gap-2 opacity-50">
                        <ShieldCheck size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Verified by GlowCare Experts</span>
                    </div>
                    <button
                        onClick={() => onProceed(treatment.id)}
                        className={`w-full sm:w-auto py-4 px-8 bg-${treatment.color}-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-${treatment.color}-500/20`}
                    >
                        Initialize Timeline <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}