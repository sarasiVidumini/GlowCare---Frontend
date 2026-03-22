import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Import our new separated files
import FallingLeaves from '../../components/ui/FallingLeaves';
import { INITIAL_DB, CONFLICT_RULES } from './utils/routineData';
import RoutineHeader from './components/RoutineHeader';
import RoutineSidebar from './components/RoutineSidebar';
import RoutineList from './components/RoutineList';
import SmartEngineModals from './components/SmartEngineModal.jsx'; // Fixed extension typo
import CommunityChatModals from './components/CommunityChatModals';
import ExpertConsultModals from './components/ExpertConsultModals';

export default function RoutineHub({ isDark }) {
    const { state } = useLocation();

    // --- ADMIN CHECK ---
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    const isAdmin = activeUser?.email === 'admin@glowcare.ai';

    const [db, setDb] = useState(() => JSON.parse(localStorage.getItem('skin_db_v6')) || INITIAL_DB);
    const [path, setPath] = useState(state?.path || 'Natural');
    const [part, setPart] = useState(state?.zone ? (state.zone.charAt(0).toUpperCase() + state.zone.slice(1)) : 'Face');
    const [time, setTime] = useState('morning');
    const [done, setDone] = useState(() => JSON.parse(localStorage.getItem('done_tasks')) || {});
    const [modal, setModal] = useState({ open: false, type: 'add', index: null, value: "", stepTime: "" });
    const [notifEnabled, setNotifEnabled] = useState(false);

    // --- SMART ENGINE STATES ---
    const [isScanning, setIsScanning] = useState(false);
    const [conflictData, setConflictData] = useState(null);

    // --- ALARM STATES ---
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
        const newMessage = { id: Date.now(), user: isAdmin ? "Admin" : (activeUser?.name || "GlowUser"), text: chatMsg, isAdmin: isAdmin, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
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
    const [experts, setExperts] = useState(() => JSON.parse(localStorage.getItem('glow_experts')) || [
        { id: 1, name: "Dr. Sandali Perera", role: "Dermatologist", bio: "Skin specialist with 10 years experience." },
        { id: 2, name: "Vaidya Aruna", role: "Ayurvedic Expert", bio: "Specialist in herbal skin treatments." },
        { id: 3, name: "Dr. Nuwan Silva", role: "Cosmetologist", bio: "Expert in chemical routine management." }
    ]);
    const [expertEditModal, setExpertEditModal] = useState({ open: false, index: null, name: "", role: "", bio: "" });

    // --- PRIVATE CHAT STATES ---
    const [privateChat, setPrivateChat] = useState({ open: false, expert: null, messages: [] });
    const [pChatMsg, setPChatMsg] = useState("");
    const [pEditModal, setPEditModal] = useState({ open: false, id: null, text: "" });

    const openPrivateChat = (expert) => { setPrivateChat({ ...privateChat, open: true, expert: expert, messages: [] }); };
    const sendPrivateMessage = () => {
        if (!pChatMsg.trim()) return;
        setPrivateChat(prev => ({ ...prev, messages: [...prev.messages, { id: Date.now(), text: pChatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] }));
        setPChatMsg("");
    };
    const deletePrivateMsg = (id) => { setPrivateChat(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) })); };
    const openPrivateEdit = (id, text) => { setPEditModal({ open: true, id, text }); };
    const savePrivateEdit = () => {
        if (!pEditModal.text.trim()) return;
        setPrivateChat(prev => ({ ...prev, messages: prev.messages.map(m => m.id === pEditModal.id ? { ...m, text: pEditModal.text } : m) }));
        setPEditModal({ open: false, id: null, text: "" });
    };

    // --- EFFECT HOOKS & TIMERS ---
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

    // --- DATA MUTATIONS & ENGINE ---
    const validateIngredients = async (name) => {
        setIsScanning(true);
        await new Promise(r => setTimeout(r, 1800));
        let conflict = null;
        const currentRoutine = db[path][part][time];
        CONFLICT_RULES.forEach(rule => {
            const hasTrigger = name.toLowerCase().includes(rule.trigger.toLowerCase());
            const hasConflict = currentRoutine.some(p => rule.incompatibleWith.some(inc => p.name.toLowerCase().includes(inc.toLowerCase())));
            if (hasTrigger && hasConflict) conflict = rule;
        });
        setIsScanning(false);
        return conflict;
    };

    const saveProduct = async () => {
        if (!isAdmin) return;
        const conflict = await validateIngredients(modal.value);
        if (conflict) { setConflictData({ ...conflict, original: modal.value }); return; }
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
    const toggleDone = (pName) => setDone(p => ({ ...p, [`${path}-${part}-${time}-${pName}`]: !p[`${path}-${part}-${time}-${pName}`] }));
    const progress = (db[path][part][time] || []).length > 0 ? Math.round(((db[path][part][time] || []).filter(item => done[`${path}-${part}-${time}-${item.name}`]).length / (db[path][part][time] || []).length) * 100) : 0;

    // Fixed Expert Search Logic
    const deleteExpert = (idx) => { if (!isAdmin) return; const newExperts = [...experts]; newExperts.splice(idx, 1); setExperts(newExperts); };
    const saveExpertUpdate = () => {
        if (!isAdmin) return;
        const newExperts = [...experts];
        const updatedData = { id: expertEditModal.index !== null ? experts[expertEditModal.index].id : Date.now(), name: expertEditModal.name, role: expertEditModal.role, bio: expertEditModal.bio };
        if (expertEditModal.index !== null) newExperts[expertEditModal.index] = updatedData; else newExperts.push(updatedData);
        setExperts(newExperts);
        setExpertEditModal({ open: false, index: null, name: "", role: "", bio: "" });
    };
    const filteredExperts = experts.filter(exp => exp.name.toLowerCase().includes(expertSearch.toLowerCase()) || exp.role.toLowerCase().includes(expertSearch.toLowerCase()));

    return (
        <div className={`min-h-screen p-4 lg:p-6 relative overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />

            <RoutineHeader isDark={isDark} nextRoutine={nextRoutine} path={path} />

            <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6 relative z-10">
                <RoutineSidebar
                    isDark={isDark} notifEnabled={notifEnabled} handleBellClick={handleBellClick}
                    setShowChat={setShowChat} path={path} setPath={setPath} part={part}
                    setShowExpertsModal={setShowExpertsModal} progress={progress}
                />

                <RoutineList
                    isDark={isDark} time={time} setTime={setTime} isAdmin={isAdmin} setModal={setModal}
                    db={db} path={path} part={part} done={done} toggleDone={toggleDone}
                    deleteProduct={deleteProduct} setPart={setPart}
                />
            </div>

            <SmartEngineModals
                isDark={isDark} isScanning={isScanning} conflictData={conflictData} setConflictData={setConflictData}
                confirmSave={confirmSave} modal={modal} setModal={setModal} saveProduct={saveProduct}
                activeAlarm={activeAlarm} setActiveAlarm={setActiveAlarm} alarmAudio={alarmAudio}
            />

            <CommunityChatModals
                isDark={isDark} showChat={showChat} setShowChat={setShowChat} messages={messages}
                chatMsg={chatMsg} setChatMsg={setChatMsg} sendChatMessage={sendChatMessage}
                activeUser={activeUser} isAdmin={isAdmin} copyMessage={copyMessage}
                openEditModal={openEditModal} deleteMessage={deleteMessage} editModal={editModal}
                setEditModal={setEditModal} saveEdit={saveEdit}
            />

            <ExpertConsultModals
                isDark={isDark} showExpertsModal={showExpertsModal} setShowExpertsModal={setShowExpertsModal}
                isAdmin={isAdmin} setExpertEditModal={setExpertEditModal} expertSearch={expertSearch}
                setExpertSearch={setExpertSearch} filteredExperts={filteredExperts} experts={experts}
                openPrivateChat={openPrivateChat} deleteExpert={deleteExpert} expertEditModal={expertEditModal}
                saveExpertUpdate={saveExpertUpdate} privateChat={privateChat} setPrivateChat={setPrivateChat}
                pChatMsg={pChatMsg} setPChatMsg={setPChatMsg} sendPrivateMessage={sendPrivateMessage}
                copyMessage={copyMessage} openPrivateEdit={openPrivateEdit} deletePrivateMsg={deletePrivateMsg}
                pEditModal={pEditModal} setPEditModal={setPEditModal} savePrivateEdit={savePrivateEdit}
            />
        </div>
    );
}