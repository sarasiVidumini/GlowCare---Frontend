import React from 'react';
import { X, Search, Trash2, User } from 'lucide-react';

export default function ExpertListModal({
                                            isDark,
                                            showExpertsModal,
                                            setShowExpertsModal,
                                            isAdmin,
                                            expertSearch,
                                            setExpertSearch,
                                            filteredExperts,
                                            openPrivateChat,
                                            deleteExpert
                                        }) {
    if (!showExpertsModal) return null;

    // Safety Check - Ensure filteredExperts exists before mapping
    const expertsToRender = filteredExperts || [];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[2000] flex items-center justify-center p-4">
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] border flex flex-col transition-all duration-500 ${isDark ? 'bg-[#0F0F12]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-2xl'}`}>

                {/* Header Section */}
                <div className="p-8 pb-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black italic uppercase text-emerald-500">Expert Panel.</h2>
                        <div className="flex gap-3">
                            {/* NOTE: "Add Expert" button removed. Experts now appear automatically upon signup. */}
                            <button
                                onClick={() => setShowExpertsModal(false)}
                                className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-500'}`}
                            >
                                <X />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border mb-4 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <Search size={18} className="text-emerald-500" />
                        <input
                            type="text"
                            placeholder="Search by specialty or clinical focus..."
                            className="bg-transparent outline-none w-full text-sm font-bold"
                            value={expertSearch || ""}
                            onChange={(e) => setExpertSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* List Section */}
                <div className="flex-1 overflow-y-auto p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 no-scrollbar">
                    {expertsToRender.length > 0 ? (
                        expertsToRender.map((exp) => (
                            <div key={exp.id} className={`group relative p-6 rounded-3xl border transition-all ${isDark ? 'bg-white/[0.03] border-white/5 hover:border-emerald-500/30' : 'bg-slate-50 border-slate-100 hover:shadow-xl'}`}>

                                {/* Admin Actions: Delete Only */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => deleteExpert(exp.id)}
                                            className="p-2 rounded-lg bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                            title="Revoke Expert Access"
                                        >
                                            <Trash2 size={12}/>
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <User size={18} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black italic uppercase leading-none">
                                            {exp.fullName || "Anonymous Expert"}
                                        </h4>
                                        <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mt-1">
                                            {exp.expertiseArea || "General Consultant"}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-[11px] opacity-60 leading-relaxed mb-6 line-clamp-3 min-h-[3rem]">
                                    {exp.bio || "This expert is a verified GlowCare clinical partner specialized in skincare safety."}
                                </p>

                                <button
                                    onClick={() => openPrivateChat(exp)}
                                    className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-black uppercase text-[9px] tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                                >
                                    Message Expert
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center opacity-30 font-black uppercase text-xs tracking-[0.2em]">
                            Waiting for Clinical Onboarding...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}