import React from 'react';
import { ArrowLeft, Database, Activity, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminHeader({ isDark, userCount, setSearchTerm }) {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 mb-10">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500 transition-all group-hover:text-white text-emerald-500">
                        <ArrowLeft size={24} />
                    </div>
                    <span className="font-black uppercase tracking-[0.3em] text-[12px] opacity-60 group-hover:opacity-100">Back</span>
                </div>

                <div className="text-center flex-1">
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-3">
                        User <span className="text-emerald-500 not-italic font-serif">Nexus.</span>
                    </h1>
                    <div className="flex items-center justify-center gap-4 opacity-50">
                        <div className="flex items-center gap-2"><Database size={14}/> <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{userCount} Records</span></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                        <div className="flex items-center gap-2"><Activity size={14}/> <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Live</span></div>
                    </div>
                </div>

                <div className={`relative flex items-center p-1.5 rounded-2xl border transition-all w-full md:w-72 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <Search className="ml-4 opacity-40 text-emerald-500" size={20} />
                    <input
                        type="text"
                        placeholder="SEARCH IDENTITY..."
                        className="bg-transparent pl-4 pr-5 py-3 outline-none font-black text-[11px] uppercase tracking-widest w-full"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <hr className="mb-12 border-white/5" />
        </>
    );
}