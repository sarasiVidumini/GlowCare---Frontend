import React from 'react';
import { ScanFace } from 'lucide-react';

export default function VisualMarkersCard({ isDark, markers }) {
    return (
        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6 flex items-center gap-2">
                <ScanFace size={14}/> Visual Markers Detected
            </p>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase">Acne & Lesions</span>
                    <span className="text-xs font-black text-rose-500">{markers.acne} Density</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full">
                    <div className="bg-rose-500 h-1.5 rounded-full" style={{width: '60%'}}></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs font-bold uppercase">Pigmentation</span>
                    <span className="text-xs font-black text-amber-500">{markers.pigment}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{width: '40%'}}></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs font-bold uppercase">Texture / Hydration</span>
                    <span className="text-xs font-black text-blue-500">{markers.texture}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '75%'}}></div>
                </div>
            </div>
        </div>
    );
}