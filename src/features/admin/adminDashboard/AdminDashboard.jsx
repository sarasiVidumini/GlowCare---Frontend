import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    fetchNexusStats,
    fetchAllAdmins,
    updateAdminRecord,
    deleteAdminRecord,
    performSystemMaintenance
} from '../adminDashboard/api/adminService.js';

import DashboardHeader from './components/DashboardHeader';
import StatGrid from './components/StatGrid';
import FeatureInsightGrid from './components/FeatureInsightGrid';
import ActivityTable from './components/ActivityTable';
import AdminInfoTable from './components/AdminInfoTable';
import QuickActions from './components/QuickActions';
import SystemHealth from './components/SystemHealth';
import AlertBanner from '../components/AlertBanner';

export default function AdminDashboard({ isDark }) {
    const [data, setData] = useState(null);
    const [adminList, setAdminList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

    // 🚀 Helper to trigger the superb Alert Banner
    const showAlert = (msg, type = 'success') => {
        setAlert({ show: true, msg, type });
        setTimeout(() => setAlert({ show: false, msg: '', type: '' }), 4000);
    };

    const loadData = useCallback(async () => {
        try {
            const [stats, admins] = await Promise.all([fetchNexusStats(), fetchAllAdmins()]);
            setData(stats.data);
            setAdminList(admins.data);
        } catch (err) {
            console.error("Sync Failure:", err);
            showAlert("Neural Link Interrupted", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    // --- 🛡️ ADMIN MANAGEMENT ACTIONS ---

    const handleUpdateAdmin = async (updatedAdmin) => {
        try {
            await updateAdminRecord(updatedAdmin);
            showAlert("Identity Updated Successfully");
            loadData(); // Refresh lists
        } catch (err) {
            showAlert("Update Protocol Denied", "error");
        }
    };

    const handleDeleteAdmin = async (id) => {
        if (!window.confirm("CRITICAL: Permanent termination of this access?")) return;
        try {
            await deleteAdminRecord(id);
            showAlert("Admin Access Revoked", "success");
            loadData();
        } catch (err) {
            showAlert("Termination Failed", "error");
        }
    };

    const handleMaintenance = async () => {
        try {
            showAlert("Initiating Neural Cache Purge...", "success");
            await performSystemMaintenance();
            showAlert("System Rejuvenated Successfully");
            loadData();
        } catch (err) {
            showAlert("Maintenance Interrupted", "error");
        }
    };

    if (loading) return (
        <div className={`h-screen flex flex-col items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>
            <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Syncing Nexus</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`min-h-screen p-8 transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}
        >
            <AlertBanner alert={alert} />

            <div className="max-w-7xl mx-auto relative z-10">
                <DashboardHeader />

                {/* Section 1: Business KPIs */}
                <StatGrid stats={data} isDark={isDark} />

                {/* Section 2: AI & Clinical Insight Cards */}
                <FeatureInsightGrid stats={data} isDark={isDark} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
                    <div className="lg:col-span-2 space-y-10">
                        {/* Recent Activity Log */}
                        <ActivityTable activities={data?.activities} isDark={isDark} />

                        {/* Admin Identity Management */}
                        <AdminInfoTable
                            admins={adminList}
                            isDark={isDark}
                            onUpdate={handleUpdateAdmin}
                            onDelete={handleDeleteAdmin}
                        />
                    </div>

                    <div className="space-y-8">
                        <SystemHealth efficiency={data?.systemEfficiency || 99.9} isDark={isDark} />
                        <QuickActions onMaintenance={handleMaintenance} isDark={isDark} />

                        {/* Neural Architecture Visual */}
                        <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-4">Neural Architecture</p>
                            <div className="flex gap-1.5">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="flex-1 h-1.5 rounded-full bg-emerald-500/10 overflow-hidden">
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                                            className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Aesthetic Glow */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
        </motion.div>
    );
}