import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, Lock, SearchX } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export default function NotFound({ isDark, toggleTheme, user, setIsSignInOpen }) {
    const navigate = useNavigate();

    // Determine if this is a 404 (Bad URL) or a 403 (Access Restricted)
    const isRestricted = !user;

    // Beautiful SVG illustration URLs (UnDraw)
    const illustration404 = "https://illustrations.popsy.co/emerald/falling.svg";
    const illustration403 = "https://illustrations.popsy.co/emerald/key.svg";

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-700 ${isDark ? 'bg-[#030303]' : 'bg-[#FDFDFD]'}`}>
            <Navbar isDark={isDark} toggleTheme={toggleTheme} user={user} setIsSignInOpen={setIsSignInOpen} />

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className={`p-8 md:p-12 rounded-[2.5rem] border max-w-lg w-full shadow-2xl ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-100'}`}>

                    {/* Hero Illustration */}
                    <div className="flex justify-center mb-8">
                        <div className="relative group">
                            <img
                                src={isRestricted ? illustration403 : illustration404}
                                alt="Status Illustration"
                                className="w-48 h-48 md:w-56 md:h-56 object-contain transform group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Floating Icon Overlay */}
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-3 rounded-2xl shadow-xl shadow-emerald-500/40">
                                {isRestricted ? (
                                    <ShieldAlert className="w-6 h-6 text-white" />
                                ) : (
                                    <SearchX className="w-6 h-6 text-white" />
                                )}
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-3 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                        {isRestricted ? "Access Restricted" : "Page Not Found"}
                    </h1>

                    <p className={`text-sm font-medium mb-8 leading-relaxed px-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isRestricted
                            ? "Premium clinical features like Skin Analysis and Routines require an active GlowCare account."
                            : "We couldn't find the page you're looking for. It might have been moved, deleted, or never existed."}
                    </p>

                    <div className="flex flex-col gap-3">
                        {isRestricted && (
                            <button
                                onClick={() => setIsSignInOpen(true)}
                                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <Lock size={14} /> Sign In to Access
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/')}
                            className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                        >
                            <Home size={14} /> Return to Home
                        </button>
                    </div>
                </div>
            </main>

            <Footer isDark={isDark} />
        </div>
    );
}