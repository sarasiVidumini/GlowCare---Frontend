import React from 'react';
import { X } from 'lucide-react';

export default function EditDoctorModal({
                                            isDark,
                                            isOpen,
                                            onClose,
                                            onSubmit,
                                            editingDoctor,
                                            setEditingDoctor
                                        }) {
    if (!isOpen || !editingDoctor) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl ${isDark ? 'bg-[#0F0F12] border border-white/10' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black italic uppercase">Update Physician</h3>
                    <button onClick={onClose}><X size={24}/></button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Full Name</label>
                        <input value={editingDoctor.name} onChange={(e) => setEditingDoctor({...editingDoctor, name: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Specialization</label>
                        <input value={editingDoctor.focus} onChange={(e) => setEditingDoctor({...editingDoctor, focus: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Available Dates</label>
                        <input value={editingDoctor.availableStr} onChange={(e) => setEditingDoctor({...editingDoctor, availableStr: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Update Registry</button>
                </form>
            </div>
        </div>
    );
}