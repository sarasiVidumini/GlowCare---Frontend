import React from 'react';
import { AlertTriangle, RefreshCw, X, ShieldAlert, Leaf } from 'lucide-react';

const ConflictModal = ({ isOpen, data, onClose, onSwap }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-rose-500/10 overflow-hidden animate-in zoom-in duration-300">

                {/* Warning Header */}
                <div className="bg-gradient-to-r from-rose-500 to-orange-400 p-8 flex flex-col items-center text-white text-center">
                    <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce">
                        <ShieldAlert size={40} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter"> Warning! </h2>
                    <p className="text-[10px] font-black uppercase opacity-80 tracking-[0.2em] mt-1">Ingredient Conflict Detected</p>
                </div>

                <div className="p-8">
                    {/* Conflict Description */}
                    <div className="text-center mb-8">
                        <p className="text-slate-600 font-bold leading-relaxed">
                            The <span className="text-rose-600 italic">"{data.conflictIngredient}"</span>
                            you entered conflicts with an existing routine.
                        </p>
                        <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <p className="text-[11px] text-rose-700 font-bold leading-snug italic">
                                "{data.message}"
                            </p>
                        </div>
                    </div>

                    {/* Recommendation Box */}
                    <div className="relative bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Leaf size={60} className="text-emerald-500" />
                        </div>

                        <h4 className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3">GlowCare Recommendation</h4>

                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">
                                🌿
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Safe Ayurvedic Alternative</p>
                                <h3 className="text-lg font-black text-slate-800 uppercase italic leading-none">{data.alternative.name}</h3>
                            </div>
                        </div>

                        <button
                            onClick={() => onSwap(data.alternative)}
                            className="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase text-[10px] py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                        >
                            <RefreshCw size={14} strokeWidth={3} /> Swap with Alternative
                        </button>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full mt-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                        Keep Existing Anyway
                    </button>
                </div>

                {/* Close Icon (Top Right) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-6 text-white/50 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ConflictModal;