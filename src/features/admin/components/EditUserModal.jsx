import React from 'react';

export default function EditUserModal({ isDark, editingUser, setEditingUser, handleUpdate }) {
    if (!editingUser) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-xl">
            <div className="absolute inset-0 bg-black/70" onClick={() => setEditingUser(null)} />
            <div className={`relative w-full max-w-xl p-12 rounded-[3.5rem] border shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-200'}`}>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-10 text-center">Override <span className="text-emerald-500">Identity.</span></h2>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-3">Full Legal Name</label>
                        <input
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                            className={`w-full p-6 rounded-2xl border outline-none font-bold text-sm transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500' : 'bg-slate-50 border-slate-100 focus:border-emerald-500'}`}
                        />
                    </div>
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-3">Access Email Address</label>
                        <input
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                            className={`w-full p-6 rounded-2xl border outline-none font-bold text-sm transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500' : 'bg-slate-50 border-slate-100 focus:border-emerald-500'}`}
                        />
                    </div>
                    <div className="flex gap-5 mt-10">
                        <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] opacity-50 hover:opacity-100 transition-all">Abort</button>
                        <button type="submit" className="flex-[2] bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-emerald-500/30">Commit Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}