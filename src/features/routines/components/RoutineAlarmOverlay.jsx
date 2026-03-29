import React, { useState, useEffect, useRef } from 'react';
import { BellRing, CheckCircle2, VolumeX } from 'lucide-react';

export default function RoutineAlarmOverlay({ isDark, nextRoutine }) {
    const [activeAlarm, setActiveAlarm] = useState(null);
    const [audioBlocked, setAudioBlocked] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=classic-alarm-995.mp3");
        audioRef.current.loop = true;
    }, []);

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // 🚀 THE PRECISION REAL-TIME TRIGGER
    useEffect(() => {
        if (!nextRoutine || !nextRoutine.dateObj) return;

        const now = new Date();
        const timeUntilNext = nextRoutine.dateObj.getTime() - now.getTime();

        if (timeUntilNext > 0) {
            console.log(`⏰ [ALARM ARMED]: Firing in ${(timeUntilNext / 60000).toFixed(2)} mins for ${nextRoutine.name}.`);

            const timer = setTimeout(() => {
                triggerAlarm({
                    title: nextRoutine.name,
                    time: nextRoutine.stepTime,
                    type: `${nextRoutine.path || 'ROUTINE'} PATH`,
                    message: "Time To Routine!"
                });
            }, timeUntilNext);

            // Resets if database updates
            return () => clearTimeout(timer);
        }
    }, [nextRoutine]);

    const triggerAlarm = (routineData) => {
        setActiveAlarm(routineData);
        setAudioBlocked(false);

        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    setAudioBlocked(true);
                });
            }
        }

        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("GlowCare: Routine Time!", {
                body: `It's time for your ${routineData.title} at ${routineData.time}`,
            });
        }
    };

    const stopAlarm = (e) => {
        e.stopPropagation();
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setActiveAlarm(null);
        setAudioBlocked(false);
    };

    const handleScreenClickToUnmute = () => {
        if (audioBlocked && audioRef.current) {
            audioRef.current.play().then(() => setAudioBlocked(false)).catch(console.error);
        }
    };

    if (!activeAlarm) return null;

    return (
        <div onClick={handleScreenClickToUnmute} className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500 cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-md p-8 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.3)] border flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 scale-in-center ${
                isDark ? 'bg-[#0D0D0F] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none"></div>

                {audioBlocked && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-rose-500/90 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce cursor-pointer z-50">
                        <VolumeX size={14} /> Tap to unmute alarm
                    </div>
                )}

                <div className={`relative z-10 w-24 h-24 mb-6 rounded-full flex items-center justify-center border-4 shadow-[0_0_30px_rgba(16,185,129,0.5)] ${audioBlocked ? 'bg-rose-500/20 border-rose-500/30 text-rose-500' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500'}`}>
                    <BellRing size={40} className="animate-[wiggle_1s_ease-in-out_infinite]" />
                </div>

                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2 text-emerald-500">
                    {activeAlarm.message}
                </h2>

                <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                    Scheduled for {activeAlarm.time}
                </p>

                <div className={`w-full p-6 rounded-3xl border mb-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="inline-block px-3 py-1 mb-3 rounded-lg bg-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                        {activeAlarm.type}
                    </span>
                    <h3 className="text-xl font-bold uppercase tracking-wide">
                        {activeAlarm.title}
                    </h3>
                </div>

                <button onClick={stopAlarm} className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/30 relative z-20">
                    <CheckCircle2 size={20} /> Stop & Confirm
                </button>
            </div>
        </div>
    );
}