import React from 'react';

export default function ExpertFormModal({ isDark, expertEditModal, setExpertEditModal, saveExpertUpdate }) {
    if (!expertEditModal.open) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-[4000] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#141417] border-white/10' : 'bg-white shadow-2xl'}`}>
                <h4 className="text-xl font-black italic uppercase mb-6 text-emerald-500 text-center">
                    {expertEditModal.index !== null ? 'Edit Expert' : 'New Expert'}
                </h4>
                <div className="space-y-4">
                    <input value={expertEditModal.name} onChange={(e) => setExpertEditModal({...expertEditModal, name: e.target.value})} placeholder="Expert Name" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                    <input value={expertEditModal.role} onChange={(e) => setExpertEditModal({...expertEditModal, role: e.target.value})} placeholder="Specialty" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                    <textarea value={expertEditModal.bio} onChange={(e) => setExpertEditModal({...expertEditModal, bio: e.target.value})} placeholder="Expert Bio" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold h-24 outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                </div>
                <div className="flex gap-4 mt-8">
                    <button onClick={() => setExpertEditModal({open: false, index: null, name: "", role: "", bio: ""})} className="flex-1 p-4 rounded-2xl bg-white/5 text-xs font-black uppercase">Cancel</button>
                    <button onClick={saveExpertUpdate} className="flex-1 p-4 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest">Save</button>
                </div>
            </div>
        </div>
    );
}