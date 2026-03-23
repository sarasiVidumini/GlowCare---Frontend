import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

import LoginForm from '../ui/LoginForm';
import GoogleAuth from '../ui/GoogleAuth';
import SignInBanner from '../ui/SignInBanner'; // Imported our new banner!

export default function SignInModal({ isDark, onClose, onLoginSuccess }) {
    const navigate = useNavigate();
    const googleButtonRef = useRef(null);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // --- LOGIC: Email / Password ---
    const handleEmailLogin = (e) => {
        e.preventDefault();
        setError('');

        const userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
        const foundUser = userProfiles.find(u => u.email === email && u.password === password);

        if (foundUser) {
            const userRole = foundUser.email === 'admin@glowcare.ai' ? 'admin' : foundUser.role;

            const sessionUser = {
                name: foundUser.name,
                picture: `https://ui-avatars.com/api/?name=${foundUser.name}&background=10b981&color=fff`,
                email: foundUser.email,
                role: userRole
            };

            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            if (onLoginSuccess) onLoginSuccess(sessionUser);

            // Navigation Logic
            if (userRole === 'admin') {
                navigate('/');
            } else if (foundUser.role === 'expert') {
                navigate('/routine-timeline');
            } else {
                navigate('/user-profiles', { state: { profile: foundUser } });
            }
            if (onClose) onClose();
        } else {
            setError('Account not found. Please check your credentials.');
        }
    };

    // --- LOGIC: Google Sign-In ---
    const handleGoogleResponse = useCallback((response) => {
        try {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const userData = JSON.parse(window.atob(base64));

            const userRole = userData.email === 'admin@glowcare.ai' ? 'admin' : 'user';

            const googleUser = {
                name: userData.name,
                email: userData.email,
                role: userRole,
                picture: userData.picture
            };

            localStorage.setItem('currentUser', JSON.stringify(googleUser));
            if (onLoginSuccess) onLoginSuccess(googleUser);

            if (userRole === 'admin') {
                navigate('/');
            }

            if (onClose) onClose();
        } catch (err) {
            console.error("Google Auth Error:", err);
            setError("Failed to authenticate with Google.");
        }
    }, [navigate, onClose, onLoginSuccess]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { if(onClose) onClose(); else navigate('/'); }} />

            <div className={`relative w-full max-w-[900px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0c0c0d] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>

                <button onClick={() => { if(onClose) onClose(); else navigate('/'); }} className={`absolute top-6 right-6 z-50 p-2.5 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
                    <X size={18} />
                </button>

                {/* Extracted Banner Component */}
                <SignInBanner />

                <div className="p-10 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Sign In</h1>
                        <p className="text-[11px] opacity-50 uppercase tracking-widest font-bold mt-1">Secure Environment Access</p>
                    </div>

                    {/* Extracted Form Component */}
                    <LoginForm
                        isDark={isDark}
                        email={email} setEmail={setEmail}
                        password={password} setPassword={setPassword}
                        showPassword={showPassword} setShowPassword={setShowPassword}
                        handleEmailLogin={handleEmailLogin}
                        error={error}
                    />

                    <div className="relative my-8 flex items-center">
                        <div className="flex-grow border-t border-dashed border-slate-700/30"></div>
                        <span className="px-4 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">One-Tap Auth</span>
                        <div className="flex-grow border-t border-dashed border-slate-700/30"></div>
                    </div>

                    {/* Extracted Google Component */}
                    <GoogleAuth
                        isDark={isDark}
                        googleButtonRef={googleButtonRef}
                        handleGoogleResponse={handleGoogleResponse}
                    />
                </div>
            </div>
        </div>
    );
}