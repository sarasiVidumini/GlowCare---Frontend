import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

import LoginForm from '../ui/LoginForm';
import GoogleAuth from '../ui/GoogleAuth';
import SignInBanner from '../ui/SignInBanner';
import { authService } from '../../../services/authServices.js'; // IMPORT YOUR SERVICE

export default function SignInModal({ isDark, onClose, onLoginSuccess }) {
    const navigate = useNavigate();

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- LOGIC: Email / Password ---
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Call the Spring Boot backend
            const response = await authService.login({ email, password });

            // 1. Save the JWT Token
            localStorage.setItem('jwt_token', response.token);

            // 2. Format user for UI state
            const sessionUser = {
                name: response.name,
                picture: `https://ui-avatars.com/api/?name=${response.name.replace(' ', '+')}&background=10b981&color=fff`,
                email: response.email,
                role: response.role.toLowerCase()
            };

            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            if (onLoginSuccess) onLoginSuccess(sessionUser);

            // 3. Navigation Logic based on backend role
            if (sessionUser.role === 'admin') {
                navigate('/user-profiles');
            } else if (sessionUser.role === 'expert' || sessionUser.role === 'doctor') {
                navigate('/timeline'); // Updated route based on your router setup
            } else {
                navigate('/');
            }

            if (onClose) onClose();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { if(onClose) onClose(); else navigate('/'); }} />

            <div className={`relative w-full max-w-[900px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0c0c0d] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>

                <button onClick={() => { if(onClose) onClose(); else navigate('/'); }} className={`absolute top-6 right-6 z-50 p-2.5 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
                    <X size={18} />
                </button>

                <SignInBanner />

                <div className="p-10 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Sign In</h1>
                        <p className="text-[11px] opacity-50 uppercase tracking-widest font-bold mt-1">Secure Environment Access</p>
                    </div>

                    <LoginForm
                        isDark={isDark}
                        email={email} setEmail={setEmail}
                        password={password} setPassword={setPassword}
                        showPassword={showPassword} setShowPassword={setShowPassword}
                        handleEmailLogin={handleEmailLogin}
                        error={error}
                        isLoading={isLoading} // Pass down to disable button
                    />

                    <div className="relative my-8 flex items-center">
                        <div className="flex-grow border-t border-dashed border-slate-700/30"></div>
                        <span className="px-4 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">One-Tap Auth</span>
                        <div className="flex-grow border-t border-dashed border-slate-700/30"></div>
                    </div>

                    {/* Google Auth now handles everything securely via Spring Boot! */}
                    <GoogleAuth isDark={isDark} />

                </div>
            </div>
        </div>
    );
}