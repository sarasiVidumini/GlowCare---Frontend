import React from 'react';
import { X, User, ShieldCheck, Copy, Edit3, Trash2, Send } from 'lucide-react';

export default function PrivateChatModal({
                                             isDark, privateChat, setPrivateChat, pChatMsg, setPChatMsg,
                                             sendPrivateMessage, copyMessage, openPrivateEdit, deletePrivateMsg
                                         }) {
    if (!privateChat.open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
            <div className={`w-full max-w-lg h-[75vh] rounded-[2.5rem] overflow-hidden flex flex-col border transition-all duration-500 ${isDark ? 'bg-[#0D0D0F]/95 border-white/10' : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'}`}>
                <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><User size={20} className="text-emerald-500" /></div>
                        <div>
                            <h3 className={`text-lg font-black italic uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{privateChat.expert?.name}</h3>
                            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span><p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Secure Consultation</p></div>
                        </div>
                    </div>
                    <button onClick={() => setPrivateChat({ ...privateChat, open: false })} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}><X size={20} /></button>
                </div>

                <div className={`flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar ${isDark ? 'bg-transparent' : 'bg-[#FBFBFD]'}`}>
                    {privateChat.messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <ShieldCheck size={48} className="mb-4 text-emerald-500" />
                            <p className="text-xs font-bold uppercase italic">End-to-end encrypted chat</p>
                        </div>
                    )}

                    {privateChat.messages.map((msg) => (
                        <div key={msg.id} className="group flex flex-col items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="max-w-[85%] relative">
                                <div className={`p-4 rounded-[1.5rem] rounded-tr-none shadow-sm ${isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white'}`}>
                                    <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                    <span className="text-[8px] opacity-70 mt-1.5 block text-right font-black uppercase">{msg.time}</span>
                                </div>
                                <div className="absolute top-0 -left-12 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 origin-right">
                                    <button onClick={() => copyMessage(msg.text)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-white/10 text-white hover:bg-emerald-500' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-500 hover:text-white'}`}><Copy size={12}/></button>
                                    <button onClick={() => openPrivateEdit(msg.id, msg.text)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-white/10 text-white hover:bg-emerald-500' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-500 hover:text-white'}`}><Edit3 size={12}/></button>
                                    <button onClick={() => deletePrivateMsg(msg.id)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-white border border-slate-200 text-rose-500 hover:bg-rose-500 hover:text-white'}`}><Trash2 size={12}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`p-6 border-t backdrop-blur-md ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-white'}`}>
                    <div className="flex gap-2 relative">
                        <input value={pChatMsg} onChange={(e) => setPChatMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendPrivateMessage()} placeholder="Type your message..." className={`flex-1 p-4 pr-12 rounded-2xl outline-none text-sm font-bold transition-all border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50' : 'bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500/30 text-slate-900'}`} />
                        <button onClick={sendPrivateMessage} className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"><Send size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}