import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import SkinAnalysis from "../pages/skin/SkinAnalysis";
import RoutineTimeline from "../pages/timelines/RoutineTimeline";
import Appointments from "../pages/appoinment/Appoinments";
import SignUp from "../pages/auth/SignUp.jsx";
import UserProfiles from "../pages/profiles/UserProfiles";

export default function AppRoute({ isDark, toggleTheme, onLoginSuccess, user }) {
    return (
        <Routes>
            <Route path="/" element={<Home isDark={isDark} toggleTheme={toggleTheme} onLoginSuccess={onLoginSuccess} />} />
            <Route path="/signup" element={<SignUp isDark={isDark} />} />
            <Route path="/analysis" element={<SkinAnalysis isDark={isDark} />} />
            <Route path="/timeline" element={<RoutineTimeline isDark={isDark} />} />
            <Route path="/appointments" element={<Appointments isDark={isDark} />} />

            {/* ADMIN ONLY ROUTE */}
            <Route
                path="/user-profiles"
                element={
                    user && user.email === 'admin@glowcare.ai'
                        ? <UserProfiles isDark={isDark} />
                        : <Navigate to="/" replace />
                }
            />
        </Routes>
    );
}