import React from 'react';
import StatCard from './StatCard';
import { Users, ShieldCheck, Activity, Zap } from 'lucide-react';

export default function StatGrid({ stats, isDark }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                label="Total Entities"
                value={stats?.totalUsers || 0}
                icon={<Users size={20} />}
                isDark={isDark}
            />
            <StatCard
                label="Security Index"
                value={`${stats?.systemEfficiency || 99.9}%`}
                icon={<ShieldCheck size={20} />}
                isDark={isDark}
            />
            <StatCard
                label="Expert Network"
                value={stats?.totalExperts || 0}
                icon={<Activity size={20} />}
                isDark={isDark}
            />
            <StatCard
                label="Server Latency"
                value="24ms"
                icon={<Zap size={20} />}
                isDark={isDark}
            />
        </div>
    );
}