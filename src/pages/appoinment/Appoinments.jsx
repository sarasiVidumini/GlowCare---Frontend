import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import {
    Search, Calendar, Activity, Building2, ShieldCheck,
    CheckCircle, AlertCircle, MapPin, Clock, Star, Info, Moon, Sun, Leaf, Fingerprint
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

// --- ප්‍රධාන Component එකට isDark Prop එක ලබා දී ඇත ---
export default function AppointmentHub({ isDark }) {
    const [map, setMap] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [activeHospital, setActiveHospital] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingStatus, setBookingStatus] = useState('idle');

    // **මෙහි තිබූ Local Theme State එක සහ toggleTheme function එක ඉවත් කරන ලදී**

    const hospitalRegistry = [
        {
            id: "H001",
            name: "Nawaloka Hospital Colombo",
            coords: { lat: 6.9231, lng: 79.8510 },
            doctors: [
                { id: "D1", name: "Dr. Nayani Madarasingha", focus: "Acne & Cosmetic", available: ["Tue", "Thu", "Sat"], rating: 4.9 },
                { id: "D2", name: "Dr. Janaka Akarawita", focus: "General Dermatology", available: ["Mon", "Wed", "Fri"], rating: 4.8 },
                { id: "D3", name: "Dr. M.K. Dulcy Tissera", focus: "Clinical Dermatology", available: ["Mon", "Thu"], rating: 4.7 }
            ]
        },
        {
            id: "H002",
            name: "National Hospital (NHSL)",
            coords: { lat: 6.9189, lng: 79.8700 },
            doctors: [
                { id: "D5", name: "Dr. Indira Kahawita", focus: "Infectious Skin Diseases", available: ["Mon", "Tue"], rating: 5.0 },
                { id: "D6", name: "Dr. J.K.K. Seneviratne", focus: "Clinical Dermatology", available: ["Wed", "Thu"], rating: 4.9 }
            ]
        }
    ];

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBpxPO4e06RNrdcBGG7uhRver83UgWHrwg", // මෙතනට ඔයාගේ API key එක දාන්න
        libraries: ['places']
    });

    const darkMapStyle = [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
    ];

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                map.panTo(place.geometry.location);
                map.setZoom(15);
            }
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        const date = new Date(e.target.datetime.value);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (!selectedDoctor.available.includes(day)) {
            alert(`Specialist is only available on ${selectedDoctor.available.join(', ')}.`);
            return;
        }
        setBookingStatus('success');
    };

    return (
        <div className={`min-h-screen transition-all duration-700 relative overflow-hidden font-sans ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>

            <FallingLeaves isDark={isDark} />

            {/* පේජ් එකේ තිබූ වෙනම Theme Toggle Button එක ඉවත් කරන ලදී */}

            <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
                {/* BRAND HEADER */}
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
                                    <input
                                        type="text"
                                        placeholder="Search clinical facilities..."
                                        className={`relative w-full p-4 pl-12 rounded-2xl outline-none font-bold text-sm transition-all border ${isDark ? 'bg-[#0F0F12] border-white/5 text-white' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/40'}`}
                                    />
                                    <Search className="absolute left-4 top-4 text-emerald-500" size={18} />
                                </div>
                            </Autocomplete>
                        )}
                    </div>
                </div>

                {/* INSTRUCTIONAL BANNER */}
                <div className={`mb-8 p-6 rounded-[2rem] border flex items-center gap-6 transition-all relative overflow-hidden ${isDark ? 'bg-rose-500/10 border-rose-500/10' : 'bg-rose-50 border-rose-100'}`}>
                    <div className="bg-rose-500 p-3 rounded-xl shadow-lg animate-pulse relative z-10">
                        <Info className="text-white" size={20} />
                    </div>
                    <div className="relative z-10">
                        <p className={`font-black uppercase italic tracking-[0.2em] text-[9px] ${isDark ? 'text-rose-400' : 'text-rose-900'}`}>System Guidance</p>
                        <p className={`font-bold text-lg tracking-tight ${isDark ? 'text-rose-100' : 'text-rose-900'}`}>Touch the Red Nodes to probe clinical availability.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: MAP & DOCTORS */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className={`h-[420px] rounded-[2.5rem] shadow-xl border overflow-hidden relative ${isDark ? 'border-white/5 bg-[#0A0A0B]' : 'border-slate-50 bg-white shadow-slate-200/50'}`}>
                            {isLoaded ? (
                                <GoogleMap
                                    onLoad={setMap}
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={{ lat: 6.9271, lng: 79.8612 }}
                                    zoom={13}
                                    options={{
                                        styles: isDark ? darkMapStyle : [],
                                        disableDefaultUI: true,
                                        zoomControl: true
                                    }}
                                >
                                    {hospitalRegistry.map(hosp => (
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
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-emerald-500 p-2 rounded-lg">
                                        <Building2 className="text-white" size={20} />
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight italic uppercase">{activeHospital.name}</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeHospital.doctors.map(doc => (
                                        <div
                                            key={doc.id}
                                            onClick={() => setSelectedDoctor(doc)}
                                            className={`p-6 rounded-[1.8rem] cursor-pointer border-2 transition-all relative overflow-hidden ${
                                                selectedDoctor?.id === doc.id
                                                    ? 'border-emerald-500 bg-emerald-500/5 shadow-lg'
                                                    : isDark ? 'bg-[#0F0F12] border-white/5 hover:border-emerald-500/40' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDoctor?.id === doc.id ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                    <Activity size={20} />
                                                </div>
                                                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-black italic">
                                                    <Star size={10} fill="white"/> {doc.rating}
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

                    {/* RIGHT: SMART BOOKING PANEL */}
                    <div className="lg:col-span-5 relative">
                        <div className={`rounded-[2.5rem] p-8 sticky top-6 border backdrop-blur-3xl transition-all ${isDark ? 'bg-[#0A0A0B]/80 border-white/5 shadow-2xl' : 'bg-white/80 border-slate-100 shadow-xl'}`}>
                            {bookingStatus === 'success' ? (
                                <div className="text-center py-16 animate-in zoom-in-95">
                                    <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                                        <CheckCircle size={40} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black italic uppercase">SECURED.</h3>
                                    <p className="text-slate-500 mt-4 text-sm font-medium">Slot active. Dermal ID sent.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleBooking} className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="text-blue-500" size={22} />
                                        <h3 className="text-lg font-black uppercase italic tracking-tighter">Clinical Access</h3>
                                    </div>

                                    {!selectedDoctor ? (
                                        <div className={`py-20 text-center border-2 border-dashed rounded-[2rem] ${isDark ? 'bg-white/[0.02] border-white/5 text-slate-700' : 'bg-slate-50/50 border-slate-100 text-slate-400'}`}>
                                            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Select Facility <br/>On System Map</p>
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
                                                    <input name="datetime" type="datetime-local" required className={`w-full p-4 rounded-xl outline-none font-bold text-sm ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Protocol</label>
                                                    <select className={`w-full p-4 rounded-xl outline-none font-bold text-sm appearance-none ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                                                        <option>General Consultation</option>
                                                        <option>Urgent Mapping</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-xl font-black uppercase tracking-[0.3em] text-[9px] hover:bg-blue-500 shadow-lg active:scale-95 transition-all">
                                                Confirm Clinical Slot
                                            </button>
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