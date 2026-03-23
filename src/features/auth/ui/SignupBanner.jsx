import React from 'react';
import { Fingerprint } from 'lucide-react';

export default function SignUpBanner() {
    return (
        // Ensure the background is solid emerald so nothing bleeds through
        <div className="relative w-full h-full bg-emerald-700 overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80"
                alt="Skin Care"
                // Removed mix-blend-overlay. Increased opacity to 70% for a solid look.
                className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            {/* Added a subtle gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent z-0" />

            <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
                <div>
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="p-2 bg-emerald-500/20 backdrop-blur-md rounded-lg">
                            <Fingerprint size={28} className="text-emerald-300" />
                        </div>
                        <span className="font-black uppercase tracking-[0.3em] text-[10px] text-emerald-100">Clinical Hub</span>
                    </div>
                    <h2 className="text-[42px] font-black italic leading-[1] uppercase tracking-tighter">
                        Join the <br/>
                        <span className="text-emerald-300 font-serif text-[52px] normal-case italic">Luxury</span> <br/>
                        Network.
                    </h2>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100/60">
                    © GlowCare Clinical Systems 2026
                </p>
            </div>
        </div>
    );
}