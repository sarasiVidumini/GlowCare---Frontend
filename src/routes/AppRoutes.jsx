import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes.jsx";

// Standard Pages
import Home from "../pages/home/Home";
import SkinPrediction from "../pages/prediction/SkinPrediction";
import OAuth2RedirectHandler from "../pages/OAuth2RedirectHandler";
import CompleteProfile from "../pages/CompleteProfile";
import NotFound from "../pages/notFound/NotFound.jsx";

// Auth & Core Features
import SignUpPage from "../pages/auth/SignUp.jsx";
import SignInPage from "../pages/auth/SignIn.jsx";
import SkinAnalysisPage from "../pages/skin/SkinAnalysis.jsx";
import RoutineTimelinePage from "../pages/timelines/RoutineTimeline.jsx";

// 🚀 Make sure this points to your new AppointmentHub file!
import AppointmentHub from "../features/appointments/AppointmentHub.jsx";

// Modals & Admin
import ExpertConsultModals from "../features/routines/components/ExpertConsultModals.jsx";
import AdminDashboard from "../features/admin/adminDashboard/AdminDashboard.jsx";
import UserProfilesPage from "../pages/profiles/UserProfiles.jsx";

export default function AppRoutes({ isDark, toggleTheme, onLoginSuccess, user }) {
    // Identity Check for passing props down
    const isAdmin = user?.email === 'admin@glowcare.ai';

    return (
        <Routes>
            {/* ========================================= */}
            {/* --- PUBLIC ROUTES --- */}
            {/* ========================================= */}
            <Route path="/" element={<Home isDark={isDark} toggleTheme={toggleTheme} onLoginSuccess={onLoginSuccess} user={user} />} />
            <Route path="/signup" element={<Navigate to="/sign-up" replace />} />
            <Route path="/sign-up" element={<SignUpPage isDark={isDark} />} />
            <Route path="/sign-in" element={<SignInPage isDark={isDark} onLoginSuccess={onLoginSuccess} />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler onLoginSuccess={onLoginSuccess} />} />
            <Route path="/prediction" element={<SkinPrediction isDark={isDark} />} />

            {/* 🚀 MOVED TO PUBLIC: Anyone can view the directory, but the form blocks booking if not logged in! */}
            <Route path="/appointments" element={<AppointmentHub isDark={isDark} />} />

            {/* ========================================= */}
            {/* --- PROTECTED USER ROUTES --- */}
            {/* ========================================= */}
            <Route path="/analysis" element={
                <ProtectedRoute user={user}>
                    <SkinAnalysisPage isDark={isDark} toggleTheme={toggleTheme} user={user} />
                </ProtectedRoute>
            } />

            <Route path="/analysis" element={
                <ProtectedRoute user={user}>
                    <Route path="/appointments" element={<AppointmentHub isDark={isDark} />} />
                </ProtectedRoute>
            } />

            <Route path="/timeline" element={
                <ProtectedRoute user={user}>
                    <RoutineTimelinePage isDark={isDark} toggleTheme={toggleTheme} user={user} />
                </ProtectedRoute>
            } />

            <Route path="/complete-profile" element={
                <ProtectedRoute user={user}>
                    <CompleteProfile isDark={isDark} />
                </ProtectedRoute>
            } />

            {/* --- THE CLINICAL NETWORK ROUTE --- */}
            <Route path="/experts" element={
                <ProtectedRoute user={user}>
                    <ExpertConsultModals
                        isDark={isDark}
                        isAdmin={isAdmin}
                        user={user}
                        showExpertsModal={true}
                    />
                </ProtectedRoute>
            } />

            {/* ========================================= */}
            {/* --- ADMIN ONLY: THE NEXUS ENCLAVE --- */}
            {/* ========================================= */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute user={user} requireAdmin={true}>
                    <AdminDashboard isDark={isDark} />
                </ProtectedRoute>
            } />

            <Route path="/user-profiles" element={
                <ProtectedRoute user={user} requireAdmin={true}>
                    <UserProfilesPage isDark={isDark} />
                </ProtectedRoute>
            } />

            {/* --- CATCH-ALL 404 ROUTE --- */}
            <Route path="*" element={<NotFound isDark={isDark} toggleTheme={toggleTheme} user={user} />} />
        </Routes>
    );
}