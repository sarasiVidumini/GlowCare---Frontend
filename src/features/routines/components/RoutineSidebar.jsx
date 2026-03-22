import React from 'react';
import { Fingerprint, Bell, BellOff, MessageSquare, Users, Activity } from 'lucide-react';

export default function RoutineSidebar({ isDark, notifEnabled, handleBellClick, setShowChat, path, setPath, part, setShowExpertsModal, progress }) {
    return (
        <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className={`rounded-[2.5rem] p-8 backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#0F0F12]/80' : 'bg-white shadow-xl shadow-slate-200/50'}`}>
                <div className="flex gap-3 mb-10">
                    <div className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-emerald-500 text-black' : 'bg-slate-900 text-white'}`}><Fingerprint size={20} /></div>
                    <button onClick={handleBellClick} className={`p-2 rounded-xl transition-all ${notifEnabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-black/5 text-slate-500'}`}>
                        {notifEnabled ? <Bell size={20} className="animate-wiggle" /> : <BellOff size={20} />}
                    </button>
                    <button onClick={() => setShowChat(true)} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><MessageSquare size={20} /></button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {['Natural', 'Chemical', 'Ayurvedic'].map(p => (
                        <button key={p} onClick={() => setPath(p)} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${path === p ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>{p}</button>
                    ))}
                </div>
                <h2 className="text-4xl font-black italic uppercase leading-none">{part} <br/><span className="text-emerald-500">Timeline.</span></h2>
                <button onClick={() => setShowExpertsModal(true)} className="w-full mt-8 p-4 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-emerald-900/20">
                    <Users size={16} /> To Meet The Experts
                </button>
            </div>
            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white h-[160px] shadow-xl relative overflow-hidden">
                <p className="text-[9px] font-black uppercase opacity-60">Progress</p>
                <div className="text-5xl font-black italic mt-2">{progress}%</div>
                <Activity className="absolute -right-4 -bottom-4 text-white/10" size={100} />
            </div>
        </div>
    );
}