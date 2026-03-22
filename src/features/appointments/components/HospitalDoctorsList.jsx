import React from 'react';
import { Building2, Plus, Activity, Edit2, Trash2, Star, Clock } from 'lucide-react';

export default function HospitalDoctorsList({
                                                isDark,
                                                activeHospital,
                                                selectedDoctor,
                                                setSelectedDoctor,
                                                isMainAdmin,
                                                onAddClick,
                                                onEditClick,
                                                onDeleteClick
                                            }) {
    if (!activeHospital) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                        <Building2 className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-black tracking-tight italic uppercase">{activeHospital.name}</h2>
                </div>
                {isMainAdmin && (
                    <button onClick={onAddClick} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                        <Plus size={14}/> Add Doctor
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeHospital.doctors.map(doc => (
                    <div
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`p-6 rounded-[1.8rem] cursor-pointer border-2 transition-all relative group overflow-hidden ${
                            selectedDoctor?.id === doc.id
                                ? 'border-emerald-500 bg-emerald-500/5 shadow-lg'
                                : isDark ? 'bg-[#0F0F12] border-white/5 hover:border-emerald-500/40' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDoctor?.id === doc.id ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                <Activity size={20} />
                            </div>
                            <div className="flex gap-2">
                                {isMainAdmin && (
                                    <>
                                        <button onClick={(e) => onEditClick(e, doc)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={12}/></button>
                                        <button onClick={(e) => onDeleteClick(e, doc.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                                    </>
                                )}
                                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-black italic h-fit">
                                    <Star size={10} fill="white"/> {doc.rating}
                                </div>
                            </div>
                        </div>
                        <h4 className="text-md font-black tracking-tight italic uppercase">{doc.name}</h4>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">{doc.focus}</p>
                        <div className={`flex items-center gap-2 text-[9px] font-black px-3 py-1.5 rounded-lg w-fit ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                            <Clock size={12} className="text-emerald-500" /> {doc.available.join(' • ')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}