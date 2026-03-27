import React, { useState, useEffect } from 'react';
import { X, Trash2, Edit3, Plus, BellRing, Clock } from 'lucide-react';
import { notificationService } from '../api/notificationService';
import { routineService } from '../api/routineService';

export default function NotificationDashboard({ isDark, isOpen, onClose, isAdmin }) {
    const [notifications, setNotifications] = useState([]);
    const [routineSteps, setRoutineSteps] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form Modal (Only used by Admin)
    const [modal, setModal] = useState({
        open: false, id: null, title: "", message: "", isActive: true, routineStepId: ""
    });

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (isAdmin) {
                const [notifsData, stepsData] = await Promise.all([
                    notificationService.getAllNotifications(),
                    routineService.getAllSteps()
                ]);
                setNotifications(notifsData);
                setRoutineSteps(stepsData);
            } else {
                const notifsData = await notificationService.getActiveNotifications();
                setNotifications(notifsData);
            }
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!modal.title || !modal.message || !modal.routineStepId) {
            alert("Please fill in all fields and select a Routine Step!");
            return;
        }

        try {
            if (modal.id) {
                await notificationService.updateNotification(modal.id, modal);
            } else {
                await notificationService.createNotification(modal);
            }
            await fetchData();
            setModal({ open: false, id: null, title: "", message: "", isActive: true, routineStepId: "" });
        } catch (error) {
            alert("Failed to save notification.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this alert?")) return;
        try {
            await notificationService.deleteNotification(id);
            await fetchData();
        } catch (error) {
            alert("Failed to delete notification.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[6000] flex items-center justify-center p-4 transition-all duration-500 animate-in fade-in">
            {/* Main Modal Container - Styled Exactly Like Expert Panel */}
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] border flex flex-col transition-all duration-500 ${isDark ? 'bg-[#0F0F12]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-2xl'}`}>

                {/* HEADER */}
                <div className="p-8 pb-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black italic uppercase text-emerald-500">Alerts Panel.</h2>
                        <div className="flex gap-3">
                            {/* ADMIN ADD BUTTON */}
                            {isAdmin && !modal.open && (
                                <button
                                    onClick={() => setModal({ open: true, id: null, title: "", message: "", isActive: true, routineStepId: "" })}
                                    className="px-5 py-3 bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                                >
                                    <Plus size={14} /> Add Alert
                                </button>
                            )}
                            {/* CLOSE BUTTON */}
                            <button
                                onClick={onClose}
                                className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 text-slate-500 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ADMIN ONLY: FORM INLINE */}
                {isAdmin && modal.open && (
                    <div className={`mx-8 mb-6 p-6 rounded-3xl border transition-all ${isDark ? 'bg-white/5 border-emerald-500/30' : 'bg-emerald-50 border-emerald-500/30'}`}>
                        <h3 className="text-sm font-black italic uppercase text-emerald-500 mb-4">{modal.id ? 'Update Alert' : 'Create New Alert'}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                value={modal.title}
                                onChange={e => setModal({...modal, title: e.target.value})}
                                placeholder="Alert Title"
                                className={`w-full p-4 rounded-xl text-sm font-bold outline-none border transition-all ${isDark ? 'bg-[#141417] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                            />

                            <select
                                value={modal.routineStepId}
                                onChange={e => setModal({...modal, routineStepId: e.target.value})}
                                className={`w-full p-4 rounded-xl text-sm font-bold outline-none border transition-all cursor-pointer ${isDark ? 'bg-[#141417] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                            >
                                <option value="" disabled>Link to Routine Step...</option>
                                {routineSteps.map(step => (
                                    <option key={step.id} value={step.id}>
                                        {step.pathCategory} - {step.scheduledTime} ({step.productName})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <textarea
                            value={modal.message}
                            onChange={e => setModal({...modal, message: e.target.value})}
                            placeholder="Detailed Alert Message..."
                            className={`w-full p-4 rounded-xl text-sm font-bold outline-none h-24 resize-none border mb-4 transition-all ${isDark ? 'bg-[#141417] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                        />

                        <div className="flex items-center gap-3 mb-6">
                            <input type="checkbox" checked={modal.isActive} onChange={e => setModal({...modal, isActive: e.target.checked})} className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" />
                            <span className="text-sm font-bold">Broadcast Active</span>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setModal({...modal, open: false})} className={`flex-1 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-600'}`}>Cancel</button>
                            <button onClick={handleSave} className="flex-1 p-4 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg shadow-emerald-500/20 transition-all">Save Alert</button>
                        </div>
                    </div>
                )}

                {/* LIST OF NOTIFICATIONS */}
                <div className="flex-1 overflow-y-auto p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 no-scrollbar">
                    {isLoading ? (
                        <div className="col-span-full py-20 text-center opacity-30 font-black uppercase text-xs tracking-[0.2em]">
                            Loading Alerts...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-30 font-black uppercase text-xs tracking-[0.2em]">
                            No Active Notifications
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className={`group relative p-6 rounded-3xl border transition-all ${isDark ? 'bg-white/[0.03] border-white/5 hover:border-emerald-500/30' : 'bg-slate-50 border-slate-100 hover:shadow-xl'}`}>

                                {/* ADMIN HOVER ACTIONS */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => setModal({ open: true, ...n })} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500"><Edit3 size={14}/></button>
                                        <button onClick={() => handleDelete(n.id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500"><Trash2 size={14}/></button>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <BellRing size={18} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-black italic uppercase leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{n.title}</h4>
                                        <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mt-1">
                                            {n.pathCategory} • {n.scheduledTime}
                                        </p>
                                    </div>
                                </div>

                                <p className={`text-[11px] opacity-60 leading-relaxed mb-6 line-clamp-3 min-h-[3rem] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {n.message}
                                </p>

                                <div className={`w-full py-3 border rounded-xl font-black uppercase text-[9px] tracking-widest text-center ${n.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-500/10 border-slate-500/20 text-slate-500'}`}>
                                    {n.isActive ? 'Status: ACTIVE' : 'Status: HIDDEN'}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}