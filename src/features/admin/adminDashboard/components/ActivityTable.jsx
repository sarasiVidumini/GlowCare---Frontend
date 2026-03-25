import React from 'react';

export default function ActivityTable({ activities, isDark }) {
    return (
        <div className={`rounded-[3rem] p-8 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-xl'}`}>
            <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8 px-2">Recent Deployments</h2>
            <div className="space-y-3">
                {activities?.map((activity, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-5 rounded-3xl border transition-colors ${
                        isDark ? 'bg-white/5 border-transparent hover:border-white/10' : 'bg-slate-50 border-transparent hover:border-slate-200'
                    }`}>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-tight">{activity.action}</span>
                            <span className="text-[10px] opacity-40 font-bold uppercase">{activity.timestamp}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            activity.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                            {activity.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}