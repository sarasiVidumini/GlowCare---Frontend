import React from 'react';
import { Scan, ChevronRight, Activity } from 'lucide-react';

export default function BodyPartSelector({ isDark, onSelect }) {
    const parts = [
        {
            id: 'Face',
            img: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&q=80',
            info: 'Texture, pores, and tone analysis.'
        },
        {
            id: 'Back',
            img: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=500&q=80',
            info: 'Spinal skin health and blemishes.'
        },
        {
            id: 'Body',
            img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500&q=80',
            info: 'Hydration and elasticity check.'
        },
        {
            id: 'Hands',
            img: 'https://images.pexels.com/photos/545014/pexels-photo-545014.jpeg?auto=compress&cs=tinysrgb&w=500',
            info: 'Dermatological aging indicators.'
        },
        {
            id: 'Feet',
            img: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500',
            info: 'Structural and skin surface scan.'
        },
        {
            id: 'Scalp',
            img: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=500&q=80',
            info: 'Follicle and scalp condition.'
        },
        {
            id: 'Lips',
            img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80',
            info: 'Mucosal health and hydration.'
        }
    ];

    return (
        /* -mt-10: Pulls the entire component up (adjust the number as needed)
           pt-0: Removes all top padding
           space-y-4: Further reduces the gap between header and grid
        */
        <div className="max-w-7xl mx-auto px-6 -mt-10 pt-0 pb-12 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            {/* Minimalist Clinical Header */}
            <div className="text-center space-y-0">
                <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                    Focus <span className="text-emerald-500">Area.</span>
                </h1>
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] opacity-40 mt-1">
                    Select target region for clinical analysis
                </p>
            </div>

            {/* Beautifully Managed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {parts.map((part) => (
                    <div
                        key={part.id}
                        className={`group relative flex flex-col rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:shadow-2xl ${
                            isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'
                        }`}
                    >
                        {/* Image Layer */}
                        <div className="relative h-60 overflow-hidden">
                            <img
                                src={part.img}
                                alt={part.id}
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-md p-2 rounded-full shadow-sm">
                                <Activity size={16} className="text-emerald-500" />
                            </div>
                        </div>

                        {/* Information Section */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="mb-3">
                                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">Diagnostic Path</span>
                                <h3 className={`text-2xl font-black uppercase italic tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {part.id}
                                </h3>
                            </div>

                            <p className={`text-xs font-medium leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {part.info}
                            </p>

                            <button
                                onClick={() => onSelect(part.id)}
                                className={`mt-auto group/btn flex items-center justify-between py-4 px-6 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 ${
                                    isDark
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                        : 'bg-slate-900 hover:bg-emerald-600 text-white shadow-slate-300'
                                }`}
                            >
                                Start Assessment
                                <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Coming Soon card */}
                <div className="hidden xl:flex flex-col border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-[2.5rem] items-center justify-center p-8 text-center opacity-30">
                    <Scan size={32} className="mb-4 text-slate-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional regions arriving soon</p>
                </div>
            </div>
        </div>
    );
}