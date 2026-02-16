import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import {
    Search, Calendar, Activity, Building2, ShieldCheck,
    CheckCircle, AlertCircle, MapPin, Clock, Star, Info, Moon, Sun, Leaf, Fingerprint,
    Plus, Edit2, Trash2, X
} from 'lucide-react';

// --- LEAF ANIMATION COMPONENT ---
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
                <div
                    key={leaf.id}
                    className="absolute top-[-10%]"
                    style={{
                        left: leaf.left,
                        animation: `leafFall ${leaf.duration} linear infinite`,
                        animationDelay: leaf.delay,
                        // @ts-ignore
                        '--swing-dist': leaf.swing
                    }}
                >
                    <Leaf
                        size={leaf.size}
                        className={`transition-colors duration-1000 ${
                            isDark ? 'text-emerald-500/20' : 'text-emerald-800/10'
                        }`}
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

export default function AppointmentHub({ isDark }) {
    const [map, setMap] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [activeHospital, setActiveHospital] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingStatus, setBookingStatus] = useState('idle');

    // --- UPDATED ADMIN CHECK LOGIC ---
    // User කෙනෙක් ඇතුළත් වී නැති නම් (null) හෝ email එක වෙනස් නම් isMainAdmin 'false' වේ.
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const isMainAdmin = currentUser && currentUser.email === 'admin@glowcare.ai';

    // --- CRUD STATES ---
    const [hospitals, setHospitals] = useState([
        {
            id: "H001",
            name: "Nawaloka Hospital Colombo",
            coords: { lat: 6.9231, lng: 79.8510 },
            doctors: [
                { id: "D1", name: "Dr. Nayani Madarasingha", focus: "Acne & Cosmetic Specialist", available: ["Tue", "Thu", "Sat"], rating: 4.9 },
                { id: "D2", name: "Dr. Janaka Akarawita", focus: "General Dermatology", available: ["Mon", "Wed", "Fri"], rating: 4.8 },
                { id: "D3", name: "Dr. M.K. Dulcy Tissera", focus: "Clinical Dermatology", available: ["Mon", "Thu"], rating: 4.7 },
                { id: "D4", name: "Dr. Upendra De Silva", focus: "Pediatric Dermatology", available: ["Wed", "Sat"], rating: 4.9 }
            ]
        },
        {
            id: "H002",
            name: "National Hospital (NHSL)",
            coords: { lat: 6.9189, lng: 79.8700 },
            doctors: [
                { id: "D5", name: "Dr. Indira Kahawita", focus: "Infectious Skin Diseases", available: ["Mon", "Tue"], rating: 5.0 },
                { id: "D6", name: "Dr. J.K.K. Seneviratne", focus: "Clinical Dermatology", available: ["Wed", "Thu"], rating: 4.9 },
                { id: "D7", name: "Dr. K.P.N. Pathirana", focus: "Venereologist", available: ["Tue", "Fri"], rating: 4.8 },
                { id: "D8", name: "Dr. Sriyani Samaraweera", focus: "Laser Surgery Specialist", available: ["Mon", "Sat"], rating: 4.7 }
            ]
        }
    ]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [newDoctorData, setNewDoctorData] = useState({ name: '', focus: '', available: 'Mon, Wed' });

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAVk72NnnY-5KurVa6TvnHzRzgjMqLZxbg",
        libraries: ['places']
    });

    const darkMapStyle = [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
    ];

    // --- CRUD FUNCTIONS ---
    const handleAddDoctor = (e) => {
        e.preventDefault();
        if (!activeHospital || !isMainAdmin) return;
        const newDoc = {
            id: "D" + Date.now(),
            name: newDoctorData.name,
            focus: newDoctorData.focus,
            available: newDoctorData.available.split(',').map(s => s.trim()),
            rating: 5.0
        };
        const updatedHospitals = hospitals.map(h => {
            if (h.id === activeHospital.id) {
                const updatedDocList = [...h.doctors, newDoc];
                setActiveHospital({...h, doctors: updatedDocList});
                return {...h, doctors: updatedDocList};
            }
            return h;
        });
        setHospitals(updatedHospitals);
        setIsAddModalOpen(false);
        setNewDoctorData({ name: '', focus: '', available: 'Mon, Wed' });
    };

    const deleteDoctor = (e, docId) => {
        e.stopPropagation();
        if (!isMainAdmin) return;
        const updatedHospitals = hospitals.map(h => {
            if (h.id === activeHospital.id) {
                const filteredDocs = h.doctors.filter(d => d.id !== docId);
                setActiveHospital({...h, doctors: filteredDocs});
                return {...h, doctors: filteredDocs};
            }
            return h;
        });
        setHospitals(updatedHospitals);
        if (selectedDoctor?.id === docId) setSelectedDoctor(null);
    };

    const openEditModal = (e, doc) => {
        e.stopPropagation();
        if (!isMainAdmin) return;
        setEditingDoctor({ ...doc, availableStr: doc.available.join(', ') });
        setIsEditModalOpen(true);
    };

    const saveUpdatedDoctor = (e) => {
        e.preventDefault();
        if (!isMainAdmin) return;
        const updatedHospitals = hospitals.map(h => {
            if (h.id === activeHospital.id) {
                const updatedDocs = h.doctors.map(d => d.id === editingDoctor.id ? {
                    ...editingDoctor,
                    available: editingDoctor.availableStr.split(',').map(s => s.trim())
                } : d);
                setActiveHospital({...h, doctors: updatedDocs});
                return {...h, doctors: updatedDocs};
            }
            return h;
        });
        setHospitals(updatedHospitals);
        setIsEditModalOpen(false);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                map.panTo(location);
                map.setZoom(15);

                const service = new window.google.maps.places.PlacesService(map);
                const request = {
                    location: location,
                    radius: '3000',
                    type: ['hospital']
                };

                service.nearbySearch(request, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                        const newHospitals = results.map((h, index) => ({
                            id: h.place_id,
                            name: h.name,
                            coords: {
                                lat: h.geometry.location.lat(),
                                lng: h.geometry.location.lng()
                            },
                            doctors: [
                                { id: `D-Auto-1-${index}`, name: "Dr. Premasiri Koralage", focus: "Skin Care Specialist", available: ["Mon", "Wed", "Sat"], rating: 4.9 },
                                { id: `D-Auto-2-${index}`, name: "Dr. Sudath Samaraweera", focus: "Consultant Dermatologist", available: ["Tue", "Fri"], rating: 4.7 }
                            ]
                        }));
                        setHospitals(newHospitals);
                        setActiveHospital(null);
                        setSelectedDoctor(null);
                    }
                });
            }
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        const dateTimeValue = e.target.datetime.value;
        const reasonValue = e.target.reason.value;
        const date = new Date(dateTimeValue);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });

        if (!selectedDoctor.available.includes(day)) {
            alert(`Specialist is only available on ${selectedDoctor.available.join(', ')}.`);
            return;
        }

        const bookingData = {
            doctorId: selectedDoctor.id,
            hospitalId: activeHospital.id,
            appointmentTime: dateTimeValue,
            reason: reasonValue,
            status: 'PENDING'
        };
        setBookingStatus('success');
    };

    return (
        <div className={`min-h-screen transition-all duration-700 relative overflow-hidden font-sans ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>

            <FallingLeaves isDark={isDark} />

            {/* --- ADD DOCTOR MODAL --- */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl ${isDark ? 'bg-[#0F0F12] border border-white/10' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black italic uppercase">Register Specialist</h3>
                            <button onClick={() => setIsAddModalOpen(false)}><X size={24}/></button>
                        </div>
                        <form onSubmit={handleAddDoctor} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Name</label>
                                <input required placeholder="Dr. Name" value={newDoctorData.name} onChange={e => setNewDoctorData({...newDoctorData, name: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Specialist In</label>
                                <input required placeholder="Skin Care focus" value={newDoctorData.focus} onChange={e => setNewDoctorData({...newDoctorData, focus: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Dates (Comma separated: Mon, Tue)</label>
                                <input required placeholder="Mon, Wed" value={newDoctorData.available} onChange={e => setNewDoctorData({...newDoctorData, available: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                            </div>
                            <button type="submit" className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Add to Registry</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- UPDATE MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl ${isDark ? 'bg-[#0F0F12] border border-white/10' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black italic uppercase">Update Physician</h3>
                            <button onClick={() => setIsEditModalOpen(false)}><X size={24}/></button>
                        </div>
                        <form onSubmit={saveUpdatedDoctor} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Full Name</label>
                                <input value={editingDoctor.name} onChange={(e) => setEditingDoctor({...editingDoctor, name: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Specialization</label>
                                <input value={editingDoctor.focus} onChange={(e) => setEditingDoctor({...editingDoctor, focus: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase opacity-50 ml-2">Available Dates</label>
                                <input value={editingDoctor.availableStr} onChange={(e) => setEditingDoctor({...editingDoctor, availableStr: e.target.value})} className={`w-full p-4 rounded-xl outline-none font-bold ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                            </div>
                            <button type="submit" className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Update Registry</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div className="border-l-4 border-emerald-500 pl-6">
                        <div className="flex items-center gap-2 mb-1">
                            <Fingerprint className="text-emerald-500" size={20} strokeWidth={3} />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50">Authorized Network</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Clinical <span className="text-emerald-500">Hub.</span></h1>
                    </div>

                    <div className="relative w-full md:w-[380px] group">
                        {isLoaded && (
                            <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
                                <div className="relative">
                                    <input type="text" placeholder="Search area (e.g. Colombo, Galle)..." className={`relative w-full p-4 pl-12 rounded-2xl outline-none font-bold text-sm transition-all border ${isDark ? 'bg-[#0F0F12] border-white/5 text-white' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/40'}`} />
                                    <Search className="absolute left-4 top-4 text-emerald-500" size={18} />
                                </div>
                            </Autocomplete>
                        )}
                    </div>
                </div>

                <div className={`mb-8 p-6 rounded-[2rem] border flex items-center gap-6 transition-all relative overflow-hidden ${isDark ? 'bg-rose-500/10 border-rose-500/10' : 'bg-rose-50 border-rose-100'}`}>
                    <div className="bg-rose-500 p-3 rounded-xl shadow-lg animate-pulse relative z-10">
                        <Info className="text-white" size={20} />
                    </div>
                    <div className="relative z-10">
                        <p className={`font-black uppercase italic tracking-[0.2em] text-[9px] ${isDark ? 'text-rose-400' : 'text-rose-900'}`}>System Guidance</p>
                        <p className={`font-bold text-lg tracking-tight ${isDark ? 'text-rose-100' : 'text-rose-900'}`}>Search a location and touch Red Points to see Best Skin Care Doctors.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-8">
                        <div className={`h-[420px] rounded-[2.5rem] shadow-xl border overflow-hidden relative ${isDark ? 'border-white/5 bg-[#0A0A0B]' : 'border-slate-50 bg-white shadow-slate-200/50'}`}>
                            {isLoaded ? (
                                <GoogleMap
                                    onLoad={setMap}
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={{ lat: 6.9271, lng: 79.8612 }}
                                    zoom={13}
                                    options={{ styles: isDark ? darkMapStyle : [], disableDefaultUI: true, zoomControl: true }}
                                >
                                    {hospitals.map(hosp => (
                                        <Marker
                                            key={hosp.id}
                                            position={hosp.coords}
                                            icon={{
                                                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                                                fillColor: "#f43f5e", fillOpacity: 1, strokeWeight: 2, strokeColor: "#ffffff", scale: 1.8
                                            }}
                                            onClick={() => { setActiveHospital(hosp); setSelectedDoctor(null); }}
                                        />
                                    ))}
                                </GoogleMap>
                            ) : <div className="h-full w-full animate-pulse bg-emerald-500/5" />}
                        </div>

                        {activeHospital && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-500 p-2 rounded-lg">
                                            <Building2 className="text-white" size={20} />
                                        </div>
                                        <h2 className="text-xl font-black tracking-tight italic uppercase">{activeHospital.name}</h2>
                                    </div>
                                    {/* --- ADD DOCTOR: පෙන්වන්නේ Admin ලොග් වී ඇත්නම් පමණි --- */}
                                    {isMainAdmin && (
                                        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                                            <Plus size={14}/> Add Doctor
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeHospital.doctors.map(doc => (
                                        <div
                                            key={doc.id}
                                            onClick={() => setSelectedDoctor(doc)}
                                            className={`p-6 rounded-[1.8rem] cursor-pointer border-2 transition-all relative group overflow-hidden ${
                                                selectedDoctor?.id === doc.id
                                                    ? 'border-emerald-500 bg-emerald-500/5 shadow-lg'
                                                    : isDark ? 'bg-[#0F0F12] border-white/5 hover:border-emerald-500/40' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDoctor?.id === doc.id ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                    <Activity size={20} />
                                                </div>
                                                <div className="flex gap-2">
                                                    {/* --- EDIT/DELETE: පෙන්වන්නේ Admin ලොග් වී ඇත්නම් පමණි --- */}
                                                    {isMainAdmin && (
                                                        <>
                                                            <button onClick={(e) => openEditModal(e, doc)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={12}/></button>
                                                            <button onClick={(e) => deleteDoctor(e, doc.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                                                        </>
                                                    )}
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-black italic h-fit">
                                                        <Star size={10} fill="white"/> {doc.rating}
                                                    </div>
                                                </div>
                                            </div>
                                            <h4 className="text-md font-black tracking-tight italic uppercase">{doc.name}</h4>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">{doc.focus}</p>
                                            <div className={`flex items-center gap-2 text-[9px] font-black px-3 py-1.5 rounded-lg w-fit ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                                                <Clock size={12} className="text-emerald-500" /> {doc.available.join(' • ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 relative">
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
                    </div>
                </div>
            </div>
        </div>
    );
}