import React from 'react';
import { Cpu, ShieldAlert, AlertCircle, Sparkles, RefreshCw, Volume2, CheckCircle } from 'lucide-react';

export default function SmartEngineModals({ isDark, isScanning, conflictData, setConflictData, confirmSave, modal, setModal, saveProduct, activeAlarm, setActiveAlarm, alarmAudio }) {
    return (
        <>
            {/* Engine Scanning Overlay */}
            {isScanning && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 backdrop-blur-3xl transition-all duration-700">
                    <div className="relative flex flex-col items-center">
                        <div className="relative w-48 h-48 mb-10">
                            <div className="absolute inset-0 border-[1px] border-emerald-500/20 rounded-full scale-110"></div>
                            <div className="absolute inset-0 border-[1px] border-emerald-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
                            <div className="absolute inset-4 overflow-hidden rounded-full border border-emerald-500/20">
                                <div className="w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] absolute top-0 animate-[scanBeam_1.8s_ease-in-out_infinite]"></div>
                                <div className="w-full h-full bg-emerald-500/5"></div>
                            </div>
                            <Cpu className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={56} />
                        </div>
                        <div className="text-center">
                            <h3 className={`text-xl font-black uppercase tracking-[0.5em] ${isDark ? 'text-white' : 'text-emerald-500'}`}>Molecular Scan</h3>
                            <div className="flex items-center gap-2 mt-3 justify-center">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                                <p className="text-emerald-500/60 text-[10px] uppercase font-black tracking-widest">Validating Ingredient Synergy...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Conflict OR Approval Alert */}
            {conflictData && (
                <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-500">
                    <div className={`relative w-full max-w-md rounded-[2.5rem] p-8 border backdrop-blur-2xl transition-all duration-500 overflow-hidden ${isDark ? 'bg-[#0D0D0F]/70 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]' : 'bg-white/70 border-white/40 shadow-2xl shadow-slate-200/50'}`}>

                        {/* CONDITIONAL HEADER: Red for Conflict, Green for Safe */}
                        <div className="flex flex-col items-center text-center mb-6 relative z-10">
                            {conflictData.hasConflict ? (
                                <>
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border backdrop-blur-xl ${isDark ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' : 'bg-rose-500/10 border-rose-200 text-rose-600'}`}>
                                        <ShieldAlert size={32} />
                                    </div>
                                    <h4 className={`text-2xl font-black italic uppercase leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Safety <span className="text-rose-500">Alert.</span></h4>
                                </>
                            ) : (
                                <>
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border backdrop-blur-xl ${isDark ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500' : 'bg-emerald-500/10 border-emerald-200 text-emerald-600'}`}>
                                        <CheckCircle size={32} />
                                    </div>
                                    <h4 className={`text-2xl font-black italic uppercase leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Formula <span className="text-emerald-500">Approved.</span></h4>
                                </>
                            )}
                        </div>

                        {/* REASON BOX */}
                        <div className={`p-5 rounded-2xl mb-5 border backdrop-blur-xl transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-900/5 border-white/60 text-slate-800'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={14} className={conflictData.hasConflict ? "text-rose-500" : "text-emerald-500"} />
                                <span className="text-[10px] font-black uppercase italic tracking-widest opacity-60">AI Feedback</span>
                            </div>
                            <p className="text-xs font-bold leading-relaxed italic">"{conflictData.reason}"</p>
                        </div>

                        {/* CONDITIONAL ALTERNATIVE BOX (Only show if there is a conflict) */}
                        {conflictData.hasConflict && (
                            <div className="relative group p-5 rounded-2xl border transition-all overflow-hidden backdrop-blur-xl bg-emerald-500/5 border-emerald-500/20 mb-6">
                                <div className="absolute -right-2 -bottom-2 text-emerald-500/10 group-hover:scale-110 transition-transform">
                                    <Sparkles size={60} />
                                </div>
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <h5 className={`text-xl font-black italic uppercase leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{conflictData.alternative}</h5>
                                    </div>
                                    <button onClick={() => confirmSave(conflictData.alternative)} className="p-4 bg-emerald-500 rounded-xl text-black hover:scale-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                                        <RefreshCw size={20} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* CONDITIONAL BUTTONS */}
                        <div className="flex gap-3 relative z-10 mt-6">
                            <button onClick={() => setConflictData(null)} className={`flex-1 py-4 rounded-xl uppercase font-black text-[10px] tracking-widest transition-all backdrop-blur-xl ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/50 text-slate-900 hover:bg-white/80'}`}>
                                Cancel
                            </button>

                            {conflictData.hasConflict ? (
                                <button onClick={() => confirmSave(conflictData.original)} className="flex-1 py-4 bg-rose-600 text-white rounded-xl uppercase font-black text-[10px] tracking-widest hover:bg-rose-700 hover:shadow-lg transition-all">
                                    Force Save
                                </button>
                            ) : (
                                <button onClick={() => confirmSave(conflictData.original)} className="flex-1 py-4 bg-emerald-500 text-black rounded-xl uppercase font-black text-[10px] tracking-widest hover:bg-emerald-600 hover:shadow-lg transition-all">
                                    Approve & Save
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Formula Add/Edit Modal */}
            {modal.open && !isScanning && !conflictData && (
                <div className="fixed inset-0 bg-black/90 z-[4000] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#141417] border-white/10' : 'bg-white shadow-2xl'}`}>
                        <h4 className="text-xl font-black italic uppercase mb-6 text-emerald-500 text-center">{modal.type === 'add' ? 'New Formula' : 'Edit Formula'}</h4>
                        <div className="space-y-4">
                            <input value={modal.value} onChange={(e) => setModal({...modal, value: e.target.value})} placeholder="Product Name" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                            <input value={modal.stepTime} onChange={(e) => setModal({...modal, stepTime: e.target.value})} placeholder="Time (e.g. 08:00 AM)" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button disabled={isScanning} onClick={() => setModal({open: false, type: 'add', index: null, value: "", stepTime: ""})} className="flex-1 p-4 rounded-2xl bg-white/5 text-xs font-black uppercase disabled:opacity-50">Cancel</button>

                            <button disabled={isScanning || !modal.value} onClick={saveProduct} className="flex-1 p-4 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
                                {isScanning ? 'Scanning...' : 'Scan & Verify'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Alarm */}
            {activeAlarm && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9000] w-[90%] max-w-md animate-in slide-in-from-top-10 duration-500">
                    <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-black shadow-2xl shadow-emerald-500/50 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-black/10 rounded-full flex items-center justify-center mb-4 animate-bounce"><Volume2 size={40} /></div>
                        <h3 className="text-2xl font-black italic uppercase leading-none mb-1">Time for Routine!</h3>
                        <p className="text-[11px] font-black uppercase tracking-widest opacity-60 mb-6">{activeAlarm.name} - {activeAlarm.bodyPart}</p>
                        <button onClick={() => { setActiveAlarm(null); alarmAudio.current.pause(); alarmAudio.current.currentTime = 0; }} className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-all">Dismiss Task</button>
                    </div>
                </div>
            )}
        </>
    );
}