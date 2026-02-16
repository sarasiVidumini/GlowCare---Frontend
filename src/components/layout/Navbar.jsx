import React, { useState } from 'react';
import { Search, User, Droplets, Menu, X, Sparkles, Sun, Moon, LogOut, ChevronDown, ShieldCheck, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ isDark, toggleTheme, user, onSignInClick, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${
            isDark ? 'bg-[#050505]/80 border-white/5 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
        } backdrop-blur-xl`}>
            <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">

                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2 font-black text-xl md:text-2xl tracking-tighter group">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:rotate-12 transition-transform">
                        <Droplets fill="currentColor" size={20} />
                    </div>
                    <span>GLOW<span className="text-emerald-500">CARE</span></span>
                </Link>

                {/* DESKTOP LINKS (Hidden on Tablet/Mobile) */}
                <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest opacity-80">
                    <Link to="/analysis" className="hover:text-emerald-500 transition-colors relative group">Analysis</Link>
                    <Link to="/timeline" className="hover:text-emerald-500 transition-colors relative group">Treatment + Routine</Link>
                    <Link to="/appointments" className="hover:text-emerald-500 transition-colors relative group">Doctors</Link>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* DESKTOP USER/SIGN-IN (Hidden on Tablet/Mobile) */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user ? (
                            <div className="relative flex items-center gap-3">
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-3 px-3 py-1.5 rounded-2xl transition-all border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="hidden sm:block text-right">
                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter mb-0.5">
                                            {user.email === 'admin@glowcare.ai' ? 'Main Admin' : (user.role === 'expert' ? 'Verified Expert' : 'Verified User')}
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
                            <button onClick={onSignInClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg ${isDark ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                                <LogIn size={14} /> <span>Sign In</span>
                            </button>
                        )}
                    </div>

                    {/* THEME TOGGLE (Always visible) */}
                    <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-colors ${isDark ? 'text-yellow-400 hover:bg-white/10' : 'text-blue-600 hover:bg-black/5'}`}>
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* MOBILE MENU TOGGLE (Visible only on Tablet/Mobile) */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`lg:hidden p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU CONTENT */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100 border-t border-dashed border-slate-700/20' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col p-6 gap-6">
                    {/* Navigation Links */}
                    <div className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-widest">
                        <Link to="/analysis" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-500">Analysis</Link>
                        <Link to="/timeline" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-500">Treatment + Routine</Link>
                        <Link to="/appointments" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-500">Doctors</Link>
                    </div>

                    {/* Mobile Sign-In / User Info Section */}
                    <div className={`pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        {user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500"><User size={20} /></div>
                                    <div>
                                        <p className="text-[12px] font-bold">{user.name}</p>
                                        <p className="text-[10px] opacity-50">{user.email}</p>
                                    </div>
                                </div>
                                {user.email === 'admin@glowcare.ai' && (
                                    <Link to="/user-profiles" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500">
                                        <ShieldCheck size={14} /> Manage Profiles
                                    </Link>
                                )}
                                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-[10px] font-black uppercase text-red-500">
                                    <LogOut size={14} /> Logout Access
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => { onSignInClick(); setIsMenuOpen(false); }} className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest ${isDark ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                                <LogIn size={16} /> Sign In to GlowCare
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}