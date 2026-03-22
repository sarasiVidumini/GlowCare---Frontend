import React from 'react';
import { X, Copy, Edit3, Trash2, Send } from 'lucide-react';

export default function CommunityChatModals({
                                                isDark, showChat, setShowChat, messages, chatMsg, setChatMsg,
                                                sendChatMessage, activeUser, isAdmin, copyMessage, openEditModal,
                                                deleteMessage, editModal, setEditModal, saveEdit
                                            }) {
    return (
        <>
            {/* --- PUBLIC CHAT FEED MODAL --- */}
            {showChat && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[3000] flex items-center justify-center p-4">
                    <div className={`w-full max-w-lg h-[80vh] rounded-[3rem] overflow-hidden flex flex-col border transition-all duration-500 ${isDark ? 'bg-[#0D0D0F]/95 border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>

                        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                            <h3 className={`text-xl font-black italic uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                GlowCare <span className="text-emerald-500">Feed.</span>
                            </h3>
                            <button onClick={() => setShowChat(false)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={`flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar ${isDark ? 'bg-transparent' : 'bg-[#FBFBFD]'}`}>
                            {messages.map((msg) => {
                                const isMe = msg.user === (isAdmin ? "Admin" : activeUser?.name);
                                return (
                                    <div key={msg.id} className={`group flex flex-col ${isMe ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        <span className={`text-[9px] font-black uppercase mb-1.5 px-2 tracking-widest ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                                            {msg.user}
                                        </span>

                                        <div className="relative max-w-[85%]">
                                            <div className={`p-4 rounded-[1.8rem] shadow-sm transition-all ${
                                                isMe ? 'bg-emerald-600 text-white rounded-tr-none' : (isDark ? 'bg-white/10 text-white rounded-tl-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none')
                                            }`}>
                                                <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                                <span className="text-[8px] opacity-60 mt-2 block text-right font-black italic">{msg.time}</span>
                                            </div>

                                            <div className={`absolute top-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 ${isMe ? '-left-14 flex-col items-end' : '-right-14 flex-col items-start'}`}>
                                                <button onClick={() => copyMessage(msg.text)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-white/10 text-white hover:bg-emerald-500' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-500 hover:text-white'}`}><Copy size={12}/></button>
                                                <button onClick={() => openEditModal(msg.id, msg.text)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-white/10 text-white hover:bg-emerald-500' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-500 hover:text-white'}`}><Edit3 size={12}/></button>
                                                <button onClick={() => deleteMessage(msg.id)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-white border border-slate-200 text-rose-500 hover:bg-rose-500 hover:text-white'}`}><Trash2 size={12}/></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={`p-6 border-t backdrop-blur-md ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-white'}`}>
                            <div className="flex gap-2">
                                <input
                                    value={chatMsg}
                                    onChange={(e) => setChatMsg(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                    placeholder="Share your progress..."
                                    className={`flex-1 p-4 rounded-2xl outline-none text-sm font-bold transition-all border ${isDark ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50' : 'bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500/30 text-slate-900'}`}
                                />
                                <button onClick={sendChatMessage} className="p-4 bg-emerald-500 text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                                    <Send size={20}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EDIT PUBLIC MSG MODAL --- */}
            {editModal.open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[5000] flex items-center justify-center p-4">
                    <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-[#141417] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'}`}>
                        <h4 className={`text-sm font-black italic uppercase mb-6 tracking-widest ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>Edit Feed Post</h4>
                        <textarea
                            value={editModal.text}
                            onChange={(e) => setEditModal({...editModal, text: e.target.value})}
                            className={`w-full p-5 rounded-2xl border bg-transparent text-sm font-bold h-32 outline-none mb-6 resize-none transition-all ${isDark ? 'border-white/10 text-white focus:border-emerald-500' : 'border-slate-200 text-slate-900 focus:border-emerald-500'}`}
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setEditModal({open: false, id: null, text: ""})} className={`flex-1 p-4 rounded-xl text-[10px] font-black uppercase transition-all ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Cancel</button>
                            <button onClick={saveEdit} className="flex-1 p-4 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase hover:shadow-lg hover:shadow-emerald-500/20 transition-all">Update</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}