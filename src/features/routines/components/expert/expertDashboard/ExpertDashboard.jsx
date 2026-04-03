import React, { useState, useEffect, useMemo } from 'react';
import { Users, Activity, ShieldCheck, User, Globe, Zap, X, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function ExpertDashboard({ isDark }) {
    // 1. Robust Session Retrieval with Memoization
    const activeUser = useMemo(() =>
            JSON.parse(localStorage.getItem('activeUser') || localStorage.getItem('currentUser') || '{}'),
        []);

    const [dashboardData, setDashboardData] = useState({ allExperts: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!activeUser?.email) {
                setError("No active session found.");
                setLoading(false);
                return;
            }

            try {
                const rawToken = localStorage.getItem('jwt_token') || localStorage.getItem('token');
                const cleanToken = rawToken?.replace(/"/g, '').trim();

                if (!cleanToken || cleanToken === 'null') {
                    throw new Error("Authentication token missing.");
                }

                const res = await axios.get(`http://localhost:8080/api/v1/experts/dashboard`, {
                    params: { email: activeUser.email },
                    headers: {
                        'Authorization': `Bearer ${cleanToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                setDashboardData(res.data);
            } catch (err) {
                console.error("Dashboard Sync Failed:", err);
                setError(err.response?.status === 401 ? "Session Expired." : "Clinical Database Offline.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [activeUser.email]);

    // Role Guard
    const isExpert = activeUser?.role?.toUpperCase() === 'EXPERT';
    if (!isExpert) return (
        <div className="h-screen flex items-center justify-center bg-[#09090B] text-white font-black uppercase italic tracking-[0.3em] text-xs">
            Access Denied: Specialist Credentials Required
        </div>
    );

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#F8FAFC] text-emerald-500 font-black animate-pulse uppercase tracking-[0.3em] text-xs">
            Authenticating Specialist Nexus...
        </div>
    );

    return (
        <div className={`min-h-screen p-6 md:p-12 transition-colors duration-500 ${isDark ? 'bg-[#09090B] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>

            {/* 🛰️ HEADER */}
            <header className="mb-16 flex justify-between items-end border-b border-slate-200/50 pb-10">
                <div>
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Super Expert.</h1>
                    <div className="flex items-center gap-3 mt-6">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-emerald-500 font-black uppercase text-[9px] tracking-[0.3em]">Nexus Specialist Workspace</p>
                        </div>
                        <p className="opacity-40 font-bold uppercase text-[9px] tracking-widest border-l border-slate-300 pl-3">
                            ID: {dashboardData?.expertId || '000'} // {dashboardData?.fullName}
                        </p>
                    </div>
                </div>
                <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-black uppercase opacity-30 tracking-[0.4em]">Clearance</p>
                    <p className="text-2xl font-black italic text-emerald-500">{dashboardData?.systemAccessLevel || 'LEVEL 4'}</p>
                </div>
            </header>

            {/* 📊 STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {[
                    { label: 'Personal Consultations', val: dashboardData?.totalConsultations || 0, icon: Users, color: 'text-blue-500' },
                    { label: 'Pending Queries', val: dashboardData?.pendingQueries || 0, icon: Activity, color: 'text-emerald-500' },
                    { label: 'Field Domain', val: dashboardData?.expertiseArea || 'Expert', icon: ShieldCheck, color: 'text-orange-500', isText: true }
                ].map((stat, i) => (
                    <div key={i} className={`group p-10 rounded-[4rem] border transition-all duration-500 ${isDark ? 'bg-[#121214] border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
                        <stat.icon className={`${stat.color} mb-8`} size={40} />
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">{stat.label}</p>
                        <h2 className={`font-black italic mt-2 tracking-tighter ${stat.isText ? 'text-3xl uppercase text-orange-500' : 'text-7xl'}`}>
                            {stat.val}
                        </h2>
                    </div>
                ))}
            </div>

            {/* 🏥 CLINICAL NETWORK */}
            <div className="mb-12 flex justify-between items-center">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Global Clinical Network</h3>
                <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.3em]">Directory v2.0</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {dashboardData?.allExperts?.map((expert) => (
                    <div key={expert.id} className={`group relative p-10 rounded-[3.5rem] border transition-all duration-500 flex flex-col justify-between ${
                        isDark ? 'bg-[#121214] border-white/5' : 'bg-white border-slate-100 shadow-lg hover:shadow-2xl'
                    }`}>
                        <div>
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                    <User size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-xl uppercase italic tracking-tighter leading-none">{expert.fullName}</h4>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <Globe size={10} className="text-emerald-500" />
                                        <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">{expert.expertiseArea}</p>
                                    </div>
                                </div>
                            </div>

                            {/* ⚡ THE JOINED USERS FIX */}
                            <div className={`p-8 rounded-[2.5rem] mb-10 ${isDark ? 'bg-white/5' : 'bg-[#F8FAFC]'}`}>
                                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">Joined Users</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-5xl font-black italic text-blue-600 leading-none">
                                        {/* Tries multiple key variations from backend */}
                                        {expert.totalUsersCount ?? expert.joinedUsers ?? expert.totalUsers ?? 0}
                                    </p>
                                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-[9px] font-black uppercase tracking-tighter">
                                        <Zap size={10} fill="currentColor" /> Active
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mb-8">
                            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-transparent hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-100 group-hover:border-emerald-500">
                                View Full Profile <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2 opacity-30">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Protected Clinical Entry</span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                                Active Status
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-20" />
        </div>
    );
}