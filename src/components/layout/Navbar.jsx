import React, { useState } from 'react';
import { Search, User, Droplets, Menu, X, Sparkles, Sun, Moon, LogOut, ChevronDown, ShieldCheck, LogIn, LayoutDashboard, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Import the new Notification Dashboard
import NotificationDashboard from '../../features/routines/components/NotificationDashboard.jsx';

export default function Navbar({ isDark, toggleTheme, user, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // State to control the Notification Dashboard
    const [showNotifDash, setShowNotifDash] = useState(false);

    const navigate = useNavigate();

    const isAdmin = user?.email === 'admin@glowcare.ai';

    // Notice we wrap everything in a Fragment <></> so the modal can sit OUTSIDE the <nav>
    return (
        <>
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

                    {/* DESKTOP LINKS */}
                    <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest opacity-80">
                        <Link to="/analysis" className="hover:text-emerald-500 transition-colors">Analysis</Link>
                        <Link to="/timeline" className="hover:text-emerald-500 transition-colors">Treatment + Routine</Link>
                        <Link to="/appointments" className="hover:text-emerald-500 transition-colors">Doctors</Link>

                        {/* SMART ADMIN LINK: Only visible to Admin */}
                        {isAdmin && (
                            <Link to="/admin/dashboard" className="flex items-center gap-2 text-emerald-500 hover:opacity-80 transition-all">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Admin Nexus
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden lg:flex items-center gap-4">
                            {user ? (
                                <div className="relative flex items-center gap-3">
                                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-3 px-3 py-1.5 rounded-2xl transition-all border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="hidden sm:block text-right">
                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter mb-0.5">
                                                {isAdmin ? 'Main Admin' : (user.role === 'expert' ? 'Verified Expert' : 'Verified User')}
                                            </p>
                                            <p className="text-[12px] font-bold tracking-tight">{user.name}</p>
                                        </div>
                                        <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500"><User size={18} /></div>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isProfileOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                                            <div className={`absolute top-full right-0 mt-3 w-60 rounded-[24px] border p-2 shadow-2xl ${isDark ? 'bg-[#0f0f10] border-white/10' : 'bg-white border-slate-100'}`}>
                                                <div className="px-4 py-3 mb-2 border-b border-dashed border-slate-700/20">
                                                    <p className="text-[10px] opacity-50 uppercase font-black text-emerald-500 tracking-widest">Authorized Access</p>
                                                    <p className="text-[11px] font-bold truncate mt-1">{user.email}</p>
                                                </div>

                                                {/* Admin Dashboard Quick Link */}
                                                {isAdmin && (
                                                    <Link to="/admin/dashboard" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-500/10 text-emerald-500 transition-all font-black uppercase text-[10px] tracking-widest mb-1">
                                                        <LayoutDashboard size={16} /> Dashboard Nexus
                                                    </Link>
                                                )}

                                                {isAdmin && (
                                                    <Link to="/user-profiles" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-500/10 text-emerald-500 transition-all font-black uppercase text-[10px] tracking-widest mb-1">
                                                        <ShieldCheck size={16} /> Manage Profiles
                                                    </Link>
                                                )}

                                                <button onClick={() => { onLogout(); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase text-[10px] tracking-widest">
                                                    <LogOut size={16} /> Terminate Session
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <button onClick={() => navigate('/sign-in')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg ${isDark ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                                    <LogIn size={14} /> <span>Sign In</span>
                                </button>
                            )}
                        </div>

                        {/* NOTIFICATION BELL: Visible to Everyone */}
                        <button
                            onClick={() => setShowNotifDash(true)}
                            className={`relative p-2.5 rounded-xl transition-colors ${isDark ? 'text-emerald-400 hover:bg-white/10' : 'text-emerald-600 hover:bg-black/5'}`}
                            title="Notification Center"
                        >
                            <Bell size={18} />
                            {/* Red dot indicator */}
                            <span className={`absolute top-2 right-2 w-2 h-2 bg-rose-500 border rounded-full ${isDark ? 'border-[#050505]' : 'border-white'}`}></span>
                        </button>

                        {/* THEME TOGGLE */}
                        <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-colors ${isDark ? 'text-yellow-400 hover:bg-white/10' : 'text-blue-600 hover:bg-black/5'}`}>
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2.5 rounded-xl transition-colors">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[600px] opacity-100 border-t border-dashed border-slate-700/20' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col p-8 gap-8">
                        <div className="flex flex-col gap-5 text-[12px] font-black uppercase tracking-[0.2em]">
                            <Link to="/analysis" onClick={() => setIsMenuOpen(false)}>Analysis</Link>
                            <Link to="/timeline" onClick={() => setIsMenuOpen(false)}>Treatment + Routine</Link>
                            <Link to="/appointments" onClick={() => setIsMenuOpen(false)}>Doctors</Link>
                            {isAdmin && (
                                <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="text-emerald-500">Dashboard Nexus</Link>
                            )}
                        </div>

                        <div className={`pt-8 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                            {user ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500"><User size={24} /></div>
                                        <div>
                                            <p className="text-[14px] font-black">{user.name}</p>
                                            <p className="text-[10px] opacity-40 uppercase font-bold">{user.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest">
                                        Logout Access
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => { navigate('/sign-in'); setIsMenuOpen(false); }} className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest ${isDark ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                                    Sign In to GlowCare
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* 🔥 MOVED OUTSIDE NAV: NOTIFICATION DASHBOARD MODAL */}
            <NotificationDashboard
                isDark={isDark}
                isOpen={showNotifDash}
                onClose={() => setShowNotifDash(false)}
                isAdmin={isAdmin}
            />
        </>
    );
}