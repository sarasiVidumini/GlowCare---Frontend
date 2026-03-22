import React from 'react';
import { Camera, Fingerprint, Mail, ShieldCheck, Edit3, Trash2 } from 'lucide-react';

export default function UserCard({ isDark, isAdmin, user, handleAvatarUpload, setEditingUser, deleteUser }) {
    return (
        <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-[3.2rem] blur opacity-0 group-hover:opacity-100 transition duration-700"></div>

            <div className={`relative h-full rounded-[3rem] border overflow-hidden transition-all duration-500 ${isDark ? 'bg-[#0A0A0B]/80 backdrop-blur-md border-white/10' : 'bg-white/90 backdrop-blur-md border-slate-100 shadow-xl shadow-slate-200/50'}`}>

                <div className={`h-24 relative ${isDark ? 'bg-emerald-950/20' : 'bg-emerald-50'}`}>
                    <div className="absolute top-7 right-8 flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Identity Verified</span>
                    </div>
                </div>

                <div className="absolute top-8 left-8">
                    <div className="relative group/avatar">
                        <div className="w-24 h-24 rounded-[2rem] border-[5px] border-[#0A0A0B] overflow-hidden bg-slate-800 shadow-2xl">
                            {user.avatar || user.picture ? (
                                <img src={user.avatar || user.picture} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-500/20 text-emerald-500">
                                    <Fingerprint size={40} />
                                </div>
                            )}
                        </div>
                        {isAdmin && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer rounded-[2rem]">
                                <Camera size={28} className="text-white" />
                                <input type="file" hidden onChange={(e) => handleAvatarUpload(e, user.id)} />
                            </label>
                        )}
                    </div>
                </div>

                <div className="p-9 pt-12">
                    <div className="mb-6">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter truncate leading-tight">{user.name}</h3>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">{user.role || 'User'}</span>
                            <span className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em]">REF: {user.id?.slice(-6) || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Network Email</span>
                                <Mail size={14} className="text-emerald-500" />
                            </div>
                            <p className="text-[12px] font-bold truncate tracking-wide">{user.email}</p>
                        </div>

                        {user.role === 'expert' && user.license && (
                            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Security License</span>
                                    <ShieldCheck size={14} className="text-emerald-500" />
                                </div>
                                <p className="text-[12px] font-black text-emerald-600 tracking-[0.15em] uppercase truncate">{user.license}</p>
                            </div>
                        )}
                    </div>

                    {isAdmin && (
                        <div className="flex gap-3 pt-6 border-t border-white/5">
                            <button
                                onClick={() => setEditingUser(user)}
                                className="flex-[3] flex items-center justify-center gap-3 py-4.5 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                            >
                                <Edit3 size={16} /> Sync Profile
                            </button>
                            <button
                                onClick={() => deleteUser(user.id)}
                                className={`flex-1 flex items-center justify-center rounded-2xl border transition-all ${isDark ? 'border-white/10 hover:bg-red-500 hover:border-red-500 text-white' : 'border-slate-200 hover:bg-red-500 hover:border-red-500 hover:text-white'}`}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}