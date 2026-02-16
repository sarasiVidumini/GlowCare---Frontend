import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { ArrowLeft, Zap, Star, ShieldCheck, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const data = [
    { day: 'Day 0', health: 40, texture: 35, hydration: 30 },
    { day: 'Day 30', health: 48, texture: 42, hydration: 45 },
    { day: 'Day 60', health: 55, texture: 58, hydration: 60 },
    { day: 'Day 90', health: 70, texture: 72, hydration: 75 },
    { day: 'Day 120', health: 82, texture: 80, hydration: 85 },
    { day: 'Day 180', health: 95, texture: 92, hydration: 98 },
];

export default function SkinPrediction({ isDark }) {
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen p-6 md:p-12 transition-all ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FAFAFA] text-slate-900'}`}>
            <div className="max-w-6xl mx-auto">

                {/* BACK BUTTON & HEADER */}
                <button onClick={() => navigate('/')} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-all mb-8 font-bold uppercase text-xs tracking-widest">
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                            Your Skin <span className="text-emerald-500 underline decoration-emerald-500/30">Evolution</span>
                        </h1>
                        <p className="opacity-60 max-w-lg font-medium">
                            Based on our clinical data and your local climate (Sri Lanka), here is how your skin's vital signs will improve over 180 days.
                        </p>
                    </div>
                    <div className="px-6 py-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-4">
                        <Zap className="fill-current" />
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase opacity-60">Predicted Radiance</p>
                            <p className="text-2xl font-black">98.2%</p>
                        </div>
                    </div>
                </div>

                {/* --- SMART CHART --- */}
                <div className={`w-full h-[400px] p-6 rounded-[35px] border ${isDark ? 'bg-[#0E0E10] border-white/5' : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/50'}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#ffffff10' : '#00000010'} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: isDark ? '#1a1a1a' : '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                                itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="health" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorHealth)" />
                            <Area type="monotone" dataKey="hydration" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className={`p-8 rounded-[30px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                        <Star className="text-yellow-500 mb-4" />
                        <h4 className="font-bold mb-1">Radiance Boost</h4>
                        <p className="text-xs opacity-60">+62% increase in natural glow within 90 days.</p>
                    </div>
                    <div className={`p-8 rounded-[30px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                        <Droplets className="text-blue-500 mb-4" />
                        <h4 className="font-bold mb-1">Deep Hydration</h4>
                        <p className="text-xs opacity-60">Retains 4x more moisture in high humidity areas.</p>
                    </div>
                    <div className={`p-8 rounded-[30px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                        <ShieldCheck className="text-emerald-500 mb-4" />
                        <h4 className="font-bold mb-1">UV Defense</h4>
                        <p className="text-xs opacity-60">Stronger barrier against tropical sun damage.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}