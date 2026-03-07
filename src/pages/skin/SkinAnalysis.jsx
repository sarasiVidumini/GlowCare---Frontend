import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, Activity, Leaf, Cpu, Camera,
    Zap, Sparkles, CheckCircle2, Scissors,
    Hand, Footprints, ScanFace, Sprout, Thermometer, ChevronRight,
    ShieldCheck, BarChart3
} from 'lucide-react';

// --- LEAF ANIMATION COMPONENT ---
const FallingLeaves = ({ isDark }) => {
    const [leaves, setLeaves] = useState([]);
    useEffect(() => {
        const leafIcons = Array.from({ length: 10 }).map((_, i) => ({
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

    const playScanCompleteSound = () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const masterGain = audioCtx.createGain();
        masterGain.connect(audioCtx.destination);

        const playTone = (freq, startTime, duration, vol) => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + duration);
            g.gain.setValueAtTime(0, startTime);
            g.gain.linearRampToValueAtTime(vol, startTime + 0.05);
            g.gain.linearRampToValueAtTime(0, startTime + duration);
            osc.connect(g);
            g.connect(masterGain);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        playTone(440, audioCtx.currentTime, 0.5, 0.1);
        playTone(880, audioCtx.currentTime + 0.1, 0.4, 0.08);
        playTone(1320, audioCtx.currentTime + 0.2, 0.3, 0.05);
    };

    const bodyParts = [
        {
            id: 'Face',
            label: 'Facial Dermis',
            info: 'Hydration & texture analysis.',
            icon: <ScanFace size={20} />,
            img: "https://images.pexels.com/photos/3762871/pexels-photo-3762871.jpeg?auto=compress&cs=tinysrgb&w=800",
            grid: "md:col-span-2 md:row-span-2"
        },
        {
            id: 'Hair',
            label: 'Follicle Matrix',
            info: 'Root strength check.',
            icon: <Scissors size={20} />,
            img: "https://images.pexels.com/photos/973401/pexels-photo-973401.jpeg?auto=compress&cs=tinysrgb&w=800",
            grid: "md:col-span-2 md:row-span-1"
        },
        {
            id: 'Hands',
            label: 'Palmar Surface',
            info: 'Moisture levels.',
            icon: <Hand size={20} />,
            img: "https://images.pexels.com/photos/286951/pexels-photo-286951.jpeg?auto=compress&cs=tinysrgb&w=800",
            grid: "md:col-span-1 md:row-span-1"
        },
        {
            id: 'Legs',
            label: 'Dermal Layer',
            info: 'Skin tone analysis.',
            icon: <Footprints size={20} />,
            img: "https://images.pexels.com/photos/1619488/pexels-photo-1619488.jpeg?auto=compress&cs=tinysrgb&w=800",
            grid: "md:col-span-1 md:row-span-1"
        }
    ];

    const treatmentPaths = [
        { id: 'Natural', t: 'Natural', d: 'Botanical Repair', info: 'Pure plant-based extracts designed to heal the skin barrier naturally without synthetic additives.', icon: <Leaf />, color: 'emerald' },
        { id: 'Chemical', t: 'Chemical', d: 'Molecular Science', info: 'Clinically proven active compounds that target deep cellular repair for immediate results.', icon: <Zap />, color: 'blue' },
        { id: 'Ayurvedic', t: 'Ayurvedic', d: 'Vedic Wisdom', info: 'Time-tested herbal remedies focused on balancing energy and long-term detoxification.', icon: <Sprout />, color: 'amber' }
    ];

    const handlePartSelect = (id) => {
        setSelectedPart(id);
        setStep(-1);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setStep(-0.5);

            // Logic to determine the best treatment based on selected body part
            let suggestion = 'Natural';
            if (selectedPart === 'Face') suggestion = 'Natural';
            else if (selectedPart === 'Hair') suggestion = 'Chemical';
            else if (selectedPart === 'Hands' || selectedPart === 'Legs') suggestion = 'Ayurvedic';

            setTimeout(() => {
                setAiResults({ healthScore: 85, suggestedPath: suggestion });
                setStep(2);
                setShowAlert(true);
                playScanCompleteSound(); // Alert sound triggers here
                setTimeout(() => setShowAlert(false), 6000);
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
        <div className={`min-h-screen flex flex-col font-sans transition-all duration-1000 relative overflow-hidden ${isDark ? 'bg-[#030303] text-white' : 'bg-[#FDFDFD] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />

            {/* AI SUGGESTION ALERT */}
            {showAlert && (
                <div className="fixed top-6 right-6 z-[250] w-full max-w-[340px] animate-in slide-in-from-right-full duration-700">
                    <div className={`relative overflow-hidden p-5 rounded-[1.5rem] border shadow-xl backdrop-blur-3xl ${isDark ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-white border-emerald-200'}`}>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">AI Recommendation</p>
                                <h3 className="text-lg font-black italic uppercase leading-tight">{aiResults?.suggestedPath} Protocol Selected</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isScanning && (
                <div className={`fixed inset-0 z-[300] flex flex-col items-center justify-center backdrop-blur-3xl ${isDark ? 'bg-black/90' : 'bg-white/90'}`}>
                    <Cpu size={50} className="text-emerald-500 animate-spin-slow mb-6" />
                    <div className="w-56 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                    <p className="mt-4 text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500">Processing Matrix</p>
                </div>
            )}

            <main className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="max-w-6xl w-full">
                    {step === -2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <BarChart3 size={12} className="text-emerald-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Scanner V3.2</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight">Choose <span className="text-emerald-500">Target.</span></h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px]">
                                {bodyParts.map((part) => (
                                    <button
                                        key={part.id}
                                        onClick={() => handlePartSelect(part.id)}
                                        className={`${part.grid} group relative overflow-hidden rounded-[2rem] border transition-all duration-500 bg-neutral-900 ${isDark ? 'border-white/5 hover:border-emerald-500/40' : 'border-slate-200 hover:border-emerald-500 shadow-lg'}`}
                                    >
                                        <img src={part.img} alt={part.id} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-90" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end items-start z-10">
                                            <div className="mb-3 p-2 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-500">
                                                {part.icon}
                                            </div>
                                            <h3 className="text-2xl font-black uppercase italic leading-none text-white">{part.id}</h3>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500 mt-1">{part.label}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === -1 && (
                        <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
                            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tight">Sync <span className="text-emerald-500">Visuals.</span></h1>
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className={`group relative max-w-xl mx-auto h-[380px] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${isDark ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500' : 'bg-white border-emerald-500/20 shadow-xl'}`}
                            >
                                <div className="p-6 rounded-full bg-emerald-500/10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                                    <Camera size={50} strokeWidth={1.5} />
                                </div>
                                <div className="text-center px-6">
                                    <p className="text-[12px] font-black uppercase tracking-widest text-emerald-500 mb-1">Initialize Optical Link</p>
                                    <p className="text-[9px] uppercase opacity-40 font-bold italic tracking-widest text-center">RAW • JPG • PNG</p>
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </div>
                    )}

                    {step === -0.5 && (
                        <div className="relative max-w-sm mx-auto text-center space-y-8 animate-in fade-in duration-500">
                            <div className="relative rounded-[3rem] overflow-hidden border-[10px] border-emerald-500/5 aspect-[3/4] bg-black shadow-2xl">
                                <img src={image} className="w-full h-full object-cover grayscale opacity-50" />
                                <div className="absolute left-0 w-full h-[3px] bg-emerald-400 shadow-[0_0_30px_#10b981] animate-scan-slow z-20" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase italic text-emerald-500 animate-pulse tracking-tight">Analyzing_Matrix</h3>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Decrypting Dermal Layers</p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10 w-full animate-in slide-in-from-bottom-5 duration-700">
                            <div className="text-center">
                                <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tight">Select <span className="text-emerald-500">Protocol.</span></h1>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mt-2">Optimized AI Pathways</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {treatmentPaths.map((path) => (
                                    <button
                                        key={path.id}
                                        onClick={() => handleNavigate(path.id)}
                                        className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 h-[450px] flex flex-col justify-between overflow-hidden text-left ${isDark ? 'bg-white/[0.03] border-white/5 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500 shadow-xl'} ${aiResults?.suggestedPath === path.id ? 'ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : ''}`}
                                    >
                                        <div className="relative z-10">
                                            <div className={`w-14 h-14 rounded-2xl bg-${path.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-${path.color}-500/20`}>
                                                {React.cloneElement(path.icon, { size: 24, className: `text-${path.color}-500` })}
                                            </div>
                                            <h3 className="text-3xl font-black italic uppercase leading-tight mb-2 tracking-tighter">{path.t}</h3>
                                            <p className={`text-[9px] font-black uppercase tracking-widest mb-4 text-${path.color}-500`}>{path.d}</p>
                                            <p className="text-[13px] leading-relaxed opacity-60 font-medium">
                                                {path.info}
                                            </p>
                                        </div>
                                        <div className={`relative z-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest group-hover:text-${path.color}-500 transition-colors`}>
                                            Start Protocol <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="p-8 flex justify-between items-center border-t border-white/5 text-[9px] font-black uppercase tracking-widest opacity-30">
                <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>System Optimal</span>
                </div>
                <span>© GlowCare 2026</span>
            </footer>

            <style>{`
                @keyframes leafFall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                @keyframes scan-slow { 
                    0% { top: 0%; opacity: 0.3; } 
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0.3; } 
                }
                .animate-scan-slow { animation: scan-slow 2.5s ease-in-out infinite; }
                .animate-spin-slow { animation: spin 8s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}