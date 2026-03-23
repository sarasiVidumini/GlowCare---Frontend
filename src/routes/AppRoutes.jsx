import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes.jsx";

import Home from "../pages/home/Home";
import SkinPrediction from "../pages/prediction/SkinPrediction";
import OAuth2RedirectHandler from "../pages/OAuth2RedirectHandler";
import CompleteProfile from "../pages/CompleteProfile";

import SignUpPage from "../pages/auth/SignUp.jsx";
import SignInPage from "../pages/auth/SignIn.jsx"; // ADDED SIGN IN PAGE
import SkinAnalysisPage from "../pages/skin/SkinAnalysis.jsx";
import AppointmentsPage from "../pages/appointment/Appointments.jsx";
import UserProfilesPage from "../pages/profiles/UserProfiles.jsx";
import RoutineTimelinePage from "../pages/timelines/RoutineTimeline.jsx";

// We no longer need to pass setIsSignInOpen around!
export default function AppRoutes({ isDark, toggleTheme, onLoginSuccess, user }) {
    return (
        <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<Home isDark={isDark} toggleTheme={toggleTheme} onLoginSuccess={onLoginSuccess} user={user} />} />

            {/* NEW DEDICATED AUTH PAGES */}
            <Route path="/signup" element={<Navigate to="/sign-up" replace />} /> {/* Redirect old links */}
            <Route path="/sign-up" element={<SignUpPage isDark={isDark} />} />
            <Route path="/sign-in" element={<SignInPage isDark={isDark} onLoginSuccess={onLoginSuccess} />} />

            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler onLoginSuccess={onLoginSuccess} />} />

            {/* --- PROTECTED ROUTES --- */}
            <Route path="/analysis" element={<ProtectedRoute user={user}><SkinAnalysisPage isDark={isDark} toggleTheme={toggleTheme} user={user} /></ProtectedRoute>} />
            <Route path="/timeline" element={<ProtectedRoute user={user}><RoutineTimelinePage isDark={isDark} toggleTheme={toggleTheme} user={user} /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute user={user}><AppointmentsPage isDark={isDark} toggleTheme={toggleTheme} user={user} /></ProtectedRoute>} />
            <Route path="/complete-profile" element={<ProtectedRoute user={user}><CompleteProfile isDark={isDark} /></ProtectedRoute>} />

            {/* --- ADMIN ONLY --- */}
            <Route path="/user-profiles" element={
                <ProtectedRoute user={user}>
                    {user?.email === 'admin@glowcare.ai' ? <UserProfilesPage isDark={isDark} /> : <Navigate to="/" replace />}
                </ProtectedRoute>
            } />

            <Route path="/prediction" element={<SkinPrediction isDark={isDark} />} />
        </Routes>
    );
}