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
        Legs: { morning: [{name: "Dry Brush", stepTime: "06:00 AM"}], night: [{name: "Epsom Salt Soak", stepTime: "08:30 PM"}] }
    },
    Chemical: {
        Face: {
            morning: [{name: "Salicylic Cleanser", stepTime: "07:30 AM"}, {name: "Vitamin C Serum", stepTime: "07:45 AM"}, {name: "SPF 50+", stepTime: "08:30 AM"}],
            night: [{name: "Oil Cleanse", stepTime: "09:00 PM"}, {name: "Retinol 0.5%", stepTime: "09:30 PM"}, {name: "Ceramide Cream", stepTime: "10:00 PM"}]
        },
        Hair: { morning: [{name: "Minoxidil Spray", stepTime: "08:00 AM"}], night: [{name: "Stem Cell Serum", stepTime: "10:00 PM"}] },
        Hands: { morning: [{name: "AHA Cleanser", stepTime: "07:00 AM"}], night: [{name: "Retinoid Cream", stepTime: "10:00 PM"}] },
        Legs: { morning: [{name: "BHA Body Wash", stepTime: "06:30 AM"}], night: [{name: "Lactic Acid Lotion", stepTime: "09:00 PM"}] }
    },
    Ayurvedic: {
        Face: {
            morning: [{name: "Ubtan Wash", stepTime: "06:00 AM"}, {name: "Saffron Mist", stepTime: "06:15 AM"}, {name: "Sandalwood Paste", stepTime: "07:00 AM"}],
            night: [{name: "Triphala Wash", stepTime: "09:30 PM"}, {name: "Kumkumadi Oil", stepTime: "10:00 PM"}]
        },
        Hair: { morning: [{name: "Brahmi Oil", stepTime: "06:00 AM"}], night: [{name: "Bhringraj Oil", stepTime: "09:00 PM"}] },
        Hands: { morning: [{name: "Turmeric Scrub", stepTime: "08:00 AM"}], night: [{name: "Almond Lepa", stepTime: "09:30 PM"}] },
        Legs: { morning: [{name: "Abhyanga Oil", stepTime: "05:30 AM"}], night: [{name: "Ashwagandha Paste", stepTime: "09:00 PM"}] }
    }
};

export default function RoutineTimeline({ isDark }) {
    const { state } = useLocation();

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
    const alarmAudio = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"));

    // --- CHAT STATES & LOGIC ---
    const [showChat, setShowChat] = useState(false);
    const [chatMsg, setChatMsg] = useState("");
    const [editModal, setEditModal] = useState({ open: false, id: null, text: "" });
    const [messages, setMessages] = useState([
        { id: 1, user: "Admin", text: "Welcome to the GlowCare Report Feed! Share your progress. ✨", isAdmin: true, time: "10:00 AM" },
        { id: 2, user: "User_42", text: "The Honey Cleanser works amazing on my dry skin! 🍯", isAdmin: false, time: "10:05 AM" }
    ]);

    const sendChatMessage = () => {
        if (!chatMsg.trim()) return;
        const newMessage = {
            id: Date.now(),
            user: "Admin",
            text: chatMsg,
            isAdmin: true,
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
    const [experts, setExperts] = useState(() => JSON.parse(localStorage.getItem('glow_experts')) || [
        { id: 1, name: "Dr. Sandali Perera", role: "Dermatologist", bio: "Skin specialist with 10 years experience." },
        { id: 2, name: "Vaidya Aruna", role: "Ayurvedic Expert", bio: "Specialist in herbal skin treatments." },
        { id: 3, name: "Dr. Nuwan Silva", role: "Cosmetologist", bio: "Expert in chemical routine management." }
    ]);
    const [expertEditModal, setExpertEditModal] = useState({ open: false, index: null, name: "", role: "", bio: "" });

    // --- PRIVATE EXPERT CHAT LOGIC ---
    const [privateChat, setPrivateChat] = useState({ open: false, expert: null, messages: [] });
    const [pChatMsg, setPChatMsg] = useState("");
    const [pEditModal, setPEditModal] = useState({ open: false, id: null, text: "" });

    const openPrivateChat = (expert) => {
        setPrivateChat({ ...privateChat, open: true, expert: expert });
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

    const savePrivateEdit = () => {
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

    const stopAlarm = () => {
        setActiveAlarm(null);
        alarmAudio.current.pause();
        alarmAudio.current.currentTime = 0;
    };

    const handleBellClick = () => {
        if (!notifEnabled) {
            alarmAudio.current.play().then(() => {
                alarmAudio.current.pause();
                setNotifEnabled(true);
            }).catch(() => setNotifEnabled(true));
        } else setNotifEnabled(false);
    };

    const toggleDone = (pName) => setDone(p => ({ ...p, [`${path}-${part}-${time}-${pName}`]: !p[`${path}-${part}-${time}-${pName}`] }));
    const saveProduct = () => {
        const newDb = { ...db };
        const newEntry = { name: modal.value, stepTime: modal.stepTime || "08:00 AM" };
        if (modal.type === 'add') newDb[path][part][time].push(newEntry);
        else newDb[path][part][time][modal.index] = newEntry;
        setDb(newDb); setModal({ open: false, type: 'add', index: null, value: "", stepTime: "" });
    };
    const deleteProduct = (idx) => { const newDb = { ...db }; newDb[path][part][time].splice(idx, 1); setDb(newDb); };

    const deleteExpert = (idx) => {
        const newExperts = [...experts];
        newExperts.splice(idx, 1);
        setExperts(newExperts);
    };

    const saveExpertUpdate = () => {
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
                            <button onClick={handleBellClick} className={`p-2 rounded-xl  transition-all ${notifEnabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5  text-slate-500'}`}>
                                {notifEnabled ? <Bell size={20} className="animate-wiggle" /> : <BellOff size={20} />}
                            </button>
                            <button onClick={() => setShowChat(true)} className="p-2 rounded-xl  bg-emerald-500/10 text-emerald-500"><MessageSquare size={20} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Natural', 'Chemical', 'Ayurvedic'].map(p => (
                                <button key={p} onClick={() => setPath(p)} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase  transition-all ${path === p ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>{p}</button>
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

                <div className={`col-span-12 lg:col-span-8 rounded-[2.5rem] p-8  backdrop-blur-xl ${isDark ? 'bg-[#0F0F12]/80' : 'bg-white shadow-xl'}`}>
                    <header className="flex justify-between items-center mb-10">
                        <div className={`flex p-1 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                            {['morning', 'night'].map(t => (
                                <button key={t} onClick={() => setTime(t)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase ${time === t ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>{t}</button>
                            ))}
                        </div>
                        <button
                            onClick={() => setModal({ open: true, type: 'add', index: null, value: "", stepTime: "" })}
                            className="flex items-center gap-2 p-3 bg-emerald-600 rounded-xl text-white px-5 font-black uppercase text-[10px] active:scale-95 transition-all shadow-lg shadow-emerald-900/20"
                        >
                            <Plus size={14} strokeWidth={3} /> ADD FORMULA
                        </button>
                    </header>
                    <div className="space-y-4">
                        {currentList.map((product, idx) => (
                            <div key={idx} className={`group flex items-center justify-between p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-[#FBFBFD] border-slate-100 hover:shadow-lg'}`}>
                                <div className="flex items-center gap-6">
                                    <button onClick={() => toggleDone(product.name)} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center ${done[`${path}-${part}-${time}-${product.name}`] ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-300'}`}><CheckCircle2 size={20} /></button>
                                    <div><span className={`text-xl font-black italic uppercase ${done[`${path}-${part}-${time}-${product.name}`] ? 'opacity-30 line-through' : ''}`}>{product.name}</span><p className="text-[11px] text-emerald-500 font-bold uppercase italic">{product.stepTime}</p></div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => setModal({ open: true, type: 'edit', index: idx, value: product.name, stepTime: product.stepTime })} className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500"><Edit3 size={14}/></button>
                                    <button onClick={() => deleteProduct(idx)} className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-12 flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                    {['Face', 'Hair', 'Hands', 'Legs'].map(p => (
                        <button key={p} onClick={() => setPart(p)} className={`flex-none px-12 py-6 rounded-[2.2rem] border font-black uppercase text-[10px] transition-all ${part === p ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-500'}`}>{p} focus</button>
                    ))}
                </div>
            </div>

            {/* EXPERTS MODAL WITH UPDATE & DELETE */}
            {showExpertsModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-10 shadow-2xl border transition-all ${isDark ? 'bg-[#0F0F12] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <button onClick={() => setShowExpertsModal(false)} className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 transition-all text-slate-500"><X size={24}/></button>

                        <div className="mb-12">
                            <h2 className="text-4xl font-black italic uppercase text-emerald-500">GlowCare <br/><span className={isDark ? 'text-white' : 'text-slate-900'}>Expert Panel.</span></h2>
                            <p className="text-xs font-bold uppercase opacity-50 mt-2 tracking-widest">Direct access to skin health specialists</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {experts.map((exp, idx) => (
                                <div key={exp.id} className={`group relative p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-100 hover:shadow-xl'}`}>
                                    {/* Edit/Delete Buttons in Corner */}
                                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                        <button
                                            onClick={() => setExpertEditModal({ open: true, index: idx, name: exp.name, role: exp.role, bio: exp.bio })}
                                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                                        >
                                            <Edit3 size={14}/>
                                        </button>
                                        <button
                                            onClick={() => deleteExpert(idx)}
                                            className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={14}/>
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20">
                                            {exp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black uppercase italic tracking-tight">{exp.name}</h4>
                                            <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{exp.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold opacity-60 leading-relaxed mb-8">{exp.bio}</p>
                                    <button onClick={() => openPrivateChat(exp)} className="w-full p-4 rounded-2xl bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-500/10">
                                        <MessageSquare size={16} /> Consult Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* EXPERT UPDATE MODAL POPUP */}
            {expertEditModal.open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[3000] flex items-center justify-center p-6 animate-in zoom-in duration-300">
                    <div className={`relative w-full max-w-md rounded-[3rem] p-10 shadow-2xl border ${isDark ? 'bg-[#141417] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <button onClick={() => setExpertEditModal({...expertEditModal, open: false})} className="absolute top-8 right-8 text-slate-400"><X size={20}/></button>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-500 rounded-2xl text-black shadow-lg shadow-emerald-500/20"><User size={20} /></div>
                            <h3 className="text-2xl font-black italic uppercase text-emerald-500">Edit Expert</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Name</label>
                                <input
                                    className={`w-full p-4 rounded-xl outline-none font-bold text-sm border mt-1 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={expertEditModal.name}
                                    onChange={(e) => setExpertEditModal({...expertEditModal, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Role</label>
                                <input
                                    className={`w-full p-4 rounded-xl outline-none font-bold text-sm border mt-1 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={expertEditModal.role}
                                    onChange={(e) => setExpertEditModal({...expertEditModal, role: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Bio</label>
                                <textarea
                                    className={`w-full p-4 rounded-xl outline-none font-bold text-sm border mt-1 h-24 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={expertEditModal.bio}
                                    onChange={(e) => setExpertEditModal({...expertEditModal, bio: e.target.value})}
                                />
                            </div>
                            <button onClick={saveExpertUpdate} className="w-full p-4 bg-emerald-600 rounded-2xl text-white font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-emerald-900/20 mt-4">
                                Update Expert Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PRIVATE EXPERT CHAT POP-UP */}
            {privateChat.open && (
                <div className="fixed inset-0 z-[3000] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-lg h-[600px] flex flex-col rounded-[2.5rem] shadow-2xl border overflow-hidden animate-in zoom-in duration-300 ${
                        isDark ? 'bg-[#0B0B0D] border-white/10' : 'bg-white border-slate-200'
                    }`}>
                        <div className="p-6 border-b flex justify-between items-center bg-emerald-500 text-black">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center font-black">
                                    {privateChat.expert?.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black uppercase italic leading-none">{privateChat.expert?.name}</h3>
                                    <p className="text-[9px] font-bold uppercase opacity-70">Private Consultation</p>
                                </div>
                            </div>
                            <button onClick={() => setPrivateChat({ ...privateChat, open: false })} className="p-2 hover:bg-black/10 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className={`flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar ${isDark ? 'bg-transparent' : 'bg-[#FBFBFD]'}`}>
                            {privateChat.messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-10">
                                    <MessageSquare size={48} className="mb-4" />
                                    <p className="text-xs font-black uppercase">No messages yet. <br/> Start your private session.</p>
                                </div>
                            )}
                            {privateChat.messages.map(m => (
                                <div key={m.id} className="group flex flex-col items-end">
                                    <div className="relative max-w-[90%]">
                                        <div className="p-4 rounded-[1.5rem] rounded-tr-none bg-emerald-500 text-black text-sm font-bold shadow-sm">
                                            {m.text}
                                        </div>
                                        <div className="flex gap-1 absolute -bottom-5 right-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                            <button onClick={() => copyMessage(m.text)} className="p-1 rounded bg-slate-800 text-white" title="Copy"><Copy size={12}/></button>
                                            <button onClick={() => setPEditModal({ open: true, id: m.id, text: m.text })} className="p-1 rounded bg-blue-600 text-white" title="Edit"><Edit3 size={12}/></button>
                                            <button onClick={() => deletePrivateMsg(m.id)} className="p-1 rounded bg-rose-600 text-white" title="Delete"><Trash2 size={12}/></button>
                                        </div>
                                    </div>
                                    <span className="text-[8px] mt-1 opacity-40 font-bold">{m.time}</span>
                                </div>
                            ))}
                        </div>

                        <div className={`p-5 border-t ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="relative flex items-center">
                                <input
                                    value={pChatMsg}
                                    onChange={(e) => setPChatMsg(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendPrivateMessage()}
                                    className={`w-full p-4 pr-14 rounded-2xl outline-none font-bold text-sm border ${
                                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                    }`}
                                    placeholder="Type private message..."
                                />
                                <button onClick={sendPrivateMessage} className="absolute right-2 p-2.5 bg-emerald-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PRIVATE MESSAGE EDIT MODAL */}
            {pEditModal.open && (
                <div className="fixed inset-0 z-[4000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className={`w-full max-w-sm p-8 rounded-[2rem] border ${isDark ? 'bg-[#141417] border-white/10 text-white' : 'bg-white border-slate-200'}`}>
                        <h4 className="text-lg font-black uppercase italic mb-4 text-emerald-500">Edit Message</h4>
                        <textarea
                            className={`w-full p-4 rounded-xl outline-none font-bold text-sm border h-32 mb-4 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                            value={pEditModal.text}
                            onChange={(e) => setPEditModal({ ...pEditModal, text: e.target.value })}
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setPEditModal({ open: false, id: null, text: "" })} className="flex-1 p-3 rounded-xl font-bold uppercase text-[10px] bg-white/10">Cancel</button>
                            <button onClick={savePrivateEdit} className="flex-1 p-3 rounded-xl font-bold uppercase text-[10px] bg-emerald-500 text-black">Save Update</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CHAT FEED POP-UP (Public) */}
            {showChat && (
                <div className="fixed inset-0 z-[1000] flex justify-end items-end p-4 md:p-6 pointer-events-none">
                    <div className={`w-full max-w-md h-[80vh] md:h-[650px] flex flex-col rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border pointer-events-auto overflow-hidden animate-in slide-in-from-right duration-300 transition-colors ${
                        isDark ? 'bg-[#0B0B0D] border-white/10' : 'bg-white border-slate-200'
                    }`}>
                        <div className={`p-6 border-b flex justify-between items-center transition-colors ${
                            isDark ? 'bg-emerald-500/5 border-white/5' : 'bg-emerald-50/80 border-slate-100'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/30">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 rounded-full animate-pulse transition-colors"
                                         style={{ borderColor: isDark ? '#0B0B0D' : '#FFFFFF' }}></div>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-black italic leading-none uppercase tracking-tighter ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>GlowCare Admin</h3>
                                    <p className={`text-[9px] font-black uppercase flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                                        <Zap size={10} className="fill-emerald-500 text-emerald-500" /> Public Report Feed
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowChat(false)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/5 text-white/50' : 'hover:bg-slate-100 text-slate-400'}`}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={`flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar transition-colors ${isDark ? 'bg-transparent' : 'bg-[#FBFBFD]'}`}>
                            {messages.map(m => (
                                <div key={m.id} className={`group flex flex-col ${m.user === "Admin" ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1.5 px-2">
                                        {m.user === "Admin" && <ShieldCheck size={12} className="text-emerald-500" />}
                                        <span className={`text-[10px] font-black uppercase ${m.user === "Admin" ? 'text-emerald-500' : (isDark ? 'text-white/40' : 'text-slate-400')}`}>{m.user}</span>
                                        <span className="text-[9px] opacity-40 italic font-bold">{m.time}</span>
                                    </div>
                                    <div className="relative max-w-[85%]">
                                        <div className={`p-4 rounded-[1.8rem] text-sm font-bold leading-relaxed shadow-sm transition-all ${
                                            m.user === "Admin"
                                                ? 'bg-emerald-500 text-black rounded-tr-none'
                                                : (isDark ? 'bg-white/5 text-white rounded-tl-none border border-white/10' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm')
                                        }`}>
                                            {m.text}
                                        </div>
                                        <div className={`flex gap-1 absolute -bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 ${m.user === "Admin" ? 'right-4' : 'left-4'}`}>
                                            <button onClick={() => copyMessage(m.text)} className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-emerald-500 transition-colors shadow-lg border border-white/10" title="Copy">
                                                <Copy size={14} />
                                            </button>
                                            <button onClick={() => openEditModal(m.id, m.text)} className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-blue-500 transition-colors shadow-lg border border-white/10" title="Edit">
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={() => deleteMessage(m.id)} className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-rose-500 transition-colors shadow-lg border border-white/10" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`p-5 border-t transition-colors ${
                            isDark ? 'bg-[#141417]/80 border-white/5' : 'bg-white border-slate-100'
                        }`}>
                            <div className="flex items-center gap-2 mb-4">
                                <button className={`p-3 rounded-2xl transition-all border group ${isDark ? 'bg-white/5 border-white/5 text-emerald-500 hover:bg-emerald-500/10' : 'bg-slate-50 border-slate-100 text-emerald-600 hover:bg-emerald-50'}`}><Camera size={18} className="group-hover:scale-110 transition-transform" /></button>
                                <button className={`p-3 rounded-2xl transition-all border group ${isDark ? 'bg-white/5 border-white/5 text-emerald-500 hover:bg-emerald-500/10' : 'bg-slate-50 border-slate-100 text-emerald-600 hover:bg-emerald-50'}`}><ImageIcon size={18} className="group-hover:scale-110 transition-transform" /></button>
                                <button className={`p-3 rounded-2xl transition-all border group ${isDark ? 'bg-white/5 border-white/5 text-emerald-500 hover:bg-emerald-500/10' : 'bg-slate-50 border-slate-100 text-emerald-600 hover:bg-emerald-50'}`}><Smile size={18} className="group-hover:scale-110 transition-transform" /></button>
                                <div className={`h-4 w-[1px] mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                                <p className={`text-[9px] font-black uppercase italic ${isDark ? 'text-emerald-500/60' : 'text-emerald-600/70'}`}>Admin Access</p>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    value={chatMsg}
                                    onChange={(e) => setChatMsg(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                                    className={`w-full p-5 pr-14 rounded-3xl outline-none font-bold text-sm border transition-all ${
                                        isDark ? 'bg-white/5 border-white/10 focus:border-emerald-500/40 text-white placeholder:text-white/20' : 'bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400'
                                    }`}
                                    placeholder="Write something public..."
                                />
                                <button onClick={sendChatMessage} className="absolute right-2 p-3 bg-emerald-500 text-black rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- FULL-SCREEN FINGERPRINT ALARM UI --- */}
            {activeAlarm && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

                    <div className="absolute w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />

                    <div className="relative flex flex-col items-center text-center">
                        {/* Fingerprint එක click කළත් alarm එක නතර වේ */}
                        <div className="relative mb-12 group cursor-pointer" onClick={stopAlarm}>
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-all animate-ping" />
                            <div className="w-32 h-32 rounded-full border-2 border-emerald-500/50 flex items-center justify-center bg-black/40 backdrop-blur-md relative overflow-hidden">
                                <Fingerprint size={64} className="text-emerald-500 animate-pulse" />
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-scan-line" />
                            </div>
                        </div>

                        <h2 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">
                            Time to <span className="text-emerald-500">Ready</span> Routines
                        </h2>

                        <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
                            <Zap size={16} className="text-emerald-500" />
                            <p className="text-sm font-black uppercase italic text-emerald-100">
                                {activeAlarm.name} • {activeAlarm.time}
                            </p>
                        </div>

                        {/* මෙම බොත්තම click කළ විට stopAlarm function එක හරහා alarm එක නතර වේ */}
                        <button
                            onClick={stopAlarm}
                            className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                        >
                            Confirm Identity & Stop
                        </button>
                    </div>

                    <style>{`
            @keyframes scan-line {
                0% { top: 0%; opacity: 0; }
                50% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
            .animate-scan-line {
                position: absolute;
                animation: scan-line 2s linear infinite;
            }
        `}</style>
                </div>
            )}


            {/* PRODUCT EDIT/ADD MODAL */}
            {modal.open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className={`relative w-full max-w-md rounded-[3rem] p-10 shadow-2xl border transition-all scale-up-center ${
                        isDark ? 'bg-[#141417] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                        <button onClick={() => setModal({...modal, open: false})} className={`absolute top-8 right-8 transition-opacity hover:opacity-100 ${isDark ? 'text-white/40' : 'text-slate-400'}`}><X size={20}/></button>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-500 rounded-2xl text-black shadow-lg shadow-emerald-500/20">
                                {modal.type === 'add' ? <Plus size={20} strokeWidth={3} /> : <Edit3 size={20} />}
                            </div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tight text-emerald-500">
                                {modal.type === 'add' ? 'New Formula' : 'Update Formula'}
                            </h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Product Name</label>
                                <input
                                    className={`w-full p-5 rounded-2xl outline-none font-bold text-sm border transition-all ${
                                        isDark ? 'bg-white/5 border-white/10 focus:border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-900'
                                    }`}
                                    value={modal.value}
                                    onChange={(e) => setModal({...modal, value: e.target.value})}
                                    placeholder="e.g. Vitamin C Serum"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Step Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                    <input
                                        className={`w-full p-5 pl-14 rounded-2xl outline-none font-bold text-sm border transition-all ${
                                            isDark ? 'bg-white/5 border-white/10 focus:border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-emerald-500 text-slate-900'
                                        }`}
                                        value={modal.stepTime}
                                        onChange={(e) => setModal({...modal, stepTime: e.target.value})}
                                        placeholder="08:00 AM"
                                    />
                                </div>
                            </div>
                            <button onClick={saveProduct} className="w-full p-5 bg-emerald-600 rounded-2xl text-white font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-emerald-900/20 mt-4">
                                {modal.type === 'add' ? 'Add To Timeline' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}