import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Edit3, Trash2, Send, Paperclip, Smile, Camera, Check, UserCircle, ShieldAlert } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';

export default function CommunityChatModals({ isDark, showChat, setShowChat, activeUser, isAdmin }) {

    const [isVerified, setIsVerified] = useState(false);
    const [joinName, setJoinName] = useState(activeUser?.name || "");
    const [verifiedUser, setVerifiedUser] = useState(null);
    const [verifyError, setVerifyError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleVerifyAndJoin = async () => {
        if (!joinName.trim()) return;
        setIsVerifying(true);
        setVerifyError("");

        try {
            const res = await axios.get(`http://localhost:8080/api/v1/chat/verify?name=${joinName}`);
            console.log("✅ Verified DB User:", res.data); // Check the console! It MUST have an 'id' now!
            setVerifiedUser(res.data);
            setIsVerified(true);
        } catch (error) {
            setVerifyError("User not found in the system. Check spelling.");
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        if (!showChat || !isVerified || !verifiedUser) return;

        axios.get('http://localhost:8080/api/v1/chat/history')
            .then(res => setMessages(res.data))
            .catch(err => console.error("Could not load history", err));

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe('/topic/public', (msg) => {
                    const newMsg = JSON.parse(msg.body);

                    if (newMsg.type === 'DELETE') {
                        setMessages(prev => prev.filter(m => m.id !== newMsg.id));
                    } else if (newMsg.type === 'EDIT') {
                        setMessages(prev => prev.map(m => m.id === newMsg.id ? newMsg : m));
                    } else {
                        setMessages(prev => [...prev, newMsg]);
                    }
                });

                client.publish({
                    destination: '/app/chat.addUser',
                    body: JSON.stringify({
                        userId: verifiedUser.id,
                        senderName: verifiedUser.name,
                        role: verifiedUser.role,
                        type: 'JOIN',
                        isEdited: false
                    })
                });
            }
        });

        client.activate();
        setStompClient(client);

        return () => { if (client) client.deactivate(); };
    }, [showChat, isVerified, verifiedUser]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, showEmojiPicker]);

    const sendMessage = () => {
        if (!messageInput.trim() || !stompClient || !stompClient.connected) return;

        // 🚀 THE ULTIMATE GUARD: Never allow a missing ID to reach the backend!
        const safeUserId = verifiedUser?.id || activeUser?.id;
        if (!safeUserId) {
            alert("CRITICAL ERROR: User ID is missing! Please refresh the page and verify again.");
            console.error("Missing ID. Here is the broken user object:", verifiedUser);
            return;
        }

        stompClient.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify({
                userId: safeUserId,
                senderName: verifiedUser.name || activeUser?.name,
                role: verifiedUser.role || "USER",
                content: messageInput,
                type: 'CHAT',
                isEdited: false
            })
        });

        setMessageInput("");
        setShowEmojiPicker(false);
    };

    const submitEdit = (id) => {
        if (!editContent.trim() || !stompClient || !stompClient.connected) return;
        stompClient.publish({
            destination: '/app/chat.editMessage',
            body: JSON.stringify({ id: id, userId: verifiedUser?.id || activeUser?.id, content: editContent, type: 'EDIT', isEdited: true })
        });
        setEditingId(null);
    };

    const deleteMessage = (id) => {
        if (!stompClient || !stompClient.connected) return;
        if (!window.confirm("Delete this message for everyone?")) return;
        stompClient.publish({
            destination: '/app/chat.deleteMessage',
            body: JSON.stringify({ id: id, userId: verifiedUser?.id || activeUser?.id, type: 'DELETE', isEdited: false })
        });
    };

    const copyToClipboard = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !stompClient || !stompClient.connected) return;

        const safeUserId = verifiedUser?.id || activeUser?.id;
        if (!safeUserId) return alert("User ID missing. Please refresh.");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/chat/upload', formData);
            stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify({
                    userId: safeUserId,
                    senderName: verifiedUser.name || activeUser?.name,
                    role: verifiedUser.role || "USER",
                    content: "",
                    type: 'CHAT',
                    fileUrl: response.data,
                    isEdited: false
                })
            });
        } catch (error) {
            alert("File upload failed.");
        } finally {
            event.target.value = null;
        }
    };

    if (!showChat) return null;

    if (!isVerified) {
        return (
            <div className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border shadow-2xl flex flex-col relative ${isDark ? 'bg-[#0F0F12] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                    <button onClick={() => setShowChat(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10"><X size={18} /></button>
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 mx-auto"><UserCircle size={32} /></div>
                    <h2 className="text-2xl font-black italic uppercase text-center mb-2">Join Network</h2>
                    <div className="space-y-4 mt-6">
                        <input type="text" value={joinName} onChange={(e) => setJoinName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVerifyAndJoin()} placeholder="Enter System Name..." className={`w-full p-4 rounded-2xl text-sm font-bold outline-none border ${isDark ? 'bg-white/5 border-white/10 focus:border-emerald-500' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`} />
                        {verifyError && <div className="flex items-center gap-2 text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 p-3 rounded-xl"><ShieldAlert size={14}/> {verifyError}</div>}
                        <button onClick={handleVerifyAndJoin} disabled={isVerifying} className="w-full py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase hover:scale-105 transition-all">{isVerifying ? 'Verifying...' : 'Verify & Join'}</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className={`w-full max-w-3xl h-[85vh] rounded-[3rem] flex flex-col border overflow-hidden transition-all duration-500 ${isDark ? 'bg-[#0D0D0F]/95 border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'}`}>

                <div className={`px-6 py-5 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div>
                        <h3 className={`text-xl font-black italic uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>GlowCare <span className="text-emerald-500">Feed.</span></h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-2 ${isDark ? 'text-emerald-500/80' : 'text-emerald-600'}`}>
                            Verified: {verifiedUser?.name || activeUser?.name} <span className="px-2 py-0.5 bg-emerald-500/10 rounded-full text-[8px]">{verifiedUser?.role || 'USER'}</span>
                        </p>
                    </div>
                    <button onClick={() => setShowChat(false)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}><X size={20} /></button>
                </div>

                <div className={`flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar ${isDark ? 'bg-transparent' : 'bg-[#FBFBFD]'}`}>
                    {messages.map((msg, idx) => {

                        if (msg.type === 'JOIN' || msg.type === 'LEAVE') {
                            return (
                                <div key={idx} className="flex justify-center my-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-white/5 text-white/50' : 'bg-slate-200/50 text-slate-500'}`}>
                                        {msg.senderName} ({msg.role || 'USER'}) {msg.type === 'JOIN' ? 'joined' : 'left'} the feed
                                    </span>
                                </div>
                            );
                        }

                        // Checks if this is your message so it can turn it Green!
                        const isMe = msg.userId === (verifiedUser?.id || activeUser?.id);

                        return (
                            <div key={idx} className={`group flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 w-full`}>

                                {!isMe && (
                                    <div className="flex items-center gap-2 mb-1.5 px-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-700'}`}>
                                            {msg.senderName}
                                        </span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                            {msg.role || 'USER'}
                                        </span>
                                    </div>
                                )}

                                <div className="relative max-w-[80%]">
                                    <div className={`p-4 shadow-sm transition-all ${
                                        isMe
                                            ? 'bg-emerald-500 text-black rounded-[1.8rem] rounded-tr-none'
                                            : (isDark ? 'bg-[#1A1A1D] border border-white/10 text-white rounded-[1.8rem] rounded-tl-none' : 'bg-white border border-slate-200 text-slate-800 rounded-[1.8rem] rounded-tl-none')
                                    }`}>

                                        {editingId === msg.id ? (
                                            <div className="flex flex-col gap-2 min-w-[200px]">
                                                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className={`w-full bg-black/10 rounded-lg p-2 text-sm outline-none resize-none ${isMe ? 'text-black placeholder-black/50' : (isDark ? 'text-white' : 'text-slate-900')}`} rows="2" />
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => setEditingId(null)} className="text-[10px] uppercase font-black px-2 py-1 opacity-60">Cancel</button>
                                                    <button onClick={() => submitEdit(msg.id)} className="text-[10px] uppercase font-black px-2 py-1 bg-black/20 rounded-md">Save</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {msg.content && <p className="text-sm font-bold leading-relaxed">{msg.content}</p>}

                                                {msg.fileUrl && (
                                                    <div className="mt-3 rounded-xl overflow-hidden border border-black/10 max-w-[250px]">
                                                        {msg.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) != null ? (
                                                            <img src={msg.fileUrl} alt="attachment" className="w-full h-auto object-cover" />
                                                        ) : (
                                                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-black/10 text-xs font-bold"><Paperclip size={14}/> View File</a>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={`flex items-center justify-end gap-2 mt-2 ${isMe ? 'text-black/60' : (isDark ? 'text-white/40' : 'text-slate-400')}`}>
                                                    {msg.isEdited && <span className="text-[8px] font-black italic">(edited)</span>}
                                                    {msg.timestamp && <span className="text-[8px] font-black italic">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className={`absolute top-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 ${isMe ? '-left-14 flex-col items-end' : '-right-14 flex-col items-start'}`}>
                                        {msg.content && <button onClick={() => copyToClipboard(msg.id, msg.content)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-[#1A1A1D] border border-white/10 text-white' : 'bg-white border text-slate-600'}`}>{copiedId === msg.id ? <Check size={12}/> : <Copy size={12}/>}</button>}
                                        {(isMe || isAdmin) && (
                                            <>
                                                <button onClick={() => { setEditingId(msg.id); setEditContent(msg.content); }} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-[#1A1A1D] border border-white/10 text-white' : 'bg-white border text-slate-600'}`}><Edit3 size={12}/></button>
                                                <button onClick={() => deleteMessage(msg.id)} className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-white border text-rose-500'}`}><Trash2 size={12}/></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {showEmojiPicker && (
                    <div className="absolute bottom-24 left-4 z-[6000]">
                        <EmojiPicker onEmojiClick={(e) => setMessageInput(prev => prev + e.emoji)} theme={isDark ? 'dark' : 'light'} />
                    </div>
                )}

                <div className={`p-4 sm:p-6 border-t backdrop-blur-md ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-white'}`}>
                    <div className={`flex items-end gap-2 p-2 rounded-3xl border transition-all ${isDark ? 'bg-white/5 border-white/10 focus-within:border-emerald-500/50' : 'bg-slate-50 border-slate-300 focus-within:border-emerald-500/50'}`}>
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} capture="environment" />
                        <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-emerald-500 rounded-full"><Camera size={18} /></button>
                        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-3 text-slate-400 hover:text-emerald-500 rounded-full"><Smile size={18} /></button>
                        <textarea value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Share your progress..." className={`flex-1 bg-transparent py-3 px-2 text-sm font-bold outline-none resize-none max-h-32 min-h-[44px] ${isDark ? 'text-white' : 'text-slate-900'}`} rows="1" />
                        <button onClick={sendMessage} className="w-12 h-12 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-black hover:scale-105 shadow-lg mb-0.5 mr-0.5"><Send size={18} className="ml-1" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}