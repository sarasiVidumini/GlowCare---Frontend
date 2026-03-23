import React from 'react';
import { Cpu } from 'lucide-react';

export default function ProcessingOverlay({ isDark, isScanning, scanProgress }) {
    if (!isScanning) return null;

    return (
        <div className={`fixed inset-0 z-[300] flex flex-col items-center justify-center backdrop-blur-3xl ${isDark ? 'bg-black/90' : 'bg-white/90'}`}>
            <Cpu size={50} className="text-emerald-500 animate-spin-slow mb-6" />
            <div className="w-56 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
            </div>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">Processing Computer Vision Matrix...</p>
            <p className="mt-2 text-[8px] font-bold uppercase tracking-widest opacity-40">Analyzing Texture & Pigmentation</p>
        </div>
    );
}