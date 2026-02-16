import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import SkinAnalysis from "../pages/skin/SkinAnalysis";
import RoutineTimeline from "../pages/timelines/RoutineTimeline";
import Appointments from "../pages/appoinment/Appoinments";
import SignUp from "../pages/auth/SignUp.jsx";
import UserProfiles from "../pages/profiles/UserProfiles";
import SkinPrediction from "../pages/prediction/SkinPrediction"; // අලුත් Chart Page එක Import කළා
import SignInModal from "../pages/auth/SignInModal.jsx";

export default function AppRoute({ isDark, toggleTheme, onLoginSuccess, user, isSignInOpen, setIsSignInOpen }) {
    return (
        <>
            {/* මුළු සයිට් එකටම පොදු සිග්න් ඉන් පොපප් එක */}
            {isSignInOpen && (
                <SignInModal
                    isDark={isDark}
                    onClose={() => setIsSignInOpen(false)}
                    onLoginSuccess={onLoginSuccess}
                />
            )}

            <Routes>
                <Route path="/" element={<Home isDark={isDark} toggleTheme={toggleTheme} onLoginSuccess={onLoginSuccess} setIsSignInOpen={setIsSignInOpen} />} />
                <Route path="/signup" element={<SignUp isDark={isDark} />} />
                <Route path="/analysis" element={<SkinAnalysis isDark={isDark} />} />
                <Route path="/timeline" element={<RoutineTimeline isDark={isDark} />} />
                <Route path="/appointments" element={<Appointments isDark={isDark} />} />

                {/* අලුතින් එක් කළ Prediction Route එක */}
                <Route path="/prediction" element={<SkinPrediction isDark={isDark} />} />

                <Route
                    path="/user-profiles"
                    element={
                        user && user.email === 'admin@glowcare.ai'
                            ? <UserProfiles isDark={isDark} />
                            : <Navigate to="/" replace />
                    }
                />
            </Routes>
        </>
    );
}