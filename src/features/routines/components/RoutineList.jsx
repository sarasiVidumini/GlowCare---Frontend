import React from 'react';
import { Plus, CheckCircle2, Edit3, Trash2 } from 'lucide-react';

export default function RoutineList({ isDark, time, setTime, isAdmin, setModal, db, path, part, done, toggleDone, deleteProduct, setPart }) {
    return (
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className={`rounded-[2.5rem] p-8 backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#0F0F12]/80' : 'bg-white shadow-xl'}`}>
                <header className="flex justify-between items-center mb-10">
                    <div className={`flex p-1 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        {['morning', 'night'].map(t => (
                            <button key={t} onClick={() => setTime(t)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${time === t ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>{t}</button>
                        ))}
                    </div>
                    {isAdmin && (
                        <button onClick={() => setModal({ open: true, type: 'add', index: null, value: "", stepTime: "" })} className="flex items-center gap-2 p-3 bg-emerald-600 rounded-xl text-white px-5 font-black uppercase text-[10px] active:scale-95 transition-all shadow-lg shadow-emerald-900/20">
                            <Plus size={14} strokeWidth={3} /> ADD FORMULA
                        </button>
                    )}
                </header>
                <div className="space-y-4">
                    {(db[path][part][time] || []).map((product, idx) => (
                        <div key={idx} className={`group flex items-center justify-between p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-[#FBFBFD] border-slate-100 hover:shadow-lg'}`}>
                            <div className="flex items-center gap-6">
                                <button onClick={() => toggleDone(product.name)} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${done[`${path}-${part}-${time}-${product.name}`] ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-300'}`}><CheckCircle2 size={20} /></button>
                                <div><span className={`text-xl font-black italic uppercase transition-all ${done[`${path}-${part}-${time}-${product.name}`] ? 'opacity-30 line-through' : ''}`}>{product.name}</span><p className="text-[11px] text-emerald-500 font-bold uppercase italic">{product.stepTime}</p></div>
                            </div>
                            {isAdmin && (
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => setModal({ open: true, type: 'edit', index: idx, value: product.name, stepTime: product.stepTime })} className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500"><Edit3 size={14}/></button>
                                    <button onClick={() => deleteProduct(idx)} className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500"><Trash2 size={14}/></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Zone Selector placed below the list */}
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                {['Face', 'Hair', 'Hands', 'Leg'].map(p => (
                    <button key={p} onClick={() => setPart(p)} className={`flex-none px-12 py-6 rounded-[2.2rem] border font-black uppercase text-[10px] transition-all ${part === p ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-500'}`}>{p} focus</button>
                ))}
            </div>
        </div>
    );
}