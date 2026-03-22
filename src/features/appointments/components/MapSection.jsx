import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

export default function MapSection({ isDark, isLoaded, setMap, hospitals, setActiveHospital, setSelectedDoctor }) {
    const darkMapStyle = [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
    ];

    return (
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
    );
}