import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes.jsx"; // Ensure you create this file!

// 1. OLD/Utility Routes
import Home from "../pages/home/Home";
import SkinPrediction from "../pages/prediction/SkinPrediction";
import OAuth2RedirectHandler from "../pages/OAuth2RedirectHandler";
import CompleteProfile from "../pages/CompleteProfile";

// 2. NEW Clean Wrapper Pages
import SignUpPage from "../pages/auth/SignUp.jsx";
import SkinAnalysisPage from "../pages/skin/SkinAnalysis.jsx";
import AppointmentsPage from "../pages/appointment/Appointments.jsx";
import UserProfilesPage from "../pages/profiles/UserProfiles.jsx";
import RoutineTimelinePage from "../pages/timelines/RoutineTimeline.jsx";

// 3. Features
import SignInModal from "../features/auth/components/SignInModal";

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
                {/* --- PUBLIC ROUTES --- */}
                <Route path="/" element={
                    <Home
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                        onLoginSuccess={onLoginSuccess}
                        setIsSignInOpen={setIsSignInOpen}
                        user={user}
                    />
                } />
                <Route path="/signup" element={<SignUpPage isDark={isDark} />} />
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler onLoginSuccess={onLoginSuccess} />} />

                {/* --- PROTECTED ROUTES (Login Required) --- */}
                <Route path="/analysis" element={
                    <ProtectedRoute user={user} setIsSignInOpen={setIsSignInOpen}>
                        <SkinAnalysisPage isDark={isDark} toggleTheme={toggleTheme} user={user} setIsSignInOpen={setIsSignInOpen} />
                    </ProtectedRoute>
                } />

                <Route path="/timeline" element={
                    <ProtectedRoute user={user} setIsSignInOpen={setIsSignInOpen}>
                        <RoutineTimelinePage isDark={isDark} toggleTheme={toggleTheme} user={user} setIsSignInOpen={setIsSignInOpen} />
                    </ProtectedRoute>
                } />

                <Route path="/appointments" element={
                    <ProtectedRoute user={user} setIsSignInOpen={setIsSignInOpen}>
                        <AppointmentsPage isDark={isDark} toggleTheme={toggleTheme} user={user} setIsSignInOpen={setIsSignInOpen} />
                    </ProtectedRoute>
                } />

                <Route path="/complete-profile" element={
                    <ProtectedRoute user={user} setIsSignInOpen={setIsSignInOpen}>
                        <CompleteProfile isDark={isDark} />
                    </ProtectedRoute>
                } />

                {/* --- ADMIN ONLY --- */}
                <Route path="/user-profiles" element={
                    <ProtectedRoute user={user} setIsSignInOpen={setIsSignInOpen}>
                        {user?.email === 'admin@glowcare.ai'
                            ? <UserProfilesPage isDark={isDark} />
                            : <Navigate to="/" replace />
                        }
                    </ProtectedRoute>
                } />

                {/* Legacy / Temporary */}
                <Route path="/prediction" element={<SkinPrediction isDark={isDark} />} />
            </Routes>
        </>
    );
}