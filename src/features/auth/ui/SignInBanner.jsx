import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SignInBanner() {
    return (
        <div className="hidden lg:flex relative bg-[#042f2e] h-full p-12 flex-col overflow-hidden">
            {/* Background Image with correct overlay and positioning */}
            <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop"
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply grayscale"
                alt="background"
            />

            {/* Gradient Overlay for the dark green tint */}
            <div className="absolute inset-0 bg-emerald-950/80 mix-blend-hard-light" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Logo Icon */}
                <div className="mb-12">
                    <Sparkles className="text-[#22c55e] drop-shadow-sm" size={42} strokeWidth={2.5} />
                </div>

                {/* Typography matching the bold, italic, tight-tracked style */}
                <div className="mt-auto mb-8">
                    <h2 className="text-[56px] font-black italic uppercase leading-[0.9] tracking-tighter text-white">
                        Welcome <br/>
                        Back to <br/>
                        <span className="text-[#22c55e]">Glow.</span>
                    </h2>
                </div>
            </div>
        </div>
    );
}