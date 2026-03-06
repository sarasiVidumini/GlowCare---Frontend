import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Activity, Leaf, Cpu, Camera,
    Zap, Sparkles, CheckCircle2, Scissors,
    Hand, Footprints, ScanFace, Sprout, Thermometer, ChevronRight
} from 'lucide-react';

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
                    <Leaf size={leaf.size} className={`transition-colors duration-1000 ${isDark ? 'text-emerald-500/10' : 'text-emerald-800/5'}`}
                          style={{ transform: `rotate(${Math.random() * 360}deg)` }}
                    />
                </div>
            ))}
        </div>
    );
};

export default function SmartAnalysis({ isDark }) {
    const [step, setStep] = useState(-2);
    const [selectedPart, setSelectedPart] = useState(null);
    const [image, setImage] = useState(null);
    const [aiResults, setAiResults] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const fileInputRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const navigate = useNavigate();

    const bodyParts = [
        { id: 'Face', label: 'Facial Dermis', icon: <ScanFace size={20} /> },
        { id: 'Hair', label: 'Follicle Matrix', icon: <Scissors size={20} /> },
        { id: 'Hands', label: 'Palmar Surface', icon: <Hand size={20} /> },
        { id: 'Legs', label: 'Dermal Layer', icon: <Footprints size={20} /> }
    ];

    const treatmentPaths = [
        { id: 'Natural', t: 'Natural', d: 'Botanical Repair', info: 'Uses pure plant extracts to reinforce the natural skin barrier and promote organic healing.', icon: <Leaf className="text-emerald-500" /> },
        { id: 'Chemical', t: 'Chemical', d: 'Molecular Science', info: 'Advanced active compounds designed for rapid cellular turnover and intensive pigmentation repair.', icon: <Zap className="text-blue-500" /> },
        { id: 'Ayurvedic', t: 'Ayurvedic', d: 'Vedic Wisdom', info: 'Traditional herbal formulations focused on deep detoxification and holistic tissue rejuvenation.', icon: <Sprout className="text-amber-500" /> }
    ];

    const playNotificationSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
        audio.play().catch(e => console.log("Audio play blocked"));
    };

    const handlePartSelect = (id) => {
        setSelectedPart(id);
        setStep(-1);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setStep(-0.5);

            // LOGIC: Map specific parts to logic-based suggestions instead of just Natural
            let suggestion = 'Natural';
            if (selectedPart === 'Hair') suggestion = 'Chemical';
            else if (selectedPart === 'Hands' || selectedPart === 'Legs') suggestion = 'Ayurvedic';
            else suggestion = Math.random() > 0.5 ? 'Natural' : 'Chemical';

            setTimeout(() => {
                setAiResults({ healthScore: Math.floor(Math.random() * 15) + 80, suggestedPath: suggestion });
                setStep(2);
                setShowAlert(true);
                playNotificationSound();
                // Auto-hide alert after 10 minutes
                setTimeout(() => setShowAlert(false), 600000);
            }, 3000);
        }
    };

    const handleNavigate = (pathId) => {
        setIsScanning(true);
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                navigate('/timeline', { state: { path: pathId, part: selectedPart, isDark } });
            }
        }, 50);
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans transition-all duration-1000 relative overflow-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-[#F9FAFB] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />

            {/* AI SUGGESTION ALERT - TOP RIGHT */}
            {showAlert && (
                <div className="fixed top-8 right-8 z-[200] w-full max-w-[350px] animate-in slide-in-from-right-10 fade-in duration-700">
                    <div className={`relative overflow-hidden p-6 rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl ${isDark ? 'bg-black/80 border-emerald-500/20' : 'bg-white/90 border-emerald-500/10 shadow-emerald-500/5'}`}>
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                <Sparkles size={22} className="text-emerald-500 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">AI Intelligent Match</h4>
                                <h3 className="text-xl font-black italic uppercase leading-tight tracking-tighter">
                                    {aiResults?.suggestedPath} <span className="opacity-40 text-emerald-500">Protocol</span>
                                </h3>
                                <p className="text-[10px] font-medium opacity-60 leading-relaxed">System scan confirms the {aiResults?.suggestedPath} route as the most effective for your {selectedPart} profile.</p>
                            </div>
                            <button onClick={() => setShowAlert(false)} className="opacity-20 hover:opacity-100 transition-opacity">
                                <CheckCircle2 size={18} />
                            </button>
                        </div>
                        {/* Shimmer Line */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full animate-[shimmer_4s_infinite]" />
                    </div>
                </div>
            )}

            {/* Global Scanning Overlay */}
            {isScanning && (
                <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-3xl ${isDark ? 'bg-black/95' : 'bg-white/95'}`}>
                    <Cpu size={64} className="text-emerald-500 animate-pulse mb-8" />
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">Processing <span className="text-emerald-500">Timeline</span></h3>
                    <div className="w-64 h-1 bg-white/10 mt-6 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                </div>
            )}

            <main className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="max-w-5xl w-full">

                    {/* STEP -2: MANUAL PART SELECTION */}
                    {step === -2 && (
                        <div className="space-y-16 animate-in fade-in duration-1000">
                            <div className="text-center space-y-4">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500">AI Diagnostic Module</h2>
                                <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">Select <span className="text-emerald-500">Target.</span></h1>
                            </div>
                            <div className="max-w-2xl mx-auto space-y-4">
                                {bodyParts.map((part) => (
                                    <button
                                        key={part.id}
                                        onClick={() => handlePartSelect(part.id)}
                                        className={`w-full group flex items-center justify-between p-8 rounded-[2.5rem] border transition-all duration-500 ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-emerald-500/50 hover:bg-white/[0.05]' : 'bg-white border-slate-200 hover:border-emerald-500 shadow-xl shadow-slate-200/40'}`}
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDark ? 'bg-white/5 text-white/40 group-hover:text-emerald-500' : 'bg-slate-50 text-slate-400 group-hover:text-emerald-500 shadow-inner'}`}>
                                                {part.icon}
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-3xl font-black uppercase italic leading-none tracking-tighter">{part.id}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mt-1">{part.label}</p>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-emerald-500/0 group-hover:border-emerald-500/50 flex items-center justify-center transition-all">
                                            <ChevronRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-emerald-500" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP -1: IMAGE UPLOAD */}
                    {step === -1 && (
                        <div className="space-y-12 text-center animate-in zoom-in-95 duration-700">
                            <div className="space-y-4">
                                <h1 className="text-7xl font-black italic uppercase leading-none tracking-tighter">Capture <span className="text-emerald-500">Scan.</span></h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">Biometric probe focused on: {selectedPart}</p>
                            </div>
                            <div onClick={() => fileInputRef.current.click()} className={`group max-w-lg mx-auto h-[450px] border-2 border-dashed rounded-[4rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-700 ${isDark ? 'border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5' : 'border-slate-200 hover:border-emerald-500 bg-white shadow-2xl shadow-slate-200/50'}`}>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity" />
                                    <Camera size={72} className="text-emerald-500 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] italic opacity-40 group-hover:opacity-100 transition-opacity">Sync Optical Input</p>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                            <button onClick={() => setStep(-2)} className="text-[11px] font-black uppercase opacity-20 hover:opacity-100 transition-opacity tracking-[0.3em] border-b border-transparent hover:border-current">← Change Target Zone</button>
                        </div>
                    )}

                    {/* STEP -0.5: SCANNING ANIMATION */}
                    {step === -0.5 && (
                        <div className="relative max-w-sm mx-auto text-center space-y-12 animate-in fade-in duration-1000">
                            <div className="relative rounded-[4rem] overflow-hidden border-[12px] border-white/5 aspect-[3/4] bg-black shadow-2xl">
                                <img src={image} className="w-full h-full object-cover grayscale blur-md opacity-40 scale-110 animate-pulse" />
                                <div className="absolute left-0 w-full h-[3px] bg-emerald-400 shadow-[0_0_40px_#10b981] animate-scan-slow z-20" />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/30 to-transparent opacity-60" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-emerald-500 animate-pulse">Analyzing_Dermis...</h3>
                                <p className="text-[10px] font-mono opacity-30 tracking-widest">MAP_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TREATMENT PATH SELECTION */}
                    {step === 2 && (
                        <div className="space-y-16 w-full animate-in slide-in-from-bottom-10 duration-1000">
                            <div className="text-center space-y-4">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500">Analysis Result</h2>
                                <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none italic">Select <span className="text-emerald-500">Protocol.</span></h1>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {treatmentPaths.map((path) => (
                                    <button
                                        key={path.id}
                                        onClick={() => handleNavigate(path.id)}
                                        className={`relative group p-10 rounded-[4rem] border transition-all duration-700 text-left flex flex-col justify-between h-[480px] overflow-hidden ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-emerald-500/50 hover:bg-white/[0.04]' : 'bg-white border-slate-200 shadow-2xl hover:border-emerald-500'}`}
                                    >
                                        {aiResults.suggestedPath === path.id && (
                                            <div className="absolute top-8 right-8 bg-emerald-500 text-black text-[9px] font-black px-4 py-2 rounded-full uppercase italic tracking-[0.2em] z-20 animate-bounce shadow-lg shadow-emerald-500/20">AI Optimized</div>
                                        )}
                                        <div className="space-y-8 relative z-10">
                                            <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${isDark ? 'bg-white/5 border border-white/10 group-hover:bg-emerald-500/10' : 'bg-slate-50 border border-slate-100 group-hover:bg-emerald-500/5'}`}>
                                                {path.icon}
                                            </div>
                                            <div className="space-y-5">
                                                <div>
                                                    <h3 className="text-4xl font-black italic uppercase leading-none tracking-tighter mb-2">{path.t}</h3>
                                                    <p className="text-[11px] font-black opacity-30 uppercase tracking-[0.3em]">{path.d}</p>
                                                </div>
                                                <p className="text-[13px] font-medium opacity-50 leading-relaxed">{path.info}</p>
                                            </div>
                                        </div>
                                        <div className="relative z-10 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] group-hover:text-emerald-500 transition-colors">
                                            Proceed <ArrowRight size={16} className="group-hover:translate-x-3 transition-transform duration-500" />
                                        </div>

                                        {/* Abstract background shape */}
                                        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-[90px] group-hover:bg-emerald-500/10 transition-all duration-700" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Global Footer */}
            <footer className="p-8 flex justify-between items-center relative z-10 border-t border-white/5">
                <div className="flex items-center gap-4 opacity-30">
                    <Activity size={14} className="animate-spin text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Core Processing Online</span>
                </div>
                <div className="flex gap-8 opacity-20 text-[10px] font-black uppercase tracking-widest">
                    <span>Diagnostic v4.0.2</span>
                    <span>© GlowCare AI</span>
                </div>
            </footer>

            <style>{`
                @keyframes leafFall {
                    0% { transform: translateY(-10vh) rotate(0deg) translateX(0px); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg) translateX(var(--swing-dist)); opacity: 0; }
                }
                @keyframes scan-slow { 0% { top: 0%; } 100% { top: 100%; } }
                @keyframes shimmer {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
                .animate-scan-slow { animation: scan-slow 2.8s ease-in-out infinite; }
            `}</style>
        </div>
    );
}