import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Leaf, Zap, CheckCircle2, ArrowRight, ThermometerSun } from 'lucide-react';
import SignUpModal from './../auth/SignUp.jsx';
import SignInModal from './../auth/SignInModal.jsx';

// --- SMART FLOATING LEAVES ---
const FallingLeaves = ({ isDark }) => {
    const [leaves, setLeaves] = useState([]);
    useEffect(() => {
        setLeaves(Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 10 + 's',
            duration: 15 + Math.random() * 10 + 's',
            size: 15 + Math.random() * 15 + 'px',
        })));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {leaves.map((leaf) => (
                <div key={leaf.id} className="absolute top-[-5%]" style={{
                    left: leaf.left,
                    animation: `fall ${leaf.duration} linear infinite`,
                    animationDelay: leaf.delay,
                }}>
                    <Leaf size={leaf.size} className={`opacity-20 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`} />
                </div>
            ))}
            <style>{`@keyframes fall { 0% { transform: translateY(0vh) rotate(0deg); } 100% { transform: translateY(110vh) rotate(360deg); } }`}</style>
        </div>
    );
};

// props හරහා onLoginSuccess ලබා ගන්නවා
export default function Home({ isDark, onLoginSuccess }) {
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    return (
        <div className={`relative min-h-screen transition-all duration-1000 selection:bg-emerald-500/30 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FAFAFA] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />

            {/* --- MODALS --- */}
            {isSignUpOpen && (
                <SignUpModal isDark={isDark} onClose={() => setIsSignUpOpen(false)} />
            )}

            {isSignInOpen && (
                <SignInModal
                    isDark={isDark}
                    onClose={() => setIsSignInOpen(false)}
                    onLoginSuccess={onLoginSuccess} // මෙතනින් තමයි logic එක සම්බන්ධ වෙන්නේ
                />
            )}

            {/* --- HERO SECTION --- */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 lg:pt-16 pb-12">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                    {/* LEFT CONTENT */}
                    <div className="flex-1 text-center lg:text-left space-y-6 md:space-y-8">
                        <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                            <Sparkles size={12} className="animate-spin-slow" /> Evolution of Skincare
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold leading-[1.05] tracking-tight">
                            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Biology</span> <br />
                            Meets Clinical.
                        </h1>

                        <p className={`text-base md:text-lg font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            We decode Sri Lanka’s unique humidity & UV data to build your skin's perfect defense mechanism. 180 days to flawless.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                            <button
                                onClick={() => setIsSignUpOpen(true)}
                                className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95"
                            >
                                Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => setIsSignInOpen(true)}
                                className={`px-8 py-4 rounded-2xl font-bold border transition-all flex items-center justify-center gap-3 active:scale-95 ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-900'}`}
                            >
                                <Activity size={18} className="text-emerald-500" /> Start Analysis
                            </button>
                        </div>
                    </div>

                    {/* RIGHT CONTENT: IMAGE */}
                    <div className="flex-1 relative w-full max-w-[450px] lg:max-w-[550px]">
                        <div className={`absolute -inset-10 rounded-full blur-[100px] opacity-30 ${isDark ? 'bg-emerald-500/30' : 'bg-emerald-200/50'}`} />
                        <div className="relative group overflow-hidden rounded-[35px] shadow-2xl transition-transform duration-700 hover:scale-[1.01]">
                            <img
                                src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=2000&auto=format&fit=crop"
                                alt="Skincare Professional"
                                className={`w-full h-[400px] lg:h-[550px] object-cover transition-all duration-1000 group-hover:scale-110 ${isDark ? 'brightness-75 contrast-125' : 'brightness-100'}`}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* --- SMART BENTO GRID --- */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-8 rounded-[35px] border transition-all hover:border-emerald-500/50 ${isDark ? 'bg-[#0E0E10] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/30'}`}>
                    <div className="flex justify-between items-start mb-6">
                        <ThermometerSun className="text-orange-500" size={32} />
                        <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-[8px] font-black uppercase rounded-md tracking-widest">Live Sync</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1 tracking-tight">Climate Adaptation</h3>
                    <p className="text-xs opacity-60 leading-relaxed mb-4">Your routine updates with Colombo's UV/Humidity index.</p>
                </div>

                <button
                    onClick={() => setIsSignInOpen(true)}
                    className={`md:col-span-2 group relative overflow-hidden rounded-[35px] p-10 transition-all hover:shadow-2xl text-left ${isDark ? 'bg-blue-600' : 'bg-slate-900'} text-white`}
                >
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <Activity className="text-emerald-400 mb-6" size={36} />
                        <div>
                            <h2 className="text-2xl font-extrabold mb-1 tracking-tight">Precision Analysis</h2>
                            <p className="text-blue-100/70 text-xs max-w-sm">Comparing your skin against 5000+ local sensitivity profiles.</p>
                        </div>
                    </div>
                    <div className="absolute top-8 right-8 bg-white/10 p-2.5 rounded-full backdrop-blur-md group-hover:bg-emerald-500 transition-colors">
                        <ArrowRight size={18} />
                    </div>
                </button>
            </section>
        </div>
    );
}