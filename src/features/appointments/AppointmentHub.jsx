import React, { useState, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { Search, Info, Fingerprint } from 'lucide-react';

// Import our newly separated components
import FallingLeaves from '../../components/ui/FallingLeaves';
import AddDoctorModal from './components/AddDoctorModal';
import EditDoctorModal from './components/EditDoctorModal';
import MapSection from './components/MapSection';
import HospitalDoctorsList from './components/HospitalDoctorsList';
import BookingForm from './components/BookingForm';

export default function AppointmentHub({ isDark }) {
    const [map, setMap] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [activeHospital, setActiveHospital] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingStatus, setBookingStatus] = useState('idle');
    const [isMainAdmin, setIsMainAdmin] = useState(false);

    // Initial Data State
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

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [newDoctorData, setNewDoctorData] = useState({ name: '', focus: '', available: 'Mon, Wed' });

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAVk72NnnY-5KurVa6TvnHzRzgjMqLZxbg",
        libraries: ['places']
    });

    useEffect(() => {
        const checkAdmin = () => {
            const storedUser = localStorage.getItem('currentUser');
            const currentUser = storedUser ? JSON.parse(storedUser) : null;
            setIsMainAdmin(currentUser && currentUser.email === 'admin@glowcare.ai');
        };

        checkAdmin();
        window.addEventListener('storage', checkAdmin);
        return () => window.removeEventListener('storage', checkAdmin);
    }, []);

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
        const date = new Date(dateTimeValue);
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

            {/* Modals */}
            {isMainAdmin && (
                <>
                    <AddDoctorModal
                        isDark={isDark} isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}
                        onSubmit={handleAddDoctor} newDoctorData={newDoctorData} setNewDoctorData={setNewDoctorData}
                    />
                    <EditDoctorModal
                        isDark={isDark} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}
                        onSubmit={saveUpdatedDoctor} editingDoctor={editingDoctor} setEditingDoctor={setEditingDoctor}
                    />
                </>
            )}

            <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
                {/* Header & Search */}
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

                {/* Banner */}
                <div className={`mb-8 p-6 rounded-[2rem] border flex items-center gap-6 transition-all relative overflow-hidden ${isDark ? 'bg-rose-500/10 border-rose-500/10' : 'bg-rose-50 border-rose-100'}`}>
                    <div className="bg-rose-500 p-3 rounded-xl shadow-lg animate-pulse relative z-10">
                        <Info className="text-white" size={20} />
                    </div>
                    <div className="relative z-10">
                        <p className={`font-black uppercase italic tracking-[0.2em] text-[9px] ${isDark ? 'text-rose-400' : 'text-rose-900'}`}>System Guidance</p>
                        <p className={`font-bold text-lg tracking-tight ${isDark ? 'text-rose-100' : 'text-rose-900'}`}>Search a location and touch Red Points to see Best Skin Care Doctors.</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-8">
                        <MapSection
                            isDark={isDark} isLoaded={isLoaded} setMap={setMap}
                            hospitals={hospitals} setActiveHospital={setActiveHospital} setSelectedDoctor={setSelectedDoctor}
                        />
                        <HospitalDoctorsList
                            isDark={isDark} activeHospital={activeHospital} selectedDoctor={selectedDoctor}
                            setSelectedDoctor={setSelectedDoctor} isMainAdmin={isMainAdmin}
                            onAddClick={() => setIsAddModalOpen(true)} onEditClick={openEditModal} onDeleteClick={deleteDoctor}
                        />
                    </div>

                    <div className="lg:col-span-5 relative">
                        <BookingForm
                            isDark={isDark} selectedDoctor={selectedDoctor} bookingStatus={bookingStatus}
                            setBookingStatus={setBookingStatus} handleBooking={handleBooking}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}