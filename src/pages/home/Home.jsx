import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Activity, ShieldCheck, ThermometerSun, ArrowRight, MousePointerClick, Moon, Sun, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- FALLING LEAVES COMPONENT ---
const FallingLeaves = ({ isDark }) => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        const leafIcons = Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 12 + 's',
            duration: 15 + Math.random() * 15 + 's',
            size: 10 + Math.random() * 20 + 'px',
            swing: 20 + Math.random() * 40 + 'px'
        }));
        setLeaves(leafIcons);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    className="absolute top-[-10%]"
                    style={{
                        left: leaf.left,
                        animation: `leafFall ${leaf.duration} linear infinite`,
                        animationDelay: leaf.delay,
                        '--swing-dist': leaf.swing
                    }}
                >
                    <Leaf
                        size={leaf.size}
                        className={`transition-colors duration-1000 ${
                            isDark ? 'text-emerald-500/20 shadow-emerald-500/50' : 'text-emerald-800/10'
                        }`}
                        style={{ transform: `rotate(${Math.random() * 360}deg)` }}
                    />
                </div>
            ))}
            <style>{`
                @keyframes leafFall {
                    0% { transform: translateY(0vh) rotate(0deg) translateX(0px); opacity: 0; }
                    10% { opacity: 1; }
                    50% { transform: translateY(50vh) rotate(180deg) translateX(var(--swing-dist)); }
                    100% { transform: translateY(110vh) rotate(360deg) translateX(0px); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

// --- Home Component එකට Props එකතු කර ඇත ---
export default function Home({ isDark, toggleTheme }) {

    // ** වැදගත්: මෙහි තිබූ local isDark useState සහ toggle function එක ඉවත් කරන ලදී. **
    // දැන් සියල්ල පාලනය වන්නේ App.jsx හරහා එන toggleTheme props එකෙනි.

    return (
        <div className={`relative min-h-screen overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#0A0A0B] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>

            {/* Falling Leaves Animation Layer */}
            <FallingLeaves isDark={isDark} />

            {/* --- DESIGNER BACKGROUND ELEMENTS --- */}
            <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 transition-colors ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-100/40'}`} />
            <div className={`absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full blur-[100px] -z-10 transition-colors ${isDark ? 'bg-blue-900/20' : 'bg-blue-100/30'}`} />

            {/* --- FLOATING THEME TOGGLE --- */}
            {/* මෙම Button එක දැන් App.jsx හි state එක පාලනය කරයි */}
            <button
                onClick={toggleTheme}
                className={`fixed top-8 right-8 z-50 p-4 rounded-2xl shadow-xl transition-all ${isDark ? 'bg-white/5 text-yellow-500 border border-white/10 hover:scale-110 active:scale-95' : 'bg-white text-blue-600 border border-slate-100 hover:scale-110 active:scale-95'}`}
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* --- HERO SECTION --- */}
            <section className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto text-center space-y-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm transition-colors ${isDark ? 'bg-white/5 border border-white/5' : 'bg-white border border-slate-200'}`}>
                    <Sparkles className="text-emerald-500" size={16} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Powered by Sri Lankan Climate Data</span>
                </div>

                <h1 className={`text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    The Future of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                        Skin Intelligence.
                    </span>
                </h1>

                <p className={`max-w-2xl mx-auto text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    A precise 180-day routing system merging <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}>Ayurvedic wisdom</span> with
                    <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}> Clinical chemistry</span>.
                </p>

                {/* SMART SEARCH BAR */}
                <div className="max-w-3xl mx-auto relative mt-12 group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className={`relative flex items-center p-2 rounded-[2rem] border transition-all ${isDark ? 'bg-[#141417] border-white/5 shadow-2xl shadow-black' : 'bg-white border-white shadow-2xl shadow-slate-200/50'}`}>
                        <div className="flex items-center flex-1 px-6">
                            <Search className="text-slate-500" size={22} />
                            <input
                                type="text"
                                placeholder="Enter an ingredient..."
                                className={`w-full p-5 bg-transparent outline-none font-medium ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-400'}`}
                            />
                        </div>
                        <button className="bg-emerald-600 text-white px-10 py-5 rounded-[1.5rem] font-bold hover:bg-emerald-500 transition-all flex items-center gap-3">
                            Analyze <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* --- SMART BENTO GRID --- */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Analysis Card */}
                <Link to="/analysis" className={`md:col-span-2 group relative overflow-hidden rounded-[2.5rem] p-10 transition-all hover:scale-[0.98] ${isDark ? 'bg-blue-600' : 'bg-slate-900'} text-white`}>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <Activity className={`${isDark ? 'text-white' : 'text-emerald-400'} mb-8`} size={40} />
                        <div>
                            <h2 className="text-3xl font-bold mb-2 tracking-tight">Smart Analysis</h2>
                            <p className={`${isDark ? 'text-blue-100' : 'text-slate-400'} text-sm`}>Determine your sensitivity profile and lock in your roadmap.</p>
                        </div>
                    </div>
                    <MousePointerClick className="absolute bottom-8 right-8 text-white/20 group-hover:scale-110 transition-transform" size={60} />
                </Link>

                {/* Climate Widget */}
                <div className={`rounded-[2.5rem] p-10 border transition-all ${isDark ? 'bg-[#141417] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <ThermometerSun className="text-orange-500 mb-4" size={32} />
                    <div>
                        <h3 className={`font-bold text-xl mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Climate Sync</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-4 tracking-widest">Colombo, LK</p>
                        <div className="flex items-end gap-2 text-3xl font-black transition-colors">
                            82% <span className="text-xs font-medium text-slate-500 mb-1">Humidity</span>
                        </div>
                    </div>
                </div>

                {/* Doctor Hub */}
                <Link to="/appointments" className={`rounded-[2.5rem] p-10 border transition-all group ${isDark ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100'}`}>
                    <ShieldCheck className="text-emerald-500" size={32} />
                    <div>
                        <h3 className={`font-bold text-xl mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-900'}`}>Specialist Network</h3>
                        <p className={`text-sm ${isDark ? 'text-emerald-700' : 'text-emerald-800/60'}`}>Instant reaction reporting.</p>
                    </div>
                </Link>

            </section>

            {/* --- PROGRESS PREVIEW --- */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className={`rounded-[3rem] p-12 border transition-all flex flex-col md:flex-row items-center justify-between gap-12 ${isDark ? 'bg-[#141417] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
                    <div className="max-w-md">
                        <h3 className="text-4xl font-black mb-4 tracking-tighter">The 180-Day Protocol.</h3>
                        <p className={`${isDark ? 'text-slate-500' : 'text-slate-500'} mb-8`}>3 distinct phases to ensure your skin barrier is never compromised.</p>
                        <Link to="/timeline" className="inline-flex items-center gap-2 font-black text-emerald-500 hover:gap-4 transition-all">
                            View My Timeline <ArrowRight size={20}/>
                        </Link>
                    </div>

                    <div className="flex gap-4">
                        {['Natural', 'Ayurvedic', 'Chemical'].map((type, i) => (
                            <div key={type} className={`w-24 h-48 rounded-full flex flex-col items-center justify-between py-6 border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 hover:border-emerald-300'}`}>
                                <span className={`text-[10px] font-black uppercase vertical-text ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{type}</span>
                                <div className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center font-bold ${isDark ? 'bg-[#141417] text-white' : 'bg-white text-slate-800'}`}>
                                    0{i+1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}