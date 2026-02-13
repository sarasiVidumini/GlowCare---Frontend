import React, { useState } from 'react';
import { Search, User, Droplets, Menu, X, Sparkles, Sun, Moon, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ isDark, toggleTheme, user, onSignInClick, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${
            isDark ? 'bg-[#050505]/80 border-white/5 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
        } backdrop-blur-xl`}>
            <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">

                <Link to="/" className="flex items-center gap-2 font-black text-xl md:text-2xl tracking-tighter group">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:rotate-12 transition-transform">
                        <Droplets fill="currentColor" size={20} />
                    </div>
                    <span>GLOW<span className="text-emerald-500">CARE</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest opacity-80">
                    <Link to="/analysis" className="hover:text-emerald-500 transition-colors relative group">Analysis</Link>
                    <Link to="/timeline" className="hover:text-emerald-500 transition-colors relative group">Treatment + Routine</Link>
                    <Link to="/appointments" className="hover:text-emerald-500 transition-colors relative group">Doctors</Link>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {user ? (
                        <div className="relative flex items-center gap-3">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-3 px-3 py-1.5 rounded-2xl transition-all border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="hidden sm:block text-right">
                                    {/* --- MAIN ADMIN DISPLAY LOGIC --- */}
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter mb-0.5">
                                        {user.email === 'admin@glowcare.ai'
                                            ? 'Main Admin'
                                            : (user.role === 'expert' ? 'Verified Expert' : 'Verified User')}
                                    </p>
                                    <p className="text-[12px] font-bold tracking-tight">{user.name}</p>
                                </div>
                                <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500"><User size={18} /></div>
                                <ChevronDown size={14} />
                            </button>

                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                                    <div className={`absolute top-full right-0 mt-3 w-56 rounded-[20px] border p-2 shadow-2xl ${isDark ? 'bg-[#0f0f10] border-white/10' : 'bg-white border-slate-100'}`}>
                                        <div className="px-3 py-2 mb-1 border-b border-dashed border-slate-700/20">
                                            <p className="text-[10px] opacity-50 uppercase font-black text-emerald-500">Account Control</p>
                                            <p className="text-[11px] font-bold truncate">{user.email}</p>
                                        </div>

                                        {/* ADMIN LINK */}
                                        {user.email === 'admin@glowcare.ai' && (
                                            <Link to="/user-profiles" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-emerald-500 hover:bg-emerald-500/10 transition-all font-black uppercase text-[10px] tracking-widest mb-1">
                                                <ShieldCheck size={16} /> Manage Profiles
                                            </Link>
                                        )}

                                        <button onClick={() => { onLogout(); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase text-[10px]">
                                            <LogOut size={16} /> Logout Access
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <button onClick={onSignInClick} className="p-2.5 rounded-full"><User size={20} className="text-emerald-500" /></button>
                    )}

                    <button onClick={toggleTheme} className={`p-2.5 rounded-xl ${isDark ? 'text-yellow-400' : 'text-blue-600'}`}>{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
                </div>
            </div>
        </nav>
    );
}