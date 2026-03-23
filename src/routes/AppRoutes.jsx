import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

// 1. Pointing to your OLD nested folders temporarily (we will clean these up next)
import Home from "../pages/home/Home";
import SkinAnalysis from "../pages/skin/SkinAnalysis";
import SkinPrediction from "../pages/prediction/SkinPrediction";

// 2. Pointing to the NEW clean wrappers we just built! (Notice: No nested folders!)
import SignUpPage from "../pages/auth/SignUp.jsx";
import AppointmentsPage from "../pages/appointment/Appointments.jsx";
import UserProfilesPage from "../pages/profiles/UserProfiles.jsx";
import RoutineTimelinePage from "../pages/timelines/RoutineTimeline.jsx";

// 3. Import the SignInModal directly from the Auth feature!
import SignInModal from "../features/auth/components/SignInModal";
import OAuth2RedirectHandler from "../pages/OAuth2RedirectHandler.jsx";
import CompleteProfile from "../pages/CompleteProfile.jsx";

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
                {/* Old Routes (Waiting to be refactored) */}
                <Route path="/" element={<Home isDark={isDark} toggleTheme={toggleTheme} onLoginSuccess={onLoginSuccess} setIsSignInOpen={setIsSignInOpen} />} />
                <Route path="/analysis" element={<SkinAnalysis isDark={isDark} />} />
                <Route path="/prediction" element={<SkinPrediction isDark={isDark} />} />
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler onLoginSuccess={onLoginSuccess} />} />
                <Route path="/complete-profile" element={<CompleteProfile isDark={isDark} />} />

                {/* New Refactored Routes */}
                <Route path="/signup" element={<SignUpPage isDark={isDark} />} />
                <Route path="/timeline" element={<RoutineTimelinePage isDark={isDark} />} />
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