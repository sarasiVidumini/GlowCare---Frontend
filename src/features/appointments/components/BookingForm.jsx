import React, { useState } from 'react';
import { Calendar, ShieldCheck, CheckCircle, User as UserIcon } from 'lucide-react';
import axios from 'axios';

export default function BookingForm({ isDark, selectedDoctor }) {
    // Automatically grab the logged-in user
    const activeUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('activeUser'));

    const [bookingStatus, setBookingStatus] = useState('idle');
    const [bookingError, setBookingError] = useState('');

    const handleBooking = async (e) => {
        e.preventDefault();
        setBookingError('');

        if (!activeUser || !activeUser.email) {
            setBookingError("Authentication Error: Please log in to make an appointment.");
            return;
        }

        const dateVal = e.target.date.value;
        const reasonVal = e.target.reason.value;

        // FRONTEND DATE VALIDATION
        const [year, month, day] = dateVal.split('-');
        const dateObj = new Date(year, month - 1, day);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const selectedDay = dayNames[dateObj.getDay()];

        if (!selectedDoctor.available.includes(selectedDay)) {
            setBookingError(`Dr. ${selectedDoctor.name} is not available on ${selectedDay}s. Available days: ${selectedDoctor.available.join(', ')}`);
            return;
        }

        // Clean the Physician ID
        let cleanPhysicianId = selectedDoctor.id;
        if (typeof cleanPhysicianId === 'string') {
            cleanPhysicianId = parseInt(cleanPhysicianId.replace(/\D/g, ''), 10);
        }

        // 🚀 SEND TO BACKEND
        try {
            const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            await axios.post('http://localhost:8080/api/v1/clinical/book', {
                userEmail: activeUser.email, // 🚀 Uses EMAIL instead of ID to perfectly match the database!
                physicianId: cleanPhysicianId,
                date: dateVal,
                reason: reasonVal
            }, { headers });

            setBookingStatus('success');
            e.target.reset();
        } catch (error) {
            const errData = error.response?.data;
            let finalErrorMessage = "Booking failed to connect to the server.";

            if (typeof errData === 'string') {
                finalErrorMessage = errData;
            } else if (errData && errData.message) {
                finalErrorMessage = errData.message;
            } else if (errData && errData.error) {
                finalErrorMessage = errData.error;
            }

            setBookingError(finalErrorMessage);
        }
    };

    return (
        <div className={`rounded-[2.5rem] p-8 sticky top-6 border backdrop-blur-3xl transition-all ${isDark ? 'bg-[#0A0A0B]/80 border-white/5 shadow-2xl' : 'bg-white/80 border-slate-100 shadow-xl'}`}>

            {bookingStatus === 'success' ? (
                <div className="text-center py-16 animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase">BOOKED!</h3>
                    <p className="text-slate-500 mt-4 text-sm font-medium">Appointment confirmed with Dr. {selectedDoctor.name}.</p>
                    <button onClick={() => setBookingStatus('idle')} className="mt-8 text-[10px] font-black uppercase text-emerald-500 hover:text-emerald-400">
                        New Booking
                    </button>
                </div>
            ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-blue-500" size={22} />
                        <h3 className="text-lg font-black uppercase italic tracking-tighter">Clinical Access</h3>
                    </div>

                    <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="p-2 bg-blue-500/20 rounded-full text-blue-500"><UserIcon size={16}/></div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Booking For</p>
                            <p className="text-sm font-bold uppercase">{activeUser?.name || "Guest"}</p>
                        </div>
                    </div>

                    {!selectedDoctor ? (
                        <div className={`py-20 text-center border-2 border-dashed rounded-[2rem] ${isDark ? 'bg-white/[0.02] border-white/5 text-slate-700' : 'bg-slate-50/50 border-slate-100 text-slate-400'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Touch Red Markers on the Map<br/>to select a Specialist</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white relative overflow-hidden shadow-lg">
                                <div className="relative z-10">
                                    <p className="text-[9px] uppercase font-black opacity-60 mb-1">Physician Selected</p>
                                    <p className="font-black text-xl tracking-tight uppercase italic">Dr. {selectedDoctor.name}</p>
                                </div>
                                <ShieldCheck className="absolute -right-4 -bottom-4 text-white/10" size={100} />
                            </div>

                            {bookingError && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-2xl animate-in fade-in">
                                    {bookingError}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Slot Date</label>
                                    <input name="date" type="date" required className={`w-full p-4 rounded-xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white scheme-dark' : 'bg-slate-50 border border-slate-100 text-slate-900'}`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Reason for Visit</label>
                                    <textarea name="reason" placeholder="Briefly describe your skin concern..." rows="3" required className={`w-full p-4 rounded-xl outline-none font-bold text-sm resize-none transition-all ${isDark ? 'bg-white/5 border border-white/5 text-white focus:border-emerald-500/50' : 'bg-slate-50 border border-slate-100 focus:border-emerald-200'}`}></textarea>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-xl font-black uppercase tracking-[0.3em] text-[9px] hover:bg-blue-500 shadow-lg active:scale-95 transition-all">Confirm Clinical Slot</button>
                        </>
                    )}
                </form>
            )}
        </div>
    );
}