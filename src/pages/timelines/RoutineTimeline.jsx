import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Plus, CheckCircle2, Trash2, Edit3, X, Sun, Moon,
    Leaf, Clock, Fingerprint, Activity, MessageSquare, Send, Sparkles, Bell, BellOff,
    Camera, Image as ImageIcon, Smile, User, ShieldCheck, Search, Users, Award, AlertCircle, Zap, Volume2, Copy, ShieldAlert, RefreshCw, Cpu
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

// --- 4.1 SMART INGREDIENT CONFLICT DATABASE ---
const CONFLICT_RULES = [
    {
        trigger: "Retinol",
        incompatibleWith: ["Vitamin C", "Salicylic Acid", "AHA", "BHA", "Glycolic Acid"],
        reason: "Mixing high-concentration acids with retinoids can cause severe skin barrier damage and chronic irritation.",
        alternative: "Sandalwood & Aloe Infusion",
        altType: "Ayurvedic Replacement"
    },
    {
        trigger: "Vitamin C",
        incompatibleWith: ["Copper Peptide", "Benzoyl Peroxide", "Retinol"],
        reason: "These ingredients neutralize each other's effectiveness or cause significant skin flushing.",
        alternative: "Rosehip & Saffron Serum",
        altType: "Natural Bio-Active"
    },
    {
        trigger: "Niacinamide",
        incompatibleWith: ["Vitamin C"],
        reason: "When layered, they can chemically react to form nicotinic acid, causing temporary redness.",
        alternative: "Neem & Turmeric Clarifying Water",
        altType: "Traditional Ayurvedic"
    }
];

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

    // --- SMART ENGINE STATES ---
    const [isScanning, setIsScanning] = useState(false);
    const [conflictData, setConflictData] = useState(null);

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

    const copyMessage = (text) => { navigator.clipboard.writeText(text); };
    const deleteMessage = (id) => { setMessages(prev => prev.filter(m => m.id !== id)); };
    const openEditModal = (id, text) => { setEditModal({ open: true, id, text }); };
    const saveEdit = () => {
        if (!editModal.text.trim()) return;
        setMessages(prev => prev.map(m => m.id === editModal.id ? { ...m, text: editModal.text } : m));
        setEditModal({ open: false, id: null, text: "" });
    };

    // --- EXPERTS STATES ---
    const [showExpertsModal, setShowExpertsModal] = useState(false);
    const [expertSearch, setExpertSearch] = useState("");
    const [experts, setExperts] = useState(() => {
        const savedExperts = JSON.parse(localStorage.getItem('glow_experts')) || [
            { id: 1, name: "Dr. Sandali Perera", role: "Dermatologist", bio: "Skin specialist with 10 years experience." },
            { id: 2, name: "Vaidya Aruna", role: "Ayurvedic Expert", bio: "Specialist in herbal skin treatments." },
            { id: 3, name: "Dr. Nuwan Silva", role: "Cosmetologist", bio: "Expert in chemical routine management." }
        ];
        return savedExperts;
    });

    const [expertEditModal, setExpertEditModal] = useState({ open: false, index: null, name: "", role: "", bio: "" });

    // --- PRIVATE EXPERT CHAT LOGIC ---
    const [privateChat, setPrivateChat] = useState({ open: false, expert: null, messages: [] });
    const [pChatMsg, setPChatMsg] = useState("");
    const [pEditModal, setPEditModal] = useState({ open: false, id: null, text: "" });

    const openPrivateChat = (expert) => { setPrivateChat({ ...privateChat, open: true, expert: expert, messages: [] }); };
    const sendPrivateMessage = () => {
        if (!pChatMsg.trim()) return;
        const newMsg = { id: Date.now(), text: pChatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setPrivateChat(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
        setPChatMsg("");
    };
    const deletePrivateMsg = (id) => { setPrivateChat(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) })); };
    const openPrivateEdit = (id, text) => { setPEditModal({ open: true, id, text }); };
    const savePrivateEdit = () => {
        if (!pEditModal.text.trim()) return;
        setPrivateChat(prev => ({ ...prev, messages: prev.messages.map(m => m.id === pEditModal.id ? { ...m, text: pEditModal.text } : m) }));
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

    // --- 4.1 SMART ENGINE CORE VALIDATION ---
    const validateIngredients = async (name) => {
        setIsScanning(true);
        // Specialized Engine Delay for Professional Feel
        await new Promise(r => setTimeout(r, 1800));

        let conflict = null;
        const currentRoutine = db[path][part][time];

        CONFLICT_RULES.forEach(rule => {
            const hasTrigger = name.toLowerCase().includes(rule.trigger.toLowerCase());
            const hasConflict = currentRoutine.some(p =>
                rule.incompatibleWith.some(inc => p.name.toLowerCase().includes(inc.toLowerCase()))
            );
            if (hasTrigger && hasConflict) conflict = rule;
        });

        setIsScanning(false);
        return conflict;
    };

    const saveProduct = async () => {
        if (!isAdmin) return;

        const conflict = await validateIngredients(modal.value);
        if (conflict) {
            setConflictData({ ...conflict, original: modal.value });
            return;
        }
        confirmSave(modal.value);
    };

    const confirmSave = (prodName) => {
        const newDb = { ...db };
        const newEntry = { name: prodName, stepTime: modal.stepTime || "08:00 AM" };
        if (modal.type === 'add') newDb[path][part][time].push(newEntry);
        else newDb[path][part][time][modal.index] = newEntry;
        setDb(newDb);
        setModal({ open: false, type: 'add', index: null, value: "", stepTime: "" });
        setConflictData(null);
    };

    const deleteProduct = (idx) => { if (!isAdmin) return; const newDb = { ...db }; newDb[path][part][time].splice(idx, 1); setDb(newDb); };

    // --- FIXED EXPERT ACTIONS ---
    const deleteExpert = (idx) => {
        if (!isAdmin) return;
        const newExperts = [...experts];
        newExperts.splice(idx, 1);
        setExperts(newExperts);
    };

    const saveExpertUpdate = () => {
        if (!isAdmin) return;
        const newExperts = [...experts];
        const updatedData = {
            id: expertEditModal.index !== null ? experts[expertEditModal.index].id : Date.now(),
            name: expertEditModal.name,
            role: expertEditModal.role,
            bio: expertEditModal.bio
        };

        if (expertEditModal.index !== null) {
            newExperts[expertEditModal.index] = updatedData;
        } else {
            newExperts.push(updatedData);
        }
        setExperts(newExperts);
        setExpertEditModal({ open: false, index: null, name: "", role: "", bio: "" });
    };

    const filteredExperts = experts.filter(exp =>
        exp.name.toLowerCase().includes(expertSearch.toLowerCase()) ||
        exp.role.toLowerCase().includes(expertSearch.toLowerCase())
    );

    const progress = (db[path][part][time] || []).length > 0 ? Math.round(((db[path][part][time] || []).filter(item => done[`${path}-${part}-${time}-${item.name}`]).length / (db[path][part][time] || []).length) * 100) : 0;

    return (
        <div className={`min-h-screen p-4 lg:p-6 relative overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />

            {/* --- NOTIFICATION BAR --- */}
            <div className="max-w-[1200px] mx-auto mb-8 relative z-[100]">
                <div className={`group flex flex-col md:flex-row items-center justify-between p-1 rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 hover:scale-[1.01] ${isDark ? 'bg-white/5 border-white/10 shadow-2xl shadow-emerald-500/10' : 'bg-white/80 border-slate-200 shadow-xl shadow-slate-200/50'}`}>
                    <div className="flex items-center gap-4 p-3 pl-6">
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                                <Zap className="text-emerald-500 animate-pulse" size={20} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#050505] animate-bounce" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-tighter text-emerald-500">Live Routine Feed</h4>
                            <p className="text-sm font-black italic uppercase leading-none">
                                {nextRoutine ? `Next: ${nextRoutine.name}` : "No more tasks today"}
                                <span className="ml-2 text-[9px] opacity-40 lowercase font-medium">at {nextRoutine?.stepTime || '--'}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pr-2 pb-2 md:pb-0">
                        {nextRoutine && (
                            <div className={`px-5 py-3 rounded-2xl flex items-center gap-3 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                                <Clock size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase italic">Starts in {Math.floor(nextRoutine.diff / 60000)}m</span>
                            </div>
                        )}
                        <div className="px-6 py-3 bg-emerald-500 rounded-2xl text-black flex items-center gap-3">
                            <div className="w-2 h-2 bg-black rounded-full animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{path} Path</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6 relative z-10">
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className={`rounded-[2.5rem] p-8 backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#0F0F12]/80' : 'bg-white shadow-xl shadow-slate-200/50'}`}>
                        <div className="flex gap-3 mb-10">
                            <div className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-emerald-500 text-black' : 'bg-slate-900 text-white'}`}><Fingerprint size={20} /></div>
                            <button onClick={handleBellClick} className={`p-2 rounded-xl transition-all ${notifEnabled ? 'bg-emerald-500/20 text-emerald-500' : 'bg-black/5 text-slate-500'}`}>
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

                <div className={`col-span-12 lg:col-span-8 rounded-[2.5rem] p-8 backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#0F0F12]/80' : 'bg-white shadow-xl'}`}>
                    <header className="flex justify-between items-center mb-10">
                        <div className={`flex p-1 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                            {['morning', 'night'].map(t => (
                                <button key={t} onClick={() => setTime(t)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${time === t ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>{t}</button>
                            ))}
                        </div>
                        {isAdmin && (
                            <button onClick={() => setModal({ open: true, type: 'add', index: null, value: "", stepTime: "" })} className="flex items-center gap-2 p-3 bg-emerald-600 rounded-xl text-white px-5 font-black uppercase text-[10px] active:scale-95 transition-all shadow-lg shadow-emerald-900/20">
                                <Plus size={14} strokeWidth={3} /> ADD FORMULA
                            </button>
                        )}
                    </header>
                    <div className="space-y-4">
                        {(db[path][part][time] || []).map((product, idx) => (
                            <div key={idx} className={`group flex items-center justify-between p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-[#FBFBFD] border-slate-100 hover:shadow-lg'}`}>
                                <div className="flex items-center gap-6">
                                    <button onClick={() => toggleDone(product.name)} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${done[`${path}-${part}-${time}-${product.name}`] ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-300'}`}><CheckCircle2 size={20} /></button>
                                    <div><span className={`text-xl font-black italic uppercase transition-all ${done[`${path}-${part}-${time}-${product.name}`] ? 'opacity-30 line-through' : ''}`}>{product.name}</span><p className="text-[11px] text-emerald-500 font-bold uppercase italic">{product.stepTime}</p></div>
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

            {/* --- 4.1 ENGINE SCANNING OVERLAY - ULTRA SMART --- */}
            {isScanning && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 backdrop-blur-3xl transition-all duration-700">
                    <div className="relative flex flex-col items-center">
                        <div className="relative w-48 h-48 mb-10">
                            {/* Outer Rings */}
                            <div className="absolute inset-0 border-[1px] border-emerald-500/20 rounded-full scale-110"></div>
                            <div className="absolute inset-0 border-[1px] border-emerald-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>

                            {/* Scanning Beam Animation */}
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
                    <style>{`
                        @keyframes scanBeam {
                            0% { top: -10%; }
                            50% { top: 110%; }
                            100% { top: -10%; }
                        }
                    `}</style>
                </div>
            )}

            {/* --- 4.1 SMOOTHIE GLASS CONFLICT ALERT --- */}
            {conflictData && (
                <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-500">
                    <div className={`relative w-full max-w-md rounded-[2.5rem] p-8 border backdrop-blur-2xl transition-all duration-500 overflow-hidden 
            ${isDark
                        ? 'bg-[#0D0D0F]/70 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]'
                        : 'bg-white/70 border-white/40 shadow-2xl shadow-slate-200/50'}`}>

                        {/* Soft Ambient Glows behind the glass */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 blur-[60px] rounded-full"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full"></div>

                        <div className="flex flex-col items-center text-center mb-6 relative z-10">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border backdrop-blur-xl
                    ${isDark ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' : 'bg-rose-500/10 border-rose-200 text-rose-600'}`}>
                                <ShieldAlert size={32} />
                            </div>
                            <h4 className={`text-2xl font-black italic uppercase leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Safety <span className="text-rose-500">Alert.</span>
                            </h4>
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em]">Compatibility Warning</p>
                        </div>

                        {/* Risk Box with Frosted Effect */}
                        <div className={`p-5 rounded-2xl mb-5 border backdrop-blur-xl transition-colors 
                ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-900/5 border-white/60 text-slate-800'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={14} className="text-rose-500" />
                                <span className="text-[10px] font-black uppercase italic tracking-widest opacity-60">The Risk</span>
                            </div>
                            <p className="text-xs font-bold leading-relaxed italic">
                                "{conflictData.reason}"
                            </p>
                        </div>

                        {/* Recommendation Box - Smoothie Green Tint */}
                        <div className="relative group p-5 rounded-2xl border transition-all overflow-hidden backdrop-blur-xl
                bg-emerald-500/5 border-emerald-500/20 mb-6">
                            <div className="absolute -right-2 -bottom-2 text-emerald-500/10 group-hover:scale-110 transition-transform">
                                <Sparkles size={60} />
                            </div>
                            <div className="flex justify-between items-center relative z-10">
                                <div>
                                    <div className="px-2 py-0.5 bg-emerald-500/20 rounded text-[7px] font-black text-emerald-500 uppercase tracking-widest mb-1 w-fit">Recommended</div>
                                    <h5 className={`text-xl font-black italic uppercase leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{conflictData.alternative}</h5>
                                    <p className="text-[9px] text-emerald-500/80 font-bold uppercase mt-1 tracking-tight">{conflictData.altType}</p>
                                </div>
                                <button onClick={() => confirmSave(conflictData.alternative)}
                                        className="p-4 bg-emerald-500 rounded-xl text-black hover:scale-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                                    <RefreshCw size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 relative z-10">
                            <button onClick={() => setConflictData(null)}
                                    className={`flex-1 py-4 rounded-xl uppercase font-black text-[10px] tracking-widest transition-all backdrop-blur-xl
                    ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' : 'bg-white/50 text-slate-900 hover:bg-white/80 border border-white/60'}`}>
                                Back
                            </button>
                            <button onClick={() => confirmSave(conflictData.original)}
                                    className="flex-1 py-4 bg-rose-600 text-white rounded-xl uppercase font-black text-[10px] tracking-widest hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/30 transition-all">
                                Ignore
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EXPERTS MODAL --- */}
            {showExpertsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[2000] flex items-center justify-center p-4">
                    <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] border flex flex-col transition-all duration-500 ${isDark ? 'bg-[#0F0F12]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-2xl'}`}>
                        <div className="p-8 pb-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-black italic uppercase text-emerald-500">Expert Panel.</h2>
                                <div className="flex gap-3">
                                    {isAdmin && (
                                        <button onClick={() => setExpertEditModal({ open: true, index: null, name: "", role: "", bio: "" })} className="p-3 bg-emerald-500 rounded-xl text-black font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20">Add Expert</button>
                                    )}
                                    <button onClick={() => setShowExpertsModal(false)} className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-500'}`}><X /></button>
                                </div>
                            </div>

                            {/* --- EXPERT SEARCH BAR --- */}
                            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border mb-4 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                <Search size={18} className="text-emerald-500" />
                                <input
                                    type="text"
                                    placeholder="Search by name or role..."
                                    className="bg-transparent outline-none w-full text-sm font-bold"
                                    value={expertSearch}
                                    onChange={(e) => setExpertSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 no-scrollbar">
                            {filteredExperts.map((exp, idx) => {
                                // Find real index in original array for delete/edit
                                const realIdx = experts.findIndex(e => e.id === exp.id);
                                return (
                                    <div key={exp.id} className={`group relative p-6 rounded-3xl border transition-all ${isDark ? 'bg-white/[0.03] border-white/5 hover:border-emerald-500/30' : 'bg-slate-50 border-slate-100 hover:shadow-xl'}`}>
                                        {isAdmin && (
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => setExpertEditModal({ open: true, index: realIdx, name: exp.name, role: exp.role, bio: exp.bio })} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500"><Edit3 size={12}/></button>
                                                <button onClick={() => deleteExpert(realIdx)} className="p-2 rounded-lg bg-rose-500/20 text-rose-500"><Trash2 size={12}/></button>
                                            </div>
                                        )}
                                        <h4 className="text-lg font-black italic uppercase">{exp.name}</h4>
                                        <p className="text-emerald-500 text-[9px] font-black uppercase tracking-widest mb-3">{exp.role}</p>
                                        <p className="text-[11px] opacity-60 leading-relaxed mb-5 line-clamp-2">{exp.bio}</p>
                                        <button
                                            onClick={() => openPrivateChat(exp)}
                                            className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-black uppercase text-[9px] tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                                        >
                                            Message Expert
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* --- EXPERT EDIT MODAL --- */}
            {expertEditModal.open && (
                <div className="fixed inset-0 bg-black/90 z-[4000] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#141417] border-white/10' : 'bg-white shadow-2xl'}`}>
                        <h4 className="text-xl font-black italic uppercase mb-6 text-emerald-500 text-center">{expertEditModal.index !== null ? 'Edit Expert' : 'New Expert'}</h4>
                        <div className="space-y-4">
                            <input value={expertEditModal.name} onChange={(e) => setExpertEditModal({...expertEditModal, name: e.target.value})} placeholder="Expert Name" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                            <input value={expertEditModal.role} onChange={(e) => setExpertEditModal({...expertEditModal, role: e.target.value})} placeholder="Specialty" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                            <textarea value={expertEditModal.bio} onChange={(e) => setExpertEditModal({...expertEditModal, bio: e.target.value})} placeholder="Expert Bio" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold h-24 outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setExpertEditModal({open: false, index: null, name: "", role: "", bio: ""})} className="flex-1 p-4 rounded-2xl bg-white/5 text-xs font-black uppercase">Cancel</button>
                            <button onClick={saveExpertUpdate} className="flex-1 p-4 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PRIVATE CHAT MODAL --- */}
            {privateChat.open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
                    <div className={`w-full max-w-lg h-[75vh] rounded-[2.5rem] overflow-hidden flex flex-col border transition-all duration-500 ${isDark ? 'bg-[#0D0D0F]/95 border-white/10' : 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'}`}>

                        {/* Header */}
                        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <User size={20} className="text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-black italic uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{privateChat.expert?.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Secure Consultation</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setPrivateChat({ ...privateChat, open: false })}
                                    className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Private Messages List */}
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
                                        {/* Message Bubble */}
                                        <div className={`p-4 rounded-[1.5rem] rounded-tr-none shadow-sm ${isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white'}`}>
                                            <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                            <span className="text-[8px] opacity-70 mt-1.5 block text-right font-black uppercase">{msg.time}</span>
                                        </div>

                                        {/* Floating Actions - Dark/Light Aware */}
                                        <div className="absolute top-0 -left-12 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 origin-right">
                                            <button onClick={() => copyMessage(msg.text)}
                                                    className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-white/10 text-white hover:bg-emerald-500' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-500 hover:text-white'}`}>
                                                <Copy size={12}/>
                                            </button>
                                            <button onClick={() => openPrivateEdit(msg.id, msg.text)}
                                                    className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-white/10 text-white hover:bg-emerald-500' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-500 hover:text-white'}`}>
                                                <Edit3 size={12}/>
                                            </button>
                                            <button onClick={() => deletePrivateMsg(msg.id)}
                                                    className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-white border border-slate-200 text-rose-500 hover:bg-rose-500 hover:text-white'}`}>
                                                <Trash2 size={12}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Private Input Area */}
                        <div className={`p-6 border-t backdrop-blur-md ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-white'}`}>
                            <div className="flex gap-2 relative">
                                <input
                                    value={pChatMsg}
                                    onChange={(e) => setPChatMsg(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendPrivateMessage()}
                                    placeholder="Type your message..."
                                    className={`flex-1 p-4 pr-12 rounded-2xl outline-none text-sm font-bold transition-all border ${
                                        isDark
                                            ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50'
                                            : 'bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500/30 text-slate-900'
                                    }`}
                                />
                                <button onClick={sendPrivateMessage}
                                        className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PRIVATE MESSAGE EDIT MODAL --- */}
            {pEditModal.open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[5000] flex items-center justify-center p-4">
                    <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-[#141417] border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'}`}>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <Edit3 size={16} className="text-emerald-500" />
                            </div>
                            <h4 className={`text-sm font-black italic uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Refine Message</h4>
                        </div>

                        <textarea
                            value={pEditModal.text}
                            onChange={(e) => setPEditModal({...pEditModal, text: e.target.value})}
                            className={`w-full p-5 rounded-2xl border bg-transparent text-sm font-bold h-32 outline-none mb-6 resize-none transition-all ${
                                isDark
                                    ? 'border-white/10 text-white focus:border-emerald-500'
                                    : 'border-slate-200 text-slate-900 focus:border-emerald-500'
                            }`}
                        />

                        <div className="flex gap-3">
                            <button onClick={() => setPEditModal({open: false, id: null, text: ""})}
                                    className={`flex-1 p-4 rounded-xl text-[10px] font-black uppercase transition-all ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                Cancel
                            </button>
                            <button onClick={savePrivateEdit}
                                    className="flex-1 p-4 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PUBLIC CHAT FEED MODAL --- */}
            {showChat && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[3000] flex items-center justify-center p-4">
                    <div className={`w-full max-w-lg h-[80vh] rounded-[3rem] overflow-hidden flex flex-col border transition-all duration-500 ${isDark ? 'bg-[#0D0D0F]/95 border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>

                        {/* Header */}
                        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
                            <h3 className={`text-xl font-black italic uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                GlowCare <span className="text-emerald-500">Feed.</span>
                            </h3>
                            <button onClick={() => setShowChat(false)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages List */}
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
                                                isMe
                                                    ? 'bg-emerald-600 text-white rounded-tr-none'
                                                    : (isDark ? 'bg-white/10 text-white rounded-tl-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none')
                                            }`}>
                                                <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                                <span className="text-[8px] opacity-60 mt-2 block text-right font-black italic">{msg.time}</span>
                                            </div>

                                            {/* Floating Actions */}
                                            <div className={`absolute top-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 ${isMe ? '-left-14 flex-col items-end' : '-right-14 flex-col items-start'}`}>
                                                <button onClick={() => copyMessage(msg.text)}
                                                        className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-white/10 text-white hover:bg-emerald-500' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-500 hover:text-white'}`}>
                                                    <Copy size={12}/>
                                                </button>
                                                <button onClick={() => openEditModal(msg.id, msg.text)}
                                                        className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-white/10 text-white hover:bg-emerald-500' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-500 hover:text-white'}`}>
                                                    <Edit3 size={12}/>
                                                </button>
                                                <button onClick={() => deleteMessage(msg.id)}
                                                        className={`p-2 rounded-lg backdrop-blur-md transition-all ${isDark ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-white border border-slate-200 text-rose-500 hover:bg-rose-500 hover:text-white'}`}>
                                                    <Trash2 size={12}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <div className={`p-6 border-t backdrop-blur-md ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-white'}`}>
                            <div className="flex gap-2">
                                <input
                                    value={chatMsg}
                                    onChange={(e) => setChatMsg(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                    placeholder="Share your progress..."
                                    className={`flex-1 p-4 rounded-2xl outline-none text-sm font-bold transition-all border ${
                                        isDark
                                            ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50'
                                            : 'bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500/30 text-slate-900'
                                    }`}
                                />
                                <button onClick={sendChatMessage}
                                        className="p-4 bg-emerald-500 text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
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
                            className={`w-full p-5 rounded-2xl border bg-transparent text-sm font-bold h-32 outline-none mb-6 resize-none transition-all ${
                                isDark
                                    ? 'border-white/10 text-white focus:border-emerald-500'
                                    : 'border-slate-200 text-slate-900 focus:border-emerald-500'
                            }`}
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setEditModal({open: false, id: null, text: ""})}
                                    className={`flex-1 p-4 rounded-xl text-[10px] font-black uppercase transition-all ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                Cancel
                            </button>
                            <button onClick={saveEdit}
                                    className="flex-1 p-4 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Routine Add/Edit Modal */}
            {modal.open && (
                <div className="fixed inset-0 bg-black/90 z-[4000] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className={`w-full max-w-sm p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#141417] border-white/10' : 'bg-white shadow-2xl'}`}>
                        <h4 className="text-xl font-black italic uppercase mb-6 text-emerald-500 text-center">{modal.type === 'add' ? 'New Formula' : 'Edit Formula'}</h4>
                        <div className="space-y-4">
                            <input value={modal.value} onChange={(e) => setModal({...modal, value: e.target.value})} placeholder="Product Name" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                            <input value={modal.stepTime} onChange={(e) => setModal({...modal, stepTime: e.target.value})} placeholder="Time (e.g. 08:00 AM)" className={`w-full p-4 rounded-xl border bg-transparent text-sm font-bold outline-none ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setModal({open: false, type: 'add', index: null, value: "", stepTime: ""})} className="flex-1 p-4 rounded-2xl bg-white/5 text-xs font-black uppercase">Cancel</button>
                            <button onClick={saveProduct} className="flex-1 p-4 bg-emerald-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alarm Display */}
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
        </div>
    );
}