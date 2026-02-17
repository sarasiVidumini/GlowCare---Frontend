import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Plus, CheckCircle2, Trash2, Edit3, X, Sun, Moon,
    Leaf, Clock, Fingerprint, Activity, MessageSquare, Send, Sparkles, Bell, BellOff,
    Camera, Image as ImageIcon, Smile, User, ShieldCheck, Search, Users, Award, AlertCircle, Zap, Volume2, Copy
} from 'lucide-react';

// --- SHARED LEAF ANIMATION ---
const FallingLeaves = ({ isDark }) => {
    const [leaves, setLeaves] = useState([]);
    useEffect(() => {
        const leafIcons = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 12 + 's',
            duration: 18 + Math.random() * 12 + 's',
            size: 8 + Math.random() * 12 + 'px',
            swing: 20 + Math.random() * 30 + 'px'
        }));
        setLeaves(leafIcons);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {leaves.map((leaf) => (
                <div key={leaf.id} className="absolute top-[-10%]"
                     style={{
                         left: leaf.left,
                         animation: `leafFall ${leaf.duration} linear infinite`,
                         animationDelay: leaf.delay,
                         '--swing-dist': leaf.swing
                     }}
                >
                    <Leaf size={leaf.size} className={`transition-colors duration-1000 ${isDark ? 'text-emerald-500/20' : 'text-emerald-800/20'}`}
                          style={{ transform: `rotate(${Math.random() * 360}deg)` }}
                    />
                </div>
            ))}
            <style>{`
               @keyframes leafFall {
                   0% { transform: translateY(0vh) rotate(0deg) translateX(0px); opacity: 0; }
                   15% { opacity: 1; }
                   50% { transform: translateY(50vh) rotate(180deg) translateX(var(--swing-dist)); }
                   100% { transform: translateY(110vh) rotate(360deg) translateX(0px); opacity: 0; }
               }
           `}</style>
        </div>
    );
};

const INITIAL_DB = {
    Natural: {
        Face: {
            morning: [{name: "Honey Cleanser", stepTime: "07:00 AM"}, {name: "Rose Water Mist", stepTime: "07:15 AM"}, {name: "Aloe Vera Gel", stepTime: "07:30 AM"}],
            night: [{name: "Milk Wash", stepTime: "09:00 PM"}, {name: "Cucumber Toner", stepTime: "09:15 PM"}, {name: "Argan Oil Serum", stepTime: "09:30 PM"}]
        },
        Hair: { morning: [{name: "Rosemary Water", stepTime: "06:30 AM"}], night: [{name: "Coconut Oil Soak", stepTime: "10:00 PM"}] },
        Hands: { morning: [{name: "Lemon Scrub", stepTime: "08:30 AM"}], night: [{name: "Beeswax Wrap", stepTime: "09:45 PM"}] },
        Leg: { morning: [{name: "Dry Brush", stepTime: "06:00 AM"}], night: [{name: "Epsom Salt Soak", stepTime: "08:30 PM"}] }
    },
    Chemical: {
        Face: {
            morning: [{name: "Salicylic Cleanser", stepTime: "07:30 AM"}, {name: "Vitamin C Serum", stepTime: "07:45 AM"}, {name: "SPF 50+", stepTime: "08:30 AM"}],
            night: [{name: "Oil Cleanse", stepTime: "09:00 PM"}, {name: "Retinol 0.5%", stepTime: "09:30 PM"}, {name: "Ceramide Cream", stepTime: "10:00 PM"}]
        },
        Hair: { morning: [{name: "Minoxidil Spray", stepTime: "08:00 AM"}], night: [{name: "Stem Cell Serum", stepTime: "10:00 PM"}] },
        Hands: { morning: [{name: "AHA Cleanser", stepTime: "07:00 AM"}], night: [{name: "Retinoid Cream", stepTime: "10:00 PM"}] },
        Leg: { morning: [{name: "BHA Body Wash", stepTime: "06:30 AM"}], night: [{name: "Lactic Acid Lotion", stepTime: "09:00 PM"}] }
    },
    Ayurvedic: {
        Face: {
            morning: [{name: "Ubtan Wash", stepTime: "06:00 AM"}, {name: "Saffron Mist", stepTime: "06:15 AM"}, {name: "Sandalwood Paste", stepTime: "07:00 AM"}],
            night: [{name: "Triphala Wash", stepTime: "09:30 PM"}, {name: "Kumkumadi Oil", stepTime: "10:00 PM"}]
        },
        Hair: { morning: [{name: "Brahmi Oil", stepTime: "06:00 AM"}], night: [{name: "Bhringraj Oil", stepTime: "09:00 PM"}] },
        Hands: { morning: [{name: "Turmeric Scrub", stepTime: "08:00 AM"}], night: [{name: "Almond Lepa", stepTime: "09:30 PM"}] },
        Leg: { morning: [{name: "Abhyanga Oil", stepTime: "05:30 AM"}], night: [{name: "Ashwagandha Paste", stepTime: "09:00 PM"}] }
    }
};

export default function RoutineTimeline({ isDark }) {
    const { state } = useLocation();

    // --- ADMIN CHECK ---
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    const isAdmin = activeUser?.email === 'admin@glowcare.ai';

    const [db, setDb] = useState(() => JSON.parse(localStorage.getItem('skin_db_v6')) || INITIAL_DB);
    const [path, setPath] = useState(state?.profile?.path || 'Natural');
    const [part, setPart] = useState('Face');
    const [time, setTime] = useState('morning');
    const [done, setDone] = useState(() => JSON.parse(localStorage.getItem('done_tasks')) || {});
    const [modal, setModal] = useState({ open: false, type: 'add', index: null, value: "", stepTime: "" });
    const [notifEnabled, setNotifEnabled] = useState(false);

    // --- ALARM & SOUND STATES ---
    const [activeAlarm, setActiveAlarm] = useState(null);
    const [nextRoutine, setNextRoutine] = useState(null);
    const alarmAudio = useRef(new Audio("assets/sounds/alarm-audio.mp3"));

    // --- CHAT STATES & LOGIC ---
    const [showChat, setShowChat] = useState(false);
    const [chatMsg, setChatMsg] = useState("");
    const [editModal, setEditModal] = useState({ open: false, id: null, text: "" });
    const [messages, setMessages] = useState([
        { id: 1, user: "Admin", text: "Welcome to the GlowCare Report Feed! Share your progress. ✨", isAdmin: true, time: "10:00 AM" },
        { id: 2, user: "User_1", text: "The Honey Cleanser works amazing on my dry skin! 🍯", isAdmin: false, time: "10:05 AM" }
    ]);

    const sendChatMessage = () => {
        if (!chatMsg.trim()) return;
        const newMessage = {
            id: Date.now(),
            user: isAdmin ? "Admin" : (activeUser?.name || "GlowUser"),
            text: chatMsg,
            isAdmin: isAdmin,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
        setChatMsg("");
    };

    const copyMessage = (text) => {
        navigator.clipboard.writeText(text);
    };

    const deleteMessage = (id) => {
        setMessages(prev => prev.filter(m => m.id !== id));
    };

    const openEditModal = (id, text) => {
        setEditModal({ open: true, id, text });
    };

    const saveEdit = () => {
        if (!editModal.text.trim()) return;
        setMessages(prev => prev.map(m => m.id === editModal.id ? { ...m, text: editModal.text } : m));
        setEditModal({ open: false, id: null, text: "" });
    };

    // --- EXPERTS STATES ---
    const [showExpertsModal, setShowExpertsModal] = useState(false);
    const [experts, setExperts] = useState(() => {
        const savedExperts = JSON.parse(localStorage.getItem('glow_experts')) || [
            { id: 1, name: "Dr. Sandali Perera", role: "Dermatologist", bio: "Skin specialist with 10 years experience." },
            { id: 2, name: "Vaidya Aruna", role: "Ayurvedic Expert", bio: "Specialist in herbal skin treatments." },
            { id: 3, name: "Dr. Nuwan Silva", role: "Cosmetologist", bio: "Expert in chemical routine management." }
        ];

        const registeredProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
        const registeredExperts = registeredProfiles
            .filter(u => u.role === 'expert')
            .map(u => ({
                id: u.id || Date.now(),
                name: u.name,
                role: "Clinical Expert",
                bio: `Licensed professional (ID: ${u.license || 'Verified'}). Available for skin consultations.`
            }));

        const allExperts = [...savedExperts, ...registeredExperts];
        return Array.from(new Map(allExperts.map(item => [item.name, item])).values());
    });

    const [expertEditModal, setExpertEditModal] = useState({ open: false, index: null, name: "", role: "", bio: "" });

    // --- PRIVATE EXPERT CHAT LOGIC ---
    const [privateChat, setPrivateChat] = useState({ open: false, expert: null, messages: [] });
    const [pChatMsg, setPChatMsg] = useState("");
    const [pEditModal, setPEditModal] = useState({ open: false, id: null, text: "" });

    const openPrivateChat = (expert) => {
        setPrivateChat({ ...privateChat, open: true, expert: expert, messages: [] });
    };

    const sendPrivateMessage = () => {
        if (!pChatMsg.trim()) return;
        const newMsg = {
            id: Date.now(),
            text: pChatMsg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setPrivateChat(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
        setPChatMsg("");
    };

    const deletePrivateMsg = (id) => {
        setPrivateChat(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) }));
    };

    const openPrivateEdit = (id, text) => {
        setPEditModal({ open: true, id, text });
    };

    const savePrivateEdit = () => {
        if (!pEditModal.text.trim()) return;
        setPrivateChat(prev => ({
            ...prev,
            messages: prev.messages.map(m => m.id === pEditModal.id ? { ...m, text: pEditModal.text } : m)
        }));
        setPEditModal({ open: false, id: null, text: "" });
    };

    useEffect(() => {
        localStorage.setItem('skin_db_v6', JSON.stringify(db));
        localStorage.setItem('done_tasks', JSON.stringify(done));
        localStorage.setItem('glow_experts', JSON.stringify(experts));
    }, [db, done, experts]);

    const getTimeAsDate = (timeStr) => {
        const [t, modifier] = timeStr.split(' ');
        let [hours, minutes] = t.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        const d = new Date();
        d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        return d;
    };

    useEffect(() => {
        const checkRoutines = setInterval(() => {
            const now = new Date();
            const currentTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            let upcoming = [];
            Object.keys(db[path]).forEach(bodyPart => {
                ['morning', 'night'].forEach(tSlot => {
                    db[path][bodyPart][tSlot].forEach(item => {
                        const itemDate = getTimeAsDate(item.stepTime);
                        if (item.stepTime === currentTimeStr && notifEnabled) {
                            if (!activeAlarm || activeAlarm.name !== item.name) {
                                setActiveAlarm({ name: item.name, time: item.stepTime, bodyPart: bodyPart });
                                alarmAudio.current.loop = true;
                                alarmAudio.current.play().catch(e => console.log("Sound pending click..."));
                            }
                        }
                        if (itemDate > now) upcoming.push({ ...item, part: bodyPart, diff: itemDate - now });
                    });
                });
            });
            if (upcoming.length > 0) {
                upcoming.sort((a, b) => a.diff - b.diff);
                setNextRoutine(upcoming[0]);
            } else setNextRoutine(null);
        }, 1000);
        return () => clearInterval(checkRoutines);
    }, [notifEnabled, db, path, activeAlarm]);

    const handleBellClick = () => {
        if (!notifEnabled) {
            alarmAudio.current.play().then(() => {
                alarmAudio.current.pause();
                alarmAudio.current.currentTime = 0;
                setNotifEnabled(true);
            }).catch(() => setNotifEnabled(true));
        } else setNotifEnabled(false);
    };

    const toggleDone = (pName) => setDone(p => ({ ...p, [`${path}-${part}-${time}-${pName}`]: !p[`${path}-${part}-${time}-${pName}`] }));

    const saveProduct = () => {
        if (!isAdmin) return;
        const newDb = { ...db };
        const newEntry = { name: modal.value, stepTime: modal.stepTime || "08:00 AM" };
        if (modal.type === 'add') newDb[path][part][time].push(newEntry);
        else newDb[path][part][time][modal.index] = newEntry;
        setDb(newDb); setModal({ open: false, type: 'add', index: null, value: "", stepTime: "" });
    };

    const deleteProduct = (idx) => {
        if (!isAdmin) return;
        const newDb = { ...db }; newDb[path][part][time].splice(idx, 1); setDb(newDb);
    };

    const deleteExpert = (idx) => {
        if (!isAdmin) return;
        const newExperts = [...experts];
        newExperts.splice(idx, 1);
        setExperts(newExperts);
    };

    const saveExpertUpdate = () => {
        if (!isAdmin) return;
        const newExperts = [...experts];
        newExperts[expertEditModal.index] = {
            ...newExperts[expertEditModal.index],
            name: expertEditModal.name,
            role: expertEditModal.role,
            bio: expertEditModal.bio
        };
        setExperts(newExperts);
        setExpertEditModal({ open: false, index: null, name: "", role: "", bio: "" });
    };

    const currentList = db[path][part][time] || [];
    const progress = currentList.length > 0 ? Math.round((currentList.filter(item => done[`${path}-${part}-${time}-${item.name}`]).length / currentList.length) * 100) : 0;

    return (
        <div className={`min-h-screen p-4 lg:p-6 relative overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />

            {nextRoutine && (
                <div className="max-w-[1200px] mx-auto mb-6 relative z-[50]">
                    <div className={`p-4 rounded-[2rem] backdrop-blur-md flex items-center justify-between shadow-xl ${isDark ? 'bg-emerald-500/10' : 'bg-white'}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse"><Zap size={18} className="text-black" /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-emerald-500">Upcoming</p>
                                <p className="text-sm font-bold uppercase italic">{nextRoutine.name} ({nextRoutine.part})</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pr-4"><Clock size={14} className="text-emerald-500" /><span className="text-xs font-black uppercase">{nextRoutine.stepTime}</span></div>
                    </div>
                </div>
            )}

            <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6 relative z-10">
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className={`rounded-[2.5rem] p-8 backdrop-blur-xl ${isDark ? 'bg-[#0F0F12]/80' : 'bg-white shadow-xl shadow-slate-200/50'}`}>
                        <div className="flex gap-3 mb-10">
                            <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-500 text-black' : 'bg-slate-900 text-white'}`}><Fingerprint size={20} /></div>
                            <button onClick={handleBellClick} className={`p-2 rounded-xl transition-all ${notifEnabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-slate-500'}`}>
                                {notifEnabled ? <Bell size={20} className="animate-wiggle" /> : <BellOff size={20} />}
                            </button>
                            <button onClick={() => setShowChat(true)} className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><MessageSquare size={20} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Natural', 'Chemical', 'Ayurvedic'].map(p => (
                                <button key={p} onClick={() => setPath(p)} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${path === p ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>{p}</button>
                            ))}
                        </div>
                        <h2 className="text-4xl font-black italic uppercase leading-none">{part} <br/><span className="text-emerald-500">Timeline.</span></h2>
                        <button onClick={() => setShowExpertsModal(true)} className="w-full mt-8 p-4 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-emerald-900/20">
                            <Users size={16} /> To Meet The Experts
                        </button>
                    </div>
                    <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white h-[160px] shadow-xl relative overflow-hidden">
                        <p className="text-[9px] font-black uppercase opacity-60">Progress</p>
                        <div className="text-5xl font-black italic mt-2">{progress}%</div>
                        <Activity className="absolute -right-4 -bottom-4 text-white/10" size={100} />
                    </div>
                </div>

                <div className={`col-span-12 lg:col-span-8 rounded-[2.5rem] p-8 backdrop-blur-xl ${isDark ? 'bg-[#0F0F12]/80' : 'bg-white shadow-xl'}`}>
                    <header className="flex justify-between items-center mb-10">
                        <div className={`flex p-1 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                            {['morning', 'night'].map(t => (
                                <button key={t} onClick={() => setTime(t)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase ${time === t ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>{t}</button>
                            ))}
                        </div>
                        {isAdmin && (
                            <button onClick={() => setModal({ open: true, type: 'add', index: null, value: "", stepTime: "" })} className="flex items-center gap-2 p-3 bg-emerald-600 rounded-xl text-white px-5 font-black uppercase text-[10px] active:scale-95 transition-all shadow-lg shadow-emerald-900/20">
                                <Plus size={14} strokeWidth={3} /> ADD FORMULA
                            </button>
                        )}
                    </header>
                    <div className="space-y-4">
                        {currentList.map((product, idx) => (
                            <div key={idx} className={`group flex items-center justify-between p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-[#FBFBFD] border-slate-100 hover:shadow-lg'}`}>
                                <div className="flex items-center gap-6">
                                    <button onClick={() => toggleDone(product.name)} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center ${done[`${path}-${part}-${time}-${product.name}`] ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-300'}`}><CheckCircle2 size={20} /></button>
                                    <div><span className={`text-xl font-black italic uppercase ${done[`${path}-${part}-${time}-${product.name}`] ? 'opacity-30 line-through' : ''}`}>{product.name}</span><p className="text-[11px] text-emerald-500 font-bold uppercase italic">{product.stepTime}</p></div>
                                </div>
                                {isAdmin && (
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => setModal({ open: true, type: 'edit', index: idx, value: product.name, stepTime: product.stepTime })} className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500"><Edit3 size={14}/></button>
                                        <button onClick={() => deleteProduct(idx)} className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500"><Trash2 size={14}/></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-12 flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                    {['Face', 'Hair', 'Hands', 'Leg'].map(p => (
                        <button key={p} onClick={() => setPart(p)} className={`flex-none px-12 py-6 rounded-[2.2rem] border font-black uppercase text-[10px] transition-all ${part === p ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-500'}`}>{p} focus</button>
                    ))}
                </div>
            </div>

            {/* PUBLIC CHAT MODAL */}
            {showChat && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[2000] flex items-center justify-center p-4">
                    <div className={`w-full max-w-2xl h-[80vh] rounded-[3rem] overflow-hidden flex flex-col border ${isDark ? 'bg-[#0F0F12] border-white/10' : 'bg-white shadow-2xl'}`}>
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-black italic uppercase">Report <span className="text-emerald-500">Feed.</span></h3>
                            <button onClick={() => setShowChat(false)} className="p-2 rounded-full hover:bg-white/5"><X /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`group flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-3xl relative ${msg.isAdmin ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-900 rounded-tl-none'}`}>
                                        <div className="flex justify-between gap-4 mb-1">
                                            <span className="text-[10px] font-black uppercase opacity-60">{msg.user}</span>
                                            <span className="text-[10px] opacity-40">{msg.time}</span>
                                        </div>
                                        <p className="text-sm font-bold">{msg.text}</p>
                                        <div className={`absolute top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all ${msg.isAdmin ? '-left-12' : '-right-12'}`}>
                                            <button onClick={() => copyMessage(msg.text)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all backdrop-blur-md"><Copy size={14}/></button>
                                            <button onClick={() => openEditModal(msg.id, msg.text)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all backdrop-blur-md"><Edit3 size={14}/></button>
                                            <button onClick={() => deleteMessage(msg.id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all backdrop-blur-md"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-white/5 flex gap-2">
                            <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} placeholder="Share your experience..." className={`flex-1 p-4 rounded-2xl outline-none text-sm font-bold ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border'}`} />
                            <button onClick={sendChatMessage} className="p-4 bg-emerald-500 rounded-2xl text-black"><Send size={20}/></button>
                        </div>
                    </div>
                </div>
            )}

            {/* PUBLIC CHAT EDIT MODAL (POP-UP) */}
            {editModal.open && (
                <div className="fixed inset-0 bg-black/90 z-[4000] flex items-center justify-center p-6 animate-in zoom-in duration-300">
                    <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#141417] border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>
                        <h4 className="text-xl font-black italic uppercase mb-6 text-emerald-500 text-center">Update Report</h4>
                        <textarea
                            value={editModal.text}
                            onChange={(e) => setEditModal({...editModal, text: e.target.value})}
                            className={`w-full p-4 rounded-xl mb-6 border bg-transparent h-32 font-bold text-sm outline-none ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}`}
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setEditModal({open: false, id: null, text: ""})} className="flex-1 p-4 rounded-2xl bg-slate-100 text-black uppercase font-black text-[10px] tracking-widest active:scale-95 transition-all">Cancel</button>
                            <button onClick={saveEdit} className="flex-1 p-4 bg-emerald-500 text-black rounded-2xl uppercase font-black text-[10px] tracking-widest active:scale-95 transition-all">Update Now</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PRODUCT ADD/EDIT MODAL */}
            {modal.open && (
                <div className="fixed inset-0 bg-black/90 z-[3000] flex items-center justify-center p-6 animate-in zoom-in duration-300">
                    <div className={`relative w-full max-w-md p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#141417] border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>
                        <button onClick={() => setModal({ open: false, type: 'add', index: null, value: "", stepTime: "" })} className="absolute top-6 right-6 text-slate-400"><X size={20}/></button>
                        <h4 className="text-xl font-black italic uppercase mb-6 text-emerald-500">{modal.type === 'add' ? 'Add New' : 'Edit'} Formula</h4>
                        <input value={modal.value} onChange={(e) => setModal({...modal, value: e.target.value})} placeholder="Product Name" className={`w-full p-4 rounded-xl outline-none font-bold text-sm mb-4 border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                        <input value={modal.stepTime} onChange={(e) => setModal({...modal, stepTime: e.target.value})} placeholder="Time (e.g. 08:00 AM)" className={`w-full p-4 rounded-xl outline-none font-bold text-sm mb-6 border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                        <button onClick={saveProduct} className="w-full p-4 bg-emerald-500 rounded-2xl text-black font-black uppercase text-xs tracking-widest active:scale-95 transition-all">Save Formula</button>
                    </div>
                </div>
            )}

            {/* EXPERTS MODAL */}
            {showExpertsModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[2000] flex items-center justify-center p-6">
                    <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-10 border transition-all ${isDark ? 'bg-[#0F0F12] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'}`}>
                        <button onClick={() => setShowExpertsModal(false)} className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 text-slate-500"><X size={24}/></button>
                        <h2 className="text-4xl font-black italic uppercase text-emerald-500 mb-12">Expert Panel.</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {experts.map((exp, idx) => (
                                <div key={exp.id} className={`group relative p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    {isAdmin && (
                                        <div className="absolute top-6 right-6 flex gap-2">
                                            <button onClick={() => setExpertEditModal({ open: true, index: idx, name: exp.name, role: exp.role, bio: exp.bio })} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Edit3 size={14}/></button>
                                            <button onClick={() => deleteExpert(idx)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500"><Trash2 size={14}/></button>
                                        </div>
                                    )}
                                    <h4 className="text-lg font-black uppercase italic">{exp.name}</h4>
                                    <p className="text-[10px] font-black uppercase text-emerald-500 mb-3">{exp.role}</p>
                                    <p className="text-sm font-bold opacity-60 mb-8">{exp.bio}</p>
                                    <button onClick={() => openPrivateChat(exp)} className="w-full p-4 rounded-2xl bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest">Consult Now</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* PRIVATE EXPERT CHAT */}
            {privateChat.open && (
                <div className="fixed inset-0 z-[3000] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-lg h-[600px] flex flex-col rounded-[2.5rem] border overflow-hidden ${isDark ? 'bg-[#0F0F12] border-white/10 text-white' : 'bg-white border-slate-200 shadow-2xl'}`}>
                        <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/5' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-xs uppercase">{privateChat.expert?.name.charAt(0)}</div>
                                <h4 className="text-sm font-black uppercase italic">{privateChat.expert?.name}</h4>
                            </div>
                            <button onClick={() => setPrivateChat({ ...privateChat, open: false })}><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                            {privateChat.messages.map(msg => (
                                <div key={msg.id} className="group flex flex-col items-end">
                                    <div className="relative bg-emerald-500 p-4 rounded-2xl rounded-tr-none text-white text-xs font-bold max-w-[85%]">
                                        <p>{msg.text}</p>
                                        <span className="text-[8px] opacity-60 mt-1 block text-right">{msg.time}</span>
                                        <div className="absolute top-0 -left-12 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => copyMessage(msg.text)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all backdrop-blur-md"><Copy size={12}/></button>
                                            <button onClick={() => openPrivateEdit(msg.id, msg.text)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all backdrop-blur-md"><Edit3 size={12}/></button>
                                            <button onClick={() => deletePrivateMsg(msg.id)} className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all backdrop-blur-md"><Trash2 size={12}/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-white/5 flex gap-2">
                            <input value={pChatMsg} onChange={(e) => setPChatMsg(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent outline-none text-sm font-bold" />
                            <button onClick={sendPrivateMessage} className="p-3 bg-emerald-500 rounded-xl text-black"><Send size={18}/></button>
                        </div>
                    </div>
                </div>
            )}

            {/* PRIVATE CHAT EDIT MODAL */}
            {pEditModal.open && (
                <div className="fixed inset-0 bg-black/90 z-[4000] flex items-center justify-center p-6 animate-in zoom-in duration-300">
                    <div className={`w-full max-w-sm p-8 rounded-[2rem] border ${isDark ? 'bg-[#141417] border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>
                        <h4 className="text-xl font-black italic uppercase mb-6 text-emerald-500 text-center">Edit Private Chat</h4>
                        <textarea
                            value={pEditModal.text}
                            onChange={(e) => setPEditModal({...pEditModal, text: e.target.value})}
                            className={`w-full p-4 rounded-xl mb-4 border bg-transparent h-32 font-bold text-sm outline-none ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}`}
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setPEditModal({open: false, id: null, text: ""})} className="flex-1 p-4 rounded-2xl bg-slate-100 text-black uppercase font-black text-[10px] tracking-widest active:scale-95 transition-all">Cancel</button>
                            <button onClick={savePrivateEdit} className="flex-1 p-4 bg-emerald-500 text-black rounded-2xl uppercase font-black text-[10px] tracking-widest active:scale-95 transition-all">Update</button>
                        </div>
                    </div>
                </div>
            )}

            {/* EXPERT EDIT MODAL */}
            {expertEditModal.open && (
                <div className="fixed inset-0 bg-black/90 z-[3000] flex items-center justify-center p-6">
                    <div className={`w-full max-w-md p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#141417] border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>
                        <h4 className="text-xl font-black italic uppercase mb-6 text-emerald-500">Edit Expert</h4>
                        <input value={expertEditModal.name} onChange={(e) => setExpertEditModal({...expertEditModal, name: e.target.value})} placeholder="Name" className="w-full p-4 rounded-xl mb-4 border bg-transparent" />
                        <input value={expertEditModal.role} onChange={(e) => setExpertEditModal({...expertEditModal, role: e.target.value})} placeholder="Role" className="w-full p-4 rounded-xl mb-4 border bg-transparent" />
                        <textarea value={expertEditModal.bio} onChange={(e) => setExpertEditModal({...expertEditModal, bio: e.target.value})} placeholder="Bio" className="w-full p-4 rounded-xl mb-6 border bg-transparent h-32" />
                        <div className="flex gap-4">
                            <button onClick={() => setExpertEditModal({open: false})} className="flex-1 p-4 rounded-2xl bg-slate-100 text-black uppercase font-black">Cancel</button>
                            <button onClick={saveExpertUpdate} className="flex-1 p-4 bg-emerald-500 text-black rounded-2xl uppercase font-black">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}