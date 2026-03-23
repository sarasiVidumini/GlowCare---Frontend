import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SignInBanner() {
    return (
        <div className="hidden lg:flex relative bg-emerald-950 p-12 flex-col justify-between">
            <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                alt="background"
            />
            <div className="relative z-10 text-white mt-auto">
                <Sparkles className="text-emerald-400 mb-6 animate-pulse" size={32} />
                <h2 className="text-[40px] font-black italic uppercase leading-tight tracking-tighter">
                    Welcome <br/> Back to <br/> <span className="text-emerald-400">Glow.</span>
                </h2>
            </div>
        </div>
    );
}