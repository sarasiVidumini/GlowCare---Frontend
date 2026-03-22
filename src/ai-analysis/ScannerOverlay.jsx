import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Maximize, Target } from 'lucide-react';

const ScannerOverlay = ({ isScanning, progress }) => {
    const [status, setStatus] = useState('Aligning Face...');

    useEffect(() => {
        if (progress > 10 && progress < 40) setStatus('Detecting Acne & Lesions...');
        if (progress >= 40 && progress < 70) setStatus('Mapping Pigmentation...');
        if (progress >= 70 && progress < 95) setStatus('Analyzing Skin Texture...');
        if (progress >= 95) setStatus('Generating Health Score...');
    }, [progress]);

    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-between p-6 pointer-events-none transition-colors duration-500">

            {/* --- TOP HUD: Status & Security --- */}
            <div className="w-full flex justify-between items-start animate-fade-in">
                {/* Status Card */}
                <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-lg dark:shadow-2xl">
                    <div className="relative">
                        <Activity className="text-blue-600 dark:text-cyan-400 w-5 h-5 animate-pulse" />
                        <div className="absolute inset-0 bg-blue-400/20 dark:bg-cyan-400/30 blur-lg rounded-full"></div>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/50 font-bold">System Status</p>
                        <p className="text-slate-800 dark:text-white text-sm font-semibold">{status}</p>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="hidden sm:flex bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-2xl p-4 items-center gap-3 shadow-sm">
                    <ShieldCheck className="text-emerald-500 dark:text-emerald-400 w-5 h-5" />
                    <p className="text-slate-600 dark:text-white/80 text-xs font-medium uppercase tracking-tight">AI Secure</p>
                </div>
            </div>

            {/* --- CENTER: Diagnostic Reticle --- */}
            <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Corner Brackets - Dynamic Colors */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-600 dark:border-cyan-400 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-600 dark:border-cyan-400 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-600 dark:border-cyan-400 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-600 dark:border-cyan-400 rounded-br-2xl"></div>

                {/* Scanning Laser Line */}
                {isScanning && (
                    <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-blue-500 dark:via-cyan-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] dark:shadow-[0_0_20px_#22d3ee] animate-scan-move"></div>
                )}

                {/* Face Guidance Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20">
                    <Target className="w-1/2 h-1/2 text-slate-900 dark:text-white stroke-[1]" />
                </div>
            </div>

            {/* --- BOTTOM HUD: Progress & Analytics --- */}
            <div className="w-full max-w-md space-y-4 animate-slide-up pb-8">
                {/* Micro-Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Hydration', val: '72%' },
                        { label: 'Oiliness', val: 'Low' },
                        { label: 'Sensitivity', val: 'Normal' }
                    ].map((metric, i) => (
                        <div key={i} className="bg-white/50 dark:bg-black/40 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-xl p-3 text-center shadow-sm">
                            <p className="text-[9px] text-slate-500 dark:text-white/40 uppercase font-bold tracking-wider">{metric.label}</p>
                            <p className="text-blue-600 dark:text-cyan-300 font-mono text-xs font-bold">{isScanning ? metric.val : '--'}</p>
                        </div>
                    ))}
                </div>

                {/* Primary Progress Glass-Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-[2.5rem] p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-800 dark:text-white font-bold text-xl tracking-tight italic">GlowCare AI</span>
                        <span className="text-blue-600 dark:text-cyan-400 font-mono text-sm font-black">{progress}%</span>
                    </div>

                    {/* Track */}
                    <div className="h-3 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden p-[2px]">
                        {/* Bar */}
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-cyan-500 dark:to-blue-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        >
                            {/* Internal Glow Effect */}
                            <div className="w-full h-full opacity-50 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer"></div>
                        </div>
                    </div>

                    <p className="text-slate-500 dark:text-white/40 text-[10px] mt-4 text-center font-medium uppercase tracking-[0.15em]">
                        Precision Skin Diagnostics v4.2
                    </p>
                </div>
            </div>

            {/* Embedded Custom CSS */}
            <style jsx>{`
        @keyframes scan-move {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan-move { animation: scan-move 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </div>
    );
};

export default ScannerOverlay;