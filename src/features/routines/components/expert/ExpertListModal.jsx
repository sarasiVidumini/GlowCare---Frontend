import React from 'react';
import { X, Search, Edit3, Trash2 } from 'lucide-react';

export default function ExpertListModal({
                                            isDark, showExpertsModal, setShowExpertsModal, isAdmin, setExpertEditModal,
                                            expertSearch, setExpertSearch, filteredExperts, openPrivateChat, deleteExpert, experts
                                        }) {
    if (!showExpertsModal) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[2000] flex items-center justify-center p-4">
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] border flex flex-col transition-all duration-500 ${isDark ? 'bg-[#0F0F12]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-2xl'}`}>
                <div className="p-8 pb-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black italic uppercase text-emerald-500">Expert Panel.</h2>
                        <div className="flex gap-3">
                            {isAdmin && (
                                <button onClick={() => setExpertEditModal({ open: true, index: null, name: "", role: "", bio: "" })} className="p-3 bg-emerald-500 rounded-xl text-black font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20">Add Expert</button>
                            )}
                            <button onClick={() => setShowExpertsModal(false)} className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-500'}`}><X /></button>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border mb-4 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <Search size={18} className="text-emerald-500" />
                        <input
                            type="text"
                            placeholder="Search by name or role..."
                            className="bg-transparent outline-none w-full text-sm font-bold"
                            value={expertSearch}
                            onChange={(e) => setExpertSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 no-scrollbar">
                    {filteredExperts.map((exp) => {
                        const realIdx = experts.findIndex(e => e.id === exp.id);
                        return (
                            <div key={exp.id} className={`group relative p-6 rounded-3xl border transition-all ${isDark ? 'bg-white/[0.03] border-white/5 hover:border-emerald-500/30' : 'bg-slate-50 border-slate-100 hover:shadow-xl'}`}>
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => setExpertEditModal({ open: true, index: realIdx, name: exp.name, role: exp.role, bio: exp.bio })} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500"><Edit3 size={12}/></button>
                                        <button onClick={() => deleteExpert(realIdx)} className="p-2 rounded-lg bg-rose-500/20 text-rose-500"><Trash2 size={12}/></button>
                                    </div>
                                )}
                                <h4 className="text-lg font-black italic uppercase">{exp.name}</h4>
                                <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-3">{exp.role}</p>
                                <p className="text-[11px] opacity-60 leading-relaxed mb-5 line-clamp-2">{exp.bio}</p>
                                <button onClick={() => openPrivateChat(exp)} className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-black uppercase text-[9px] tracking-widest hover:bg-emerald-500 hover:text-black transition-all">Message Expert</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}