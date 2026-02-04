import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/home/Home.jsx';
import RoutineTimeline from './pages/timelines/RoutineTimeline.jsx';
import SkinAnalysis from './pages/skin/SkinAnalysis.jsx';
import Appointments from './pages/appoinment/Appoinments.jsx';

function App() {
    // 1. Theme එක පාලනය කරන State එක (මුලින්ම Light Mode/false ලෙස ඇත)
    const [isDark, setIsDark] = useState(false);

    // 2. Theme එක මාරු කරන Function එක
    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <Router>
            {/* මුළු පිටුවේම පසුබිම් වර්ණය පාලනය කිරීම */}
            <div className={`flex flex-col min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'}`}>

                {/* Smart Top Bar for Climate Alerts */}
                <div className={`${isDark ? 'bg-emerald-900' : 'bg-emerald-600'} text-white text-[10px] uppercase tracking-[0.2em] py-2 text-center font-bold transition-colors`}>
                    Current Climate: High Humidity (82%) — Routines Adjusted for Sri Lanka
                </div>

                {/* Navbar එකට theme එක සහ මාරු කරන function එක යවනවා */}
                <Navbar isDark={isDark} toggleTheme={toggleTheme} />

                <main className="flex-grow">
                    <Routes>
                        {/* සෑම පිටුවකටම isDark props එක ලබා දීම */}
                        <Route path="/" element={<Home isDark={isDark} toggleTheme={toggleTheme} />} />
                        <Route path="/analysis" element={<SkinAnalysis isDark={isDark} />} />
                        <Route path="/timeline" element={<RoutineTimeline isDark={isDark} />} />
                        <Route path="/appointments" element={<Appointments isDark={isDark} />} />
                    </Routes>
                </main>

                <Footer isDark={isDark} />
            </div>
        </Router>
    );
}

export default App;