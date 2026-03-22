import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function AlertBanner({ alert }) {
    if (!alert.show) return null;

    return (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[250] animate-in zoom-in-95 duration-300">
            <div className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] shadow-2xl border backdrop-blur-3xl ${
                alert.type === 'success'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-red-500/20 border-red-500/50 text-red-400'
            }`}>
                <div className={`p-2.5 rounded-full ${alert.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {alert.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-[12px]">{alert.msg}</span>
            </div>
        </div>
    );
}