import React from 'react';
import { Fingerprint } from 'lucide-react';

export default function SignUpBanner() {
    return (
        <div className="hidden lg:flex relative overflow-hidden bg-emerald-600">
            <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80"
                alt="Skin Care"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
            />
            <div className="relative z-10 p-10 flex flex-col justify-between h-full text-white">
                <div>
                    <div className="flex items-center gap-2.5 mb-4">
                        <Fingerprint size={28} className="text-emerald-300" />
                        <span className="font-black uppercase tracking-[0.3em] text-[9px]">Clinical Hub</span>
                    </div>
                    <h2 className="text-[36px] font-black italic leading-[1.1] uppercase tracking-tighter">
                        Join the <br/> <span className="text-emerald-300 font-serif text-[40px]">Luxury</span> <br/> Network.
                    </h2>
                </div>
            </div>
        </div>
    );
}