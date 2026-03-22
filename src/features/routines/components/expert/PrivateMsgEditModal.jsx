import React from 'react';
import { Edit3 } from 'lucide-react';

export default function PrivateMsgEditModal({ isDark, pEditModal, setPEditModal, savePrivateEdit }) {
    if (!pEditModal.open) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[5000] flex items-center justify-center p-4">
            <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-[#141417] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'}`}>
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-emerald-500/20 rounded-lg"><Edit3 size={16} className="text-emerald-500" /></div>
                    <h4 className={`text-sm font-black italic uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Refine Message</h4>
                </div>
                <textarea value={pEditModal.text} onChange={(e) => setPEditModal({...pEditModal, text: e.target.value})} className={`w-full p-5 rounded-2xl border bg-transparent text-sm font-bold h-32 outline-none mb-6 resize-none transition-all ${isDark ? 'border-white/10 text-white focus:border-emerald-500' : 'border-slate-200 text-slate-900 focus:border-emerald-500'}`} />
                <div className="flex gap-3">
                    <button onClick={() => setPEditModal({open: false, id: null, text: ""})} className={`flex-1 p-4 rounded-xl text-[10px] font-black uppercase transition-all ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Cancel</button>
                    <button onClick={savePrivateEdit} className="flex-1 p-4 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase hover:shadow-lg hover:shadow-emerald-500/20 transition-all">Save Changes</button>
                </div>
            </div>
        </div>
    );
}