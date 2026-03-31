import React from 'react';
import { Scan } from 'lucide-react';

export default function BodyPartSelector({ isDark, onSelect }) {
    // FIX: Cleaned up the URLs so they are standard strings without markdown brackets
    const parts = [
        { id: 'Face', img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=80' },
        { id: 'Back', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=80' },
        { id: 'Body', img: 'https://images.unsplash.com/photo-1506003023533-88cd72dc4f06?w=500&q=80' },
        { id: 'Hands', img: 'https://images.unsplash.com/photo-1618534005876-02e08e6f1f50?w=500&q=80' },
        { id: 'Feet', img: 'https://images.unsplash.com/photo-1536250550556-2db108155e85?w=500&q=80' },
        { id: 'Scalp', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80' },
        { id: 'Lips', img: 'https://images.unsplash.com/photo-1586525198428-225f6f12cff5?w=500&q=80' }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 text-center">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight">Focus <span className="text-emerald-500">Area.</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-2">Select target region for clinical analysis</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {parts.map((part) => (
                    <button
                        key={part.id}
                        onClick={() => onSelect(part.id)}
                        className={`group relative overflow-hidden h-48 rounded-[2rem] border transition-all duration-500 flex flex-col items-center justify-center ${
                            isDark ? 'border-white/5 hover:border-emerald-500' : 'border-slate-200 hover:border-emerald-500 shadow-xl'
                        }`}
                    >
                        {/* Background Image */}
                        <img
                            src={part.img}
                            alt={part.id}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40 grayscale group-hover:grayscale-0"
                        />

                        {/* Dark Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform">
                            <Scan size={24} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="font-black uppercase tracking-[0.2em] text-lg text-white drop-shadow-lg">{part.id}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}