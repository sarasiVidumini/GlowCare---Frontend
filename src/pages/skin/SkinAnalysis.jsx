import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // මෙතන 'react-router-dom' ලෙස නිවැරදි කළා
import { ArrowRight, Moon, Sun, Activity, Leaf, Fingerprint, Cpu, Loader2 } from 'lucide-react';

// --- LEAF ANIMATION COMPONENT ---
const FallingLeaves = ({ isDark }) => {
    const [leaves, setLeaves] = useState([]);
    useEffect(() => {
        const leafIcons = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 12 + 's',
            duration: 18 + Math.random() * 12 + 's',
            size: 8 + Math.random() * 12 + 'px',
            swing: 20 + Math.random() * 30 + 'px'
        }));
        setLeaves(leafIcons);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {leaves.map((leaf) => (
                <div key={leaf.id} className="absolute top-[-10%]"
                     style={{
                         left: leaf.left,
                         animation: `leafFall ${leaf.duration} linear infinite`,
                         animationDelay: leaf.delay,
                         '--swing-dist': leaf.swing
                     }}
                >
                    <Leaf size={leaf.size} className={`transition-colors duration-1000 ${isDark ? 'text-emerald-500/20' : 'text-emerald-800/10'}`}
                          style={{ transform: `rotate(${Math.random() * 360}deg)` }}
                    />
                </div>
            ))}
            <style>{`
                @keyframes leafFall {
                    0% { transform: translateY(0vh) rotate(0deg) translateX(0px); opacity: 0; }
                    15% { opacity: 1; }
                    50% { transform: translateY(50vh) rotate(180deg) translateX(var(--swing-dist)); }
                    100% { transform: translateY(110vh) rotate(360deg) translateX(0px); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default function SmartAnalysis({ isDark }) {
    const [step, setStep] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [choices, setChoices] = useState({ sensitivity: null, type: null });
    const navigate = useNavigate();

    const handleSelect = (key, val) => {
        const updated = { ...choices, [key]: val };
        setChoices(updated);

        if (step === 0) {
            setStep(1);
        } else {
            setIsScanning(true);
        }
    };

    // Scanning Logic
    useEffect(() => {
        if (isScanning) {
            const timer = setInterval(() => {
                setScanProgress(old => {
                    if (old >= 100) {
                        clearInterval(timer);
                        const path = choices.sensitivity === 'high' ? 'Natural' : (choices.type === 'oily' ? 'Chemical' : 'Ayurvedic');
                        setTimeout(() => {
                            // මෙහි navigate කිරීමේදී /timeline හෝ /routine ලෙස ඔයාගේ App.js එකේ ඇති path එකට ගැලපෙන ලෙස වෙනස් කරන්න
                            navigate('/timeline', { state: { profile: { ...choices, path }, isDark } });
                        }, 500);
                        return 100;
                    }
                    return old + 2;
                });
            }, 50);
            return () => clearInterval(timer);
        }
    }, [isScanning, choices, navigate, isDark]);

    return (
        <div className={`min-h-screen flex flex-col lg:flex-row font-sans transition-all duration-1000 relative overflow-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>

            <FallingLeaves isDark={isDark} />

            {/* Scanning Overlay Screen */}
            {isScanning && (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-3xl transition-all duration-700 ${isDark ? 'bg-black/90' : 'bg-white/90'}`}>
                    <div className="max-w-md w-full p-12 text-center space-y-8 relative">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] animate-pulse rounded-full" />
                            <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative z-10 mx-auto">
                                <Cpu size={48} className="text-emerald-500 animate-pulse" />
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle
                                        cx="64" cy="64" r="60"
                                        stroke="currentColor" strokeWidth="4" fill="transparent"
                                        className="text-emerald-500 transition-all duration-300"
                                        style={{ strokeDasharray: 377, strokeDashoffset: 377 - (377 * scanProgress) / 100 }}
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">Analyzing <span className="text-emerald-500">Dermis.</span></h3>
                            <div className="flex justify-center gap-2 items-center text-xs font-mono opacity-60">
                                <Loader2 size={12} className="animate-spin" />
                                <span>{scanProgress < 40 ? "CALIBRATING PROBES..." : scanProgress < 80 ? "MATCHING FORMULAS..." : "FINALIZING ROUTINE..."}</span>
                                <span>{scanProgress}%</span>
                            </div>
                        </div>

                        <div className={`w-full h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Left Panel */}
            <div className={`lg:w-[320px] border-r p-8 flex flex-col justify-between transition-all duration-700 relative z-10 ${isDark ? 'bg-[#0A0A0B]/80 border-white/5 backdrop-blur-2xl' : 'bg-white/80 border-slate-100 backdrop-blur-2xl'}`}>
                <div className="space-y-12">
                    <div className="space-y-8">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">System Monitoring</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-widest opacity-30">Neural Data</h2>
                            <div className="space-y-3 font-mono text-[10px] tracking-tight">
                                <div className={`p-4 rounded-2xl border transition-all ${choices.sensitivity ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : 'border-white/5 opacity-40'}`}>
                                    <p className="flex justify-between uppercase"><span>Probe_01</span> <span>{choices.sensitivity || "Pending"}</span></p>
                                </div>
                                <div className={`p-4 rounded-2xl border transition-all ${choices.type ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : 'border-white/5 opacity-40'}`}>
                                    <p className="flex justify-between uppercase"><span>Probe_02</span> <span>{choices.type || "Pending"}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-30">
                    <Activity size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
                    <span>Diagnostics v4.0.2</span>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-8 lg:p-16 relative z-10">
                <div className="max-w-xl w-full space-y-12 relative">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-[2px] bg-emerald-500" />
                            <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em]">Step 0{step + 1}</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] italic uppercase whitespace-pre-line">
                            {step === 0 ? "Define your \nbarrier." : "Sebaceous \nAnalytics."}
                        </h1>
                        <p className={`text-base font-medium leading-relaxed max-w-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Select the parameter that best reflects your current dermal state.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {(step === 0
                                ? [{id:'high', t:'Reactive', d:'Prone to redness/itching'}, {id:'low', t:'Resilient', d:'Stable, rarely reacts'}]
                                : [{id:'dry', t:'Alipidic', d:'Minimal oil, feels tight'}, {id:'oily', t:'Seborrheic', d:'High shine, visible pores'}, {id:'normal', t:'Balanced', d:'Optimal moisture'}]
                        ).map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(step === 0 ? 'sensitivity' : 'type', opt.id)}
                                className={`group flex items-center justify-between p-7 border rounded-[2.2rem] transition-all duration-300 ${
                                    isDark
                                        ? 'bg-white/[0.03] border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                                        : 'bg-white border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl'
                                }`}
                            >
                                <div className="text-left">
                                    <h3 className="text-xl font-black tracking-tight uppercase italic">{opt.t}</h3>
                                    <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{opt.d}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                    isDark
                                        ? 'bg-white/5 text-slate-500 group-hover:bg-emerald-500 group-hover:text-black'
                                        : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white'
                                }`}>
                                    <ArrowRight size={20} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}