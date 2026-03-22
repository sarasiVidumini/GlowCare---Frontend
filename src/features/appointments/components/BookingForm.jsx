import React from 'react';
import { Calendar, ShieldCheck, CheckCircle } from 'lucide-react';

export default function BookingForm({ isDark, selectedDoctor, bookingStatus, setBookingStatus, handleBooking }) {
    return (
        <div className={`rounded-[2.5rem] p-8 sticky top-6 border backdrop-blur-3xl transition-all ${isDark ? 'bg-[#0A0A0B]/80 border-white/5 shadow-2xl' : 'bg-white/80 border-slate-100 shadow-xl'}`}>
            {bookingStatus === 'success' ? (
                <div className="text-center py-16 animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase">BOOKED!</h3>
                    <p className="text-slate-500 mt-4 text-sm font-medium">Appointment confirmed with {selectedDoctor.name}.</p>
                    <button onClick={() => setBookingStatus('idle')} className="mt-8 text-[10px] font-black uppercase text-emerald-500">New Booking</button>
                </div>
            ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-blue-500" size={22} />
                        <h3 className="text-lg font-black uppercase italic tracking-tighter">Clinical Access</h3>
                    </div>
                    {!selectedDoctor ? (
                        <div className={`py-20 text-center border-2 border-dashed rounded-[2rem] ${isDark ? 'bg-white/[0.02] border-white/5 text-slate-700' : 'bg-slate-50/50 border-slate-100 text-slate-400'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Touch Red Markers <br/>to select Specialist</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[9px] uppercase font-black opacity-60 mb-1">Physician</p>
                                    <p className="font-black text-xl tracking-tight uppercase italic">{selectedDoctor.name}</p>
                                </div>
                                <ShieldCheck className="absolute -right-4 -bottom-4 text-white/10" size={100} />
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Slot Datetime</label>
                                    <input name="datetime" type="datetime-local" required className={`w-full p-4 rounded-xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5 text-white' : 'bg-slate-50 border border-slate-100'}`} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Reason for Visit</label>
                                    <textarea name="reason" placeholder="Briefly describe your skin concern..." rows="3" className={`w-full p-4 rounded-xl outline-none font-bold text-sm resize-none transition-all ${isDark ? 'bg-white/5 border border-white/5 text-white focus:border-emerald-500/50' : 'bg-slate-50 border border-slate-100 focus:border-emerald-200 shadow-inner'}`}></textarea>
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