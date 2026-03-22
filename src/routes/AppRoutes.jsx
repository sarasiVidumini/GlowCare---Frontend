import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

// 1. Pointing to your OLD nested folders temporarily (we will clean these up one by one)
import Home from "../pages/home/Home";
import SignUp from "../pages/auth/SignUp";
import SkinAnalysis from "../pages/skin/SkinAnalysis";
import RoutineTimeline from "../pages/timelines/RoutineTimeline";
import SkinPrediction from "../pages/prediction/SkinPrediction";

// 2. Pointing to the NEW clean wrappers we just built!
import AppointmentsPage from "../pages/appointment/Appointments.jsx";
import UserProfilesPage from "../pages/profiles/UserProfiles.jsx";

// 3. Keep your SignInModal wherever it currently lives until we refactor Auth
import SignInModal from "../pages/auth/SignInModal";

export default function AppRoutes({ isDark, toggleTheme, onLoginSuccess, user, isSignInOpen, setIsSignInOpen }) {
    return (
        <>
            {isSignInOpen && (
                <SignInModal
                    isDark={isDark}
                    onClose={() => setIsSignInOpen(false)}
                    onLoginSuccess={onLoginSuccess}
                />
            )}

            <Routes>
                {/* Old Routes */}
                <Route path="/" element={<Home isDark={isDark} toggleTheme={toggleTheme} onLoginSuccess={onLoginSuccess} setIsSignInOpen={setIsSignInOpen} />} />
                <Route path="/signup" element={<SignUp isDark={isDark} />} />
                <Route path="/analysis" element={<SkinAnalysis isDark={isDark} />} />
                <Route path="/timeline" element={<RoutineTimeline isDark={isDark} />} />
                <Route path="/prediction" element={<SkinPrediction isDark={isDark} />} />

                {/* New Refactored Routes */}
                <Route path="/appointments" element={<AppointmentsPage isDark={isDark} />} />

                {/* Refactored Admin Only Route */}
                <Route
                    path="/user-profiles"
                    element={
                        user && user.email === 'admin@glowcare.ai'
                            ? <UserProfilesPage isDark={isDark} />
                            : <Navigate to="/" replace />
                    }
                />
            </Routes>
        </>
    );
}