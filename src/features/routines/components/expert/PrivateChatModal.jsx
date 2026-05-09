import React, { useState, useEffect, useRef } from 'react';
import { X, User, ShieldCheck, Copy, Edit3, Trash2, Send, Paperclip, Smile, Camera, ShieldAlert } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import PrivateMsgEditModal from './PrivateMsgEditModal';

export default function PrivateChatModal({ isDark, privateChat, setPrivateChat, activeUser }) {

    const [isVerified, setIsVerified] = useState(false);
    const [joinName, setJoinName] = useState(activeUser?.name || "");
    const [verifiedUser, setVerifiedUser] = useState(null);
    const [verifyError, setVerifyError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const [pEditModal, setPEditModal] = useState({ open: false, id: null, text: "" });

    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const currentUserId = verifiedUser?.id;
    const currentUserName = verifiedUser?.name;
    const currentUserRole = verifiedUser?.role;
    const targetExpert = privateChat?.expert;

    // The Bulletproof Target ID Extractor
    const extractTargetId = () => {
        if (!targetExpert) return null;
        if (targetExpert.user && targetExpert.user.id) return targetExpert.user.id;
        if (typeof targetExpert.user === 'number') return targetExpert.user;
        if (targetExpert.userId) return targetExpert.userId;
        if (targetExpert.role === 'EXPERT' && targetExpert.id) return targetExpert.id;
        return targetExpert.id;
    };

    const extractTargetName = () => {
        if (!targetExpert) return "Expert";
        if (targetExpert.user && targetExpert.user.name) return targetExpert.user.name;
        if (targetExpert.name) return targetExpert.name;
        return "Expert";
    };

    const targetExpertId = extractTargetId();
    const targetExpertName = extractTargetName();

    const roomId = currentUserId && targetExpertId
        ? `room_${Math.min(currentUserId, targetExpertId)}_${Math.max(currentUserId, targetExpertId)}`
        : null;

    const getAuthToken = () => {
        return localStorage.getItem('jwt_token') || localStorage.getItem('token') || localStorage.getItem('accessToken');
    };

    const getAuthHeader = () => {
        const token = getAuthToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleVerifyAndJoin = async () => {

        if (!joinName?.trim()) {
            setVerifyError("Please enter your username.");
            return;
        }

        if (!targetExpertId) {
            setVerifyError("Cannot resolve Expert Identity.");
            return;
        }

        const token = getAuthToken();

        if (!token) {
            setVerifyError("Session expired. Please login again.");
            return;
        }

        setIsVerifying(true);
        setVerifyError("");

        try {

            console.log("Verifying user:", joinName);

            const res = await axios.get(
                `http://localhost:8080/api/v1/private-chat/verify`,
                {
                    params: {
                        name: joinName.trim()
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Verify response:", res.data);

            if (!['CLIENT', 'EXPERT', 'ADMIN'].includes(res.data.role)) {
                setVerifyError("Unauthorized role.");
                return;
            }

            setVerifiedUser(res.data);
            setIsVerified(true);

        } catch (error) {

            console.error(error);

            if (error.response) {
                setVerifyError(
                    error.response.data || "Verification failed."
                );
            } else {
                setVerifyError("Server connection failed.");
            }

        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        if (!privateChat?.open || !isVerified || !verifiedUser || !roomId || !targetExpertId) return;

        axios.get(`http://localhost:8080/api/v1/private-chat/history?roomId=${roomId}`, {
            headers: getAuthHeader()
        })
            .then(res => setMessages(res.data))
            .catch(err => console.error("Could not load history", err));

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/private/${roomId}`, (msg) => {
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
                    destination: '/app/private-chat.addUser',
                    body: JSON.stringify({
                        roomId: roomId,
                        senderId: currentUserId,
                        receiverId: targetExpertId,
                        senderName: currentUserName,
                        role: currentUserRole,
                        type: 'JOIN',
                        isEdited: false
                    })
                });
            }
        });

        client.activate();
        setStompClient(client);

        return () => { if (client) client.deactivate(); };
    }, [privateChat?.open, isVerified, verifiedUser, roomId, targetExpertId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, showEmojiPicker]);

    const sendPrivateMessage = () => {
        if (!messageInput.trim() || !stompClient || !stompClient.connected) return;
        stompClient.publish({
            destination: '/app/private-chat.sendMessage',
            body: JSON.stringify({
                roomId: roomId,
                senderId: currentUserId,
                receiverId: targetExpertId,
                senderName: currentUserName,
                role: currentUserRole,
                content: messageInput,
                type: 'CHAT',
                isEdited: false
            })
        });
        setMessageInput("");
        setShowEmojiPicker(false);
    };

    const savePrivateEdit = () => {
        if (!pEditModal.text.trim() || !stompClient) return;
        stompClient.publish({
            destination: '/app/private-chat.editMessage',
            body: JSON.stringify({ id: pEditModal.id, roomId: roomId, senderId: currentUserId, content: pEditModal.text, type: 'EDIT', isEdited: true })
        });
        setPEditModal({ open: false, id: null, text: "" });
    };

    const deletePrivateMsg = (id) => {
        if (!stompClient) return;
        if (!window.confirm("Delete this message?")) return;
        stompClient.publish({
            destination: '/app/private-chat.deleteMessage',
            body: JSON.stringify({ id: id, roomId: roomId, senderId: currentUserId, type: 'DELETE', isEdited: false })
        });
    };

    const copyMessage = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !stompClient) return;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/private-chat/upload', formData, {
                headers: getAuthHeader()
            });
            stompClient.publish({
                destination: '/app/private-chat.sendMessage',
                body: JSON.stringify({
                    roomId: roomId,
                    senderId: currentUserId,
                    receiverId: targetExpertId,
                    senderName: currentUserName,
                    role: currentUserRole,
                    content: "",
                    type: 'CHAT',
                    fileUrl: response.data,
                    isEdited: false
                })
            });
        } catch (error) {
            alert("Upload failed. Session may have expired.");
        } finally {
            event.target.value = null;
        }
    };

    if (!privateChat || !privateChat.open) return null;

    if (!isVerified) {
        return (
            <div className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border shadow-2xl flex flex-col relative ${isDark ? 'bg-[#0F0F12] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                    <button onClick={() => setPrivateChat({ ...privateChat, open: false })} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10"><X size={18} /></button>
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6 mx-auto">
                        <ShieldCheck size={32} className="text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-black italic uppercase text-center mb-2">Secure Line</h2>
                    <p className="text-center text-[10px] font-bold opacity-50 uppercase mb-4">Chat with: {targetExpertName}</p>
                    <div className="space-y-4 mt-2">
                        <input type="text" value={joinName} onChange={(e) => setJoinName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVerifyAndJoin()} placeholder="Enter your Username..." className={`w-full p-4 rounded-2xl text-sm font-bold outline-none border ${isDark ? 'bg-white/5 border-white/10 focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'}`} />
                        {verifyError && <div className="flex items-center gap-2 text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 p-3 rounded-xl"><ShieldAlert size={14}/> {verifyError}</div>}
                        <button onClick={handleVerifyAndJoin} disabled={isVerifying} className="w-full py-4 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase hover:scale-105 transition-all">{isVerifying ? 'Verifying...' : 'Authenticate & Join'}</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
            <div className={`w-full max-w-3xl h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col border transition-all duration-500 ${isDark ? 'bg-[#0D0D0F]/95 border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'}`}>

                <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/10">
                            <User size={24} className="text-emerald-500" />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black italic uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {targetExpertName}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest opacity-80">
                                    Secure Connection <span className="text-slate-500 ml-1">[{roomId}]</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setPrivateChat({ ...privateChat, open: false })} className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
                        <X size={20} />
                    </button>
                </div>

                <div className={`flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar ${isDark ? 'bg-transparent' : 'bg-[#FBFBFD]'}`}>
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <ShieldCheck size={48} className="mb-4 text-emerald-500" />
                            <p className="text-[10px] font-black uppercase italic tracking-widest text-emerald-500">End-to-end encrypted chat</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => {
                        if (msg.type === 'JOIN' || msg.type === 'LEAVE') {
                            return (
                                <div key={idx} className="flex justify-center my-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-white/5 text-white/50' : 'bg-slate-200/50 text-slate-500'}`}>
                                        {msg.senderName} ({msg.role}) {msg.type === 'JOIN' ? 'connected' : 'disconnected'}
                                    </span>
                                </div>
                            );
                        }

                        const isMe = msg.senderId === currentUserId;

                        return (
                            <div key={idx} className={`group flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 w-full`}>
                                {!isMe && (
                                    <div className="flex items-center gap-2 mb-1.5 px-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-700'}`}>{msg.senderName}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{msg.role}</span>
                                    </div>
                                )}

                                <div className="max-w-[85%] relative">
                                    <div className={`p-4 shadow-sm transition-colors ${
                                        isMe ? 'bg-emerald-500 text-black rounded-[1.8rem] rounded-tr-none' : (isDark ? 'bg-[#1A1A1D] border border-white/10 text-white rounded-[1.8rem] rounded-tl-none' : 'bg-white border border-slate-200 text-slate-800 rounded-[1.8rem] rounded-tl-none')
                                    }`}>
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

                                        <div className={`flex justify-end gap-2 mt-1.5 text-[8px] font-black uppercase tracking-tighter ${isMe ? 'text-black/60' : 'opacity-60'}`}>
                                            {msg.isEdited && <span>(edited)</span>}
                                            {msg.timestamp && <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                                        </div>
                                    </div>

                                    <div className={`absolute top-0 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 ${isMe ? '-left-12 translate-x-2 group-hover:translate-x-0' : '-right-12 -translate-x-2 group-hover:translate-x-0'}`}>
                                        {msg.content && (
                                            <button onClick={() => copyMessage(msg.content)} className={`p-2.5 rounded-xl border transition-all active:scale-90 ${isDark ? 'bg-white/10 border-white/10 text-white hover:bg-emerald-500' : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-500'}`}>
                                                {copiedId === msg.content ? <Check size={12}/> : <Copy size={12}/>}
                                            </button>
                                        )}

                                        {isMe && (
                                            <>
                                                <button onClick={() => setPEditModal({ open: true, id: msg.id, text: msg.content })} className={`p-2.5 rounded-xl border transition-all active:scale-90 ${isDark ? 'bg-white/10 border-white/10 text-white hover:bg-emerald-500' : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-500'}`}>
                                                    <Edit3 size={12}/>
                                                </button>
                                                <button onClick={() => deletePrivateMsg(msg.id)} className={`p-2.5 rounded-xl border transition-all active:scale-90 ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-white border-rose-100 text-rose-400 hover:bg-rose-500 hover:text-white'}`}>
                                                    <Trash2 size={12}/>
                                                </button>
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
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                        <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-emerald-500 rounded-full"><Camera size={18} /></button>
                        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-3 text-slate-400 hover:text-emerald-500 rounded-full"><Smile size={18} /></button>
                        <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPrivateMessage(); } }}
                            placeholder="Type message..."
                            className={`flex-1 bg-transparent py-3 px-2 text-sm font-bold outline-none resize-none max-h-32 min-h-[44px] ${isDark ? 'text-white' : 'text-slate-900'}`}
                            rows="1"
                        />
                        <button onClick={sendPrivateMessage} className="w-12 h-12 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-black hover:scale-105 shadow-lg mb-0.5 mr-0.5"><Send size={18} className="ml-1" /></button>
                    </div>
                </div>

                <PrivateMsgEditModal isDark={isDark} pEditModal={pEditModal} setPEditModal={setPEditModal} savePrivateEdit={savePrivateEdit} />
            </div>
        </div>
    );
}