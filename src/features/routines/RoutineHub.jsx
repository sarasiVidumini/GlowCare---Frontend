import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import FallingLeaves from '../../components/ui/FallingLeaves';
import { INITIAL_DB } from './utils/routineData';
import RoutineHeader from './components/RoutineHeader';
import RoutineSidebar from './components/RoutineSidebar';
import RoutineList from './components/RoutineList';
import SmartEngineModals from './components/SmartEngineModal.jsx';
import CommunityChatModals from './components/CommunityChatModals';
import ExpertConsultModals from './components/ExpertConsultModals';
import RoutineAlarmOverlay from './components/RoutineAlarmOverlay';

import { routineService } from './api/routineService.js';

export default function RoutineHub({ isDark }) {
    const { state } = useLocation();

    const activeUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('activeUser'));
    const isAdmin = activeUser?.email === 'admin@glowcare.ai';

    const [db, setDb] = useState(INITIAL_DB);
    const [path, setPath] = useState(state?.path || 'Natural');
    const [part, setPart] = useState(state?.zone ? (state.zone.charAt(0).toUpperCase() + state.zone.slice(1)) : 'Face');
    const [time, setTime] = useState('morning');
    const [done, setDone] = useState(() => JSON.parse(localStorage.getItem('done_tasks')) || {});
    const [modal, setModal] = useState({ open: false, type: 'add', id: null, value: "", stepTime: "" });
    const [notifEnabled, setNotifEnabled] = useState(false);

    const [allRoutines, setAllRoutines] = useState([]);
    const [nextRoutine, setNextRoutine] = useState(null);

    const [showExpertsModal, setShowExpertsModal] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [privateChat, setPrivateChat] = useState({ open: false, expert: null });

    const [isScanning, setIsScanning] = useState(false);
    const [conflictData, setConflictData] = useState(null);

    // ==========================================
    // 🧠 THE GLOBAL TIME ENGINE
    // ==========================================
    useEffect(() => {
        if (!allRoutines || allRoutines.length === 0) {
            setNextRoutine(null);
            return;
        }

        const now = new Date();
        let upcoming = [];

        allRoutines.forEach(step => {
            if (step.scheduledTime) {
                try {
                    const timeString = step.scheduledTime.trim();
                    const ampmMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
                    const militaryMatch = timeString.match(/(\d+):(\d+)/);

                    let hours = 0; let mins = 0;

                    if (ampmMatch) {
                        hours = parseInt(ampmMatch[1]);
                        mins = parseInt(ampmMatch[2]);
                        const period = ampmMatch[3].toUpperCase();
                        if (period === 'PM' && hours < 12) hours += 12;
                        if (period === 'AM' && hours === 12) hours = 0;
                    } else if (militaryMatch) {
                        hours = parseInt(militaryMatch[1]);
                        mins = parseInt(militaryMatch[2]);
                    } else {
                        return;
                    }

                    let stepDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, mins, 0, 0);

                    if (stepDate.getTime() <= now.getTime()) {
                        stepDate.setDate(stepDate.getDate() + 1);
                    }

                    upcoming.push({
                        ...step,
                        name: step.productName,
                        stepTime: step.scheduledTime,
                        path: step.pathCategory,
                        dateObj: stepDate
                    });
                } catch (err) {
                    console.warn("⚠️ Skipping invalid time in DB:", step.scheduledTime);
                }
            }
        });

        upcoming.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        setNextRoutine(upcoming.length > 0 ? upcoming[0] : null);
    }, [allRoutines]);

    // ==========================================
    // DATABASE FETCH & SYNC
    // ==========================================
    const fetchDataFromDB = useCallback(async () => {
        try {
            const apiData = await routineService.getAllSteps();
            setAllRoutines(apiData);

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
            console.error("Failed to load from database", error);
        }
    }, []);

    useEffect(() => { fetchDataFromDB(); }, [fetchDataFromDB]);

    // ==========================================
    // ACTUAL DATABASE SAVE FUNCTION
    // ==========================================
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
            alert("Database Error.");
        }
    };

    // ==========================================
    // 🧠 AI SMART ENGINE INTEGRATION
    // ==========================================
    const saveProduct = async () => {
        if (!isAdmin || isScanning) return;

        setIsScanning(true);

        try {
            const result = await routineService.checkConflict(
                modal.value,
                time.toUpperCase(),
                path,
                part
            );

            setIsScanning(false);

            // ALWAYS pass the data to the modal state so the Admin is forced to review the feedback
            // This prevents immediate auto-saving and shows the Approval modal instead.
            setConflictData({
                original: result.original,
                reason: result.reason || "This formula combination has been analyzed and appears safe to use.",
                alternative: result.alternative,
                hasConflict: result.hasConflict
            });

        } catch (error) {
            setIsScanning(false);
            console.error("Scanning failed", error);
            if(window.confirm("Smart Engine is currently offline. Save formula without safety check?")) {
                confirmSave(modal.value);
            }
        }
    };

    const deleteProduct = async (id) => {
        if (!isAdmin) return;
        try {
            await routineService.deleteStep(id);
            await fetchDataFromDB();
        } catch (error) { alert("Database Error."); }
    };

    const toggleDone = (pName) => {
        const key = `${path}-${part}-${time}-${pName}`;
        const newDone = { ...done, [key]: !done[key] };
        setDone(newDone);
        localStorage.setItem('done_tasks', JSON.stringify(newDone));
    };

    const handleBellClick = () => {
        setNotifEnabled(!notifEnabled);
        if (!notifEnabled && "Notification" in window) Notification.requestPermission();
    };

    const progress = (db[path]?.[part]?.[time] || []).length > 0
        ? Math.round(((db[path][part][time]).filter(item => done[`${path}-${part}-${time}-${item.name}`]).length / (db[path][part][time]).length) * 100)
        : 0;

    return (
        <div className={`min-h-screen p-4 lg:p-6 pt-12 relative overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>
            <RoutineAlarmOverlay isDark={isDark} nextRoutine={nextRoutine} />
            <FallingLeaves isDark={isDark} />
            <RoutineHeader isDark={isDark} nextRoutine={nextRoutine} path={path} />

            <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6 relative z-10">
                <RoutineSidebar isDark={isDark} notifEnabled={notifEnabled} handleBellClick={handleBellClick} setShowChat={setShowChat} path={path} setPath={setPath} part={part} setShowExpertsModal={setShowExpertsModal} progress={progress} />
                <RoutineList isDark={isDark} time={time} setTime={setTime} isAdmin={isAdmin} setModal={setModal} db={db} path={path} part={part} done={done} toggleDone={toggleDone} deleteProduct={deleteProduct} setPart={setPart} />
            </div>

            <SmartEngineModals isDark={isDark} isScanning={isScanning} conflictData={conflictData} setConflictData={setConflictData} confirmSave={confirmSave} modal={modal} setModal={setModal} saveProduct={saveProduct} />
            <ExpertConsultModals isDark={isDark} showExpertsModal={showExpertsModal} setShowExpertsModal={setShowExpertsModal} isAdmin={isAdmin} privateChat={privateChat} setPrivateChat={setPrivateChat} />
            <CommunityChatModals isDark={isDark} showChat={showChat} setShowChat={setShowChat} activeUser={activeUser} isAdmin={isAdmin} />
        </div>
    );
}