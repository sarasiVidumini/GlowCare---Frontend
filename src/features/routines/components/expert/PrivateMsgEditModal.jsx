import React from 'react';
import { Edit3, X, ShieldCheck } from 'lucide-react';

export default function PrivateMsgEditModal({ isDark, pEditModal, setPEditModal, savePrivateEdit }) {
    if (!pEditModal || !pEditModal.open) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[6000] flex items-center justify-center p-4">
            <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border transition-all duration-500 scale-in-center ${
                isDark
                    ? 'bg-[#141417] border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)]'
                    : 'bg-white border-slate-200 shadow-2xl'
            }`}>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <Edit3 size={18} className="text-emerald-500" />
                        </div>
                        <div>
                            <h4 className={`text-sm font-black italic uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Refine Message
                            </h4>
                            <p className="text-[8px] font-black uppercase text-emerald-500 tracking-widest opacity-60">
                                Secure Protocol
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setPEditModal({ open: false, id: null, text: "" })}
                        className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="relative mb-6">
                    <textarea
                        value={pEditModal.text || ""}
                        onChange={(e) => setPEditModal({ ...pEditModal, text: e.target.value })}
                        placeholder="Modify clinical inquiry..."
                        className={`w-full p-5 rounded-3xl border bg-transparent text-sm font-bold h-40 outline-none resize-none transition-all duration-300 ${
                            isDark
                                ? 'border-white/5 text-white focus:border-emerald-500/50 bg-white/[0.02]'
                                : 'border-slate-200 text-slate-900 focus:border-emerald-500/30 bg-slate-50/50'
                        }`}
                    />
                    <div className="absolute bottom-4 right-4 opacity-20">
                        <ShieldCheck size={14} className={isDark ? 'text-white' : 'text-slate-900'} />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setPEditModal({ open: false, id: null, text: "" })}
                        className={`flex-1 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            isDark
                                ? 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                        }`}
                    >
                        Discard
                    </button>
                    <button
                        onClick={savePrivateEdit}
                        className="flex-1 p-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Save Sync
                    </button>
                </div>
            </div>
        </div>
    );
}