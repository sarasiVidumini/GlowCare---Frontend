import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    fetchNexusStats,
    performSystemMaintenance,
    fetchAllAdmins,
    updateAdminRecord,
    deleteAdminRecord
} from '../adminDashboard/api/adminService.js';

// Sub-Section Imports
import DashboardHeader from '../adminDashboard/components/DashboardHeader.jsx';
import StatGrid from '../adminDashboard/components/StatGrid.jsx';
import ActivityTable from '../adminDashboard/components/ActivityTable.jsx';
import SystemHealth from '../adminDashboard/components/SystemHealth.jsx';
import QuickActions from '../adminDashboard/components/QuickActions.jsx';
import AdminInfoTable from '../adminDashboard/components/AdminInfoTable.jsx';
import AlertBanner from '../components/AlertBanner.jsx';

export default function AdminDashboard({ isDark }) {
    const [data, setData] = useState(null);
    const [adminList, setAdminList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

    const showAlert = (msg, type) => {
        setAlert({ show: true, msg, type });
        setTimeout(() => setAlert({ show: false, msg: '', type: '' }), 4000);
    };

    // Combined Data Fetcher
    const loadAllNexusData = useCallback(async () => {
        try {
            const [statsRes, adminRes] = await Promise.all([
                fetchNexusStats(),
                fetchAllAdmins()
            ]);
            setData(statsRes.data);
            setAdminList(adminRes.data);
        } catch (err) {
            console.error("Critical Sync Failure", err);
            showAlert("Synchronization Protocol Failed", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAllNexusData();
    }, [loadAllNexusData]);

    // --- CRUD ACTIONS ---
    const handleUpdateAdmin = async (updatedAdmin) => {
        try {
            await updateAdminRecord(updatedAdmin);
            showAlert("Neural Identity Updated", "success");
            loadAllNexusData(); // Refresh list
        } catch (err) {
            showAlert("Update Access Denied", "error");
        }
    };

    const handleDeleteAdmin = async (id) => {
        if (!window.confirm("CRITICAL: Terminate this admin access permanently?")) return;
        try {
            await deleteAdminRecord(id);
            showAlert("Admin Purged from System", "success");
            loadAllNexusData();
        } catch (err) {
            showAlert("Termination Sequence Interrupted", "error");
        }
    };

    const handleMaintenance = async () => {
        try {
            showAlert("Initiating System Cache Reboot...", "success");
            await performSystemMaintenance();
            await loadAllNexusData();
            showAlert("Neural Cache Purged Successfully", "success");
        } catch (err) {
            showAlert("Maintenance Protocol Interrupted", "error");
        }
    };

    if (loading) {
        return (
            <div className={`h-screen flex flex-col items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 animate-pulse">
                    Synchronizing Neural Links
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative min-h-screen p-8 transition-colors duration-700 ${
                isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'
            }`}
        >
            <AlertBanner alert={alert} />

            <div className="max-w-7xl mx-auto relative z-10">
                <DashboardHeader />
                <StatGrid stats={data} isDark={isDark} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
                    <div className="lg:col-span-2 flex flex-col gap-10">
                        {/* Table 1: Activity Logs */}
                        <ActivityTable activities={data?.activities} isDark={isDark} />

                        {/* Table 2: Admin Management (The New Table) */}
                        <AdminInfoTable
                            admins={adminList}
                            isDark={isDark}
                            onUpdate={handleUpdateAdmin}
                            onDelete={handleDeleteAdmin}
                        />
                    </div>

                    <div className="flex flex-col gap-8">
                        <SystemHealth efficiency={data?.systemEfficiency || 99} isDark={isDark} />
                        <QuickActions onMaintenance={handleMaintenance} isDark={isDark} />

                        {/* Network Visual */}
                        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'border-white/5 bg-white/2' : 'border-slate-100 bg-slate-50/50'}`}>
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2">Network Topology</p>
                            <div className="flex gap-2">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex-1 h-1 rounded-full bg-emerald-500/20 overflow-hidden">
                                        <div className="h-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>
    );
}