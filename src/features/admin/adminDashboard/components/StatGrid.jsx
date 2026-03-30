import React from 'react';
import StatCard from './StatCard';
import { Users, UserCheck, Calendar, Package } from 'lucide-react';

export default function StatGrid({ stats, isDark }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
                label="Total Users"
                value={stats?.totalUsers || 0}
                icon={<Users size={20} />}
                isDark={isDark}
            />
            <StatCard
                label="Total Experts"
                value={stats?.totalExperts || 0}
                icon={<UserCheck size={20} />}
                isDark={isDark}
            />
            <StatCard
                label="Active Appointments"
                value={stats?.totalAppointments || 0}
                icon={<Calendar size={20} />}
                isDark={isDark}
            />
            <StatCard
                label="Routine Products"
                value={stats?.totalRoutineProducts || 0}
                icon={<Package size={20} />}
                isDark={isDark}
            />
        </div>
    );
}