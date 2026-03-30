import React from 'react';
import { Brain, Sparkles, ShieldCheck } from 'lucide-react'; // 🚀 FIXED: ShieldCheck (PascalCase)

export default function FeatureInsightGrid({ stats, isDark }) {
    const cards = [
        {
            title: "AI Neural Analysis",
            value: stats?.totalAiAnalyses || "0",
            desc: "Dermal scans processed via Vision API",
            icon: <Brain size={24} />,
            color: "from-blue-500 to-indigo-600"
        },
        {
            title: "Treatment Protocols",
            value: stats?.totalActiveTreatments || "0",
            desc: "Active skincare routines generated",
            icon: <Sparkles size={24} />,
            color: "from-emerald-400 to-teal-600"
        },
        {
            title: "System Integrity",
            value: "99.9%",
            desc: "Neural network uptime and security",
            icon: <ShieldCheck size={24} />, // 🚀 FIXED: Component name match
            color: "from-orange-400 to-rose-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {cards.map((card, i) => (
                <div key={i} className={`relative overflow-hidden group p-8 rounded-[3rem] border transition-all duration-500 hover:scale-[1.01] ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-xl'
                }`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 blur-3xl`} />
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white mb-6 shadow-lg`}>
                        {card.icon}
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">{card.title}</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black italic tracking-tighter">{card.value}</span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
                    </div>
                    <p className="mt-4 text-[11px] font-medium opacity-50 leading-relaxed">{card.desc}</p>
                </div>
            ))}
        </div>
    );
}