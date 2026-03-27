import React from 'react';

export default function ExpertFormModal({ isDark, expertEditModal, setExpertEditModal, handleSaveExpert }) {
    if (!expertEditModal.open) return null;

    // Call the parent function and pass the current state
    const onSaveClick = () => {
        handleSaveExpert(expertEditModal);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[4000] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#141417] border-white/10' : 'bg-white shadow-2xl'}`}>
                <h4 className="text-xl font-black italic uppercase mb-6 text-emerald-500 text-center">
                    {expertEditModal.id ? 'Edit Expert' : 'New Expert'}
                </h4>

                <div className="space-y-4">
                    <input
                        value={expertEditModal.fullName}
                        onChange={(e) => setExpertEditModal({...expertEditModal, fullName: e.target.value})}
                        placeholder="Expert Full Name"
                        className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                    />
                    <input
                        value={expertEditModal.expertiseArea}
                        onChange={(e) => setExpertEditModal({...expertEditModal, expertiseArea: e.target.value})}
                        placeholder="Clinical Specialty"
                        className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                    />
                    <textarea
                        value={expertEditModal.bio}
                        onChange={(e) => setExpertEditModal({...expertEditModal, bio: e.target.value})}
                        placeholder="Expert Bio"
                        className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold h-24 outline-none resize-none ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                    />
                </div>

                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => setExpertEditModal({open: false, id: null, fullName: "", expertiseArea: "", licenseNumber: "", email: "", bio: ""})}
                        className="flex-1 p-4 rounded-2xl bg-white/5 text-xs font-black uppercase"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSaveClick}
                        className="flex-1 p-4 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}