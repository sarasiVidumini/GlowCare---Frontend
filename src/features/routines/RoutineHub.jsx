import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import FallingLeaves from '../../components/ui/FallingLeaves';
import { INITIAL_DB } from './utils/routineData';
import { CONFLICT_RULES } from './utils/conflictRules';
import RoutineHeader from './components/RoutineHeader';
import RoutineSidebar from './components/RoutineSidebar';
import RoutineList from './components/RoutineList';
import SmartEngineModals from './components/SmartEngineModal.jsx';
import CommunityChatModals from './components/CommunityChatModals';
import ExpertConsultModals from './components/ExpertConsultModals';

import { routineService } from './api/routineService.js';

export default function RoutineHub({ isDark }) {
    const { state } = useLocation();

    const activeUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = activeUser?.email === 'admin@glowcare.ai';

    const [db, setDb] = useState(INITIAL_DB);
    const [path, setPath] = useState(state?.path || 'Natural');
    const [part, setPart] = useState(state?.zone ? (state.zone.charAt(0).toUpperCase() + state.zone.slice(1)) : 'Face');
    const [time, setTime] = useState('morning');
    const [done, setDone] = useState(() => JSON.parse(localStorage.getItem('done_tasks')) || {});

    const [modal, setModal] = useState({ open: false, type: 'add', id: null, value: "", stepTime: "" });
    const [notifEnabled, setNotifEnabled] = useState(false);

    // ==========================================
    // --- PRIVATE CHAT & EXPERT STATES ---
    // ==========================================
    const [showExpertsModal, setShowExpertsModal] = useState(false);

    // Core state for Private Chat
    const [privateChat, setPrivateChat] = useState({
        open: false,
        expert: null,
        messages: [],
        userId: activeUser?.id || "GC-73-" + Math.floor(1000 + Math.random() * 9000)
    });

    const [pChatMsg, setPChatMsg] = useState("");

    // State for Editing a Private Message
    const [pEditModal, setPEditModal] = useState({
        open: false,
        id: null,
        text: ""
    });

    // --- Private Chat Handlers ---
    const sendPrivateMessage = () => {
        if (!pChatMsg.trim()) return;
        const newMsg = {
            id: Date.now(),
            text: pChatMsg,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'user'
        };
        setPrivateChat({
            ...privateChat,
            messages: [...privateChat.messages, newMsg]
        });
        setPChatMsg("");
    };

    const deletePrivateMsg = (id) => {
        setPrivateChat({
            ...privateChat,
            messages: privateChat.messages.filter(m => m.id !== id)
        });
    };

    const openPrivateEdit = (id, text) => {
        setPEditModal({ open: true, id, text });
    };

    const savePrivateEdit = () => {
        setPrivateChat({
            ...privateChat,
            messages: privateChat.messages.map(m =>
                m.id === pEditModal.id ? { ...m, text: pEditModal.text } : m
            )
        });
        setPEditModal({ open: false, id: null, text: "" });
    };

    const copyMessage = (text) => {
        navigator.clipboard.writeText(text);
        // Optional: Trigger a toast notification here
    };

    // ==========================================
    // --- DATABASE SYNC LOGIC ---
    // ==========================================

    useEffect(() => {
        fetchDataFromDB();
    }, []);

    const fetchDataFromDB = async () => {
        try {
            const apiData = await routineService.getAllSteps();
            const newDb = JSON.parse(JSON.stringify(INITIAL_DB));

            Object.keys(newDb).forEach(pCat => {
                Object.keys(newDb[pCat]).forEach(zCat => {
                    newDb[pCat][zCat].morning = [];
                    newDb[pCat][zCat].night = [];
                });
            });

            apiData.forEach(item => {
                const category = item.pathCategory || 'Natural';
                const zone = item.zone || 'Face';
                const timeSlot = (item.timeOfDay || 'morning').toLowerCase();

                if (newDb[category] && newDb[category][zone] && newDb[category][zone][timeSlot]) {
                    newDb[category][zone][timeSlot].push({
                        id: item.id,
                        name: item.productName,
                        stepTime: item.scheduledTime
                    });
                }
            });

            setDb(newDb);
        } catch (error) {
            console.error("Failed to load from database, using fallback", error);
        }
    };

    const confirmSave = async (prodName) => {
        const payload = {
            productName: prodName,
            scheduledTime: modal.stepTime || "08:00 AM",
            timeOfDay: time.toUpperCase(),
            pathCategory: path,
            zone: part
        };

        try {
            if (modal.type === 'add') {
                await routineService.createStep(payload);
            } else {
                await routineService.updateStep(modal.id, payload);
            }
            await fetchDataFromDB();
            setModal({ open: false, type: 'add', id: null, value: "", stepTime: "" });
            setConflictData(null);
        } catch (error) {
            alert("Database Error: Could not save formula.");
        }
    };

    const deleteProduct = async (id) => {
        if (!isAdmin) return;
        try {
            await routineService.deleteStep(id);
            await fetchDataFromDB();
        } catch (error) {
            alert("Database Error: Could not delete formula.");
        }
    };

    const handleSeedDatabase = async () => {
        if (!isAdmin) return;
        const confirmSync = window.confirm("Are you sure you want to upload INITIAL_DB to the database?");
        if (!confirmSync) return;

        try {
            for (const pathCat of Object.keys(INITIAL_DB)) {
                for (const zoneCat of Object.keys(INITIAL_DB[pathCat])) {
                    for (const timeSlot of ['morning', 'night']) {
                        const steps = INITIAL_DB[pathCat][zoneCat][timeSlot];
                        for (const product of steps) {
                            await routineService.createStep({
                                productName: product.name,
                                scheduledTime: product.stepTime,
                                timeOfDay: timeSlot.toUpperCase(),
                                pathCategory: pathCat,
                                zone: zoneCat
                            });
                        }
                    }
                }
            }
            alert("Success! Database seeded.");
            await fetchDataFromDB();
        } catch (error) {
            alert("Seeding failed.");
        }
    };

    // ==========================================
    // --- SMART ENGINE & NOTIFICATION LOGIC ---
    // ==========================================

    const [isScanning, setIsScanning] = useState(false);
    const [conflictData, setConflictData] = useState(null);
    const [activeAlarm, setActiveAlarm] = useState(null);
    const [nextRoutine, setNextRoutine] = useState(null);
    const alarmAudio = useRef(new Audio("assets/sounds/alarm-audio.mp3"));

    const handleBellClick = () => {
        if (!notifEnabled) {
            alarmAudio.current.play().then(() => {
                alarmAudio.current.pause();
                alarmAudio.current.currentTime = 0;
                setNotifEnabled(true);
            }).catch(() => setNotifEnabled(true));
        } else {
            setNotifEnabled(false);
        }
    };

    const validateIngredients = async (name) => {
        setIsScanning(true);
        await new Promise(r => setTimeout(r, 1500));
        const currentRoutine = db[path]?.[part]?.[time] || [];
        const conflict = CONFLICT_RULES.find(rule => {
            const hasTrigger = name.toLowerCase().includes(rule.trigger.toLowerCase());
            const hasConflict = currentRoutine.some(p =>
                rule.incompatibleWith.some(inc => p.name.toLowerCase().includes(inc.toLowerCase()))
            );
            return hasTrigger && hasConflict;
        });
        setIsScanning(false);
        return conflict || null;
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

    // ==========================================
    // --- UI STATE HANDLERS ---
    // ==========================================
    const [showChat, setShowChat] = useState(false);

    const toggleDone = (pName) => {
        const key = `${path}-${part}-${time}-${pName}`;
        const newDone = { ...done, [key]: !done[key] };
        setDone(newDone);
        localStorage.setItem('done_tasks', JSON.stringify(newDone));
    };

    const progress = (db[path]?.[part]?.[time] || []).length > 0
        ? Math.round(((db[path][part][time]).filter(item => done[`${path}-${part}-${time}-${item.name}`]).length / (db[path][part][time]).length) * 100)
        : 0;

    return (
        <div className={`min-h-screen p-4 lg:p-6 relative overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />

            {isAdmin && (
                <div className="max-w-[1200px] mx-auto flex justify-end mb-4 relative z-[200]">
                    <button onClick={handleSeedDatabase} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95">
                        Sync INITIAL_DB to Database
                    </button>
                </div>
            )}

            <RoutineHeader isDark={isDark} nextRoutine={nextRoutine} path={path} />

            <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6 relative z-10">
                <RoutineSidebar
                    isDark={isDark}
                    notifEnabled={notifEnabled}
                    handleBellClick={handleBellClick}
                    setShowChat={setShowChat}
                    path={path}
                    setPath={setPath}
                    part={part}
                    setShowExpertsModal={setShowExpertsModal}
                    progress={progress}
                />

                <RoutineList
                    isDark={isDark}
                    time={time}
                    setTime={setTime}
                    isAdmin={isAdmin}
                    setModal={setModal}
                    db={db}
                    path={path}
                    part={part}
                    done={done}
                    toggleDone={toggleDone}
                    deleteProduct={deleteProduct}
                    setPart={setPart}
                />
            </div>

            <SmartEngineModals
                isDark={isDark}
                isScanning={isScanning}
                conflictData={conflictData}
                setConflictData={setConflictData}
                confirmSave={confirmSave}
                modal={modal}
                setModal={setModal}
                saveProduct={saveProduct}
                activeAlarm={activeAlarm}
                setActiveAlarm={setActiveAlarm}
                alarmAudio={alarmAudio}
            />

            {showChat && <CommunityChatModals isDark={isDark} showChat={showChat} setShowChat={setShowChat} activeUser={activeUser} isAdmin={isAdmin} />}

            <ExpertConsultModals
                isDark={isDark}
                showExpertsModal={showExpertsModal}
                setShowExpertsModal={setShowExpertsModal}
                isAdmin={isAdmin}
                privateChat={privateChat}
                setPrivateChat={setPrivateChat}
                pChatMsg={pChatMsg}
                setPChatMsg={setPChatMsg}
                sendPrivateMessage={sendPrivateMessage}
                deletePrivateMsg={deletePrivateMsg}
                openPrivateEdit={openPrivateEdit}
                copyMessage={copyMessage}
                pEditModal={pEditModal}
                setPEditModal={setPEditModal}
                savePrivateEdit={savePrivateEdit}
            />
        </div>
    );
}