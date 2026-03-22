import React from 'react';
import { X } from 'lucide-react';

export default function AddDoctorModal({
                                           isDark,
                                           isOpen,
                                           onClose,
                                           onSubmit,
                                           newDoctorData,
                                           setNewDoctorData
                                       }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl ${isDark ? 'bg-[#0F0F12] border border-white/10' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black italic uppercase">Register Specialist</h3>
                    <button onClick={onClose}><X size={24}/></button>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Name</label>
                        <input required placeholder="Dr. Name" value={newDoctorData.name} onChange={e => setNewDoctorData({...newDoctorData, name: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Specialist In</label>
                        <input required placeholder="Skin Care focus" value={newDoctorData.focus} onChange={e => setNewDoctorData({...newDoctorData, focus: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Dates (Comma separated: Mon, Tue)</label>
                        <input required placeholder="Mon, Wed" value={newDoctorData.available} onChange={e => setNewDoctorData({...newDoctorData, available: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Add to Registry</button>
                </form>
            </div>
        </div>
    );
}