import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

import LoginForm from '../ui/LoginForm';
import GoogleAuth from '../ui/GoogleAuth';
import SignInBanner from '../ui/SignInBanner';
import { authService } from '../../../services/authServices.js';

export default function SignInModal({ isDark, onClose, onLoginSuccess }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Added for the Eye icon
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authService.login({ email, password });
            localStorage.setItem('jwt_token', response.token);

            const sessionUser = {
                name: response.name,
                email: response.email,
                role: response.role.toLowerCase(),
                picture: `https://ui-avatars.com/api/?name=${response.name.replace(' ', '+')}&background=10b981&color=fff`
            };

            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            if (onLoginSuccess) onLoginSuccess(sessionUser);

            // Redirection logic
            if (sessionUser.role === 'admin') {
                navigate('/user-profiles');
            } else if (sessionUser.role === 'expert' || sessionUser.role === 'doctor') {
                navigate('/timeline');
            } else {
                navigate('/analysis');
            }

            if (onClose) onClose();
        } catch (err) {
            // Handle Axios response errors
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => onClose?.()} />

            <div className={`relative w-full max-w-[900px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl ${isDark ? 'bg-[#0c0c0d] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <button onClick={() => onClose?.()} className="absolute top-6 right-6 z-50 p-2.5 rounded-full hover:bg-white/10 transition-all">
                    <X size={18} />
                </button>

                <SignInBanner />

                <div className="p-10 flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Sign In</h1>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Secure Clinical Access</p>
                    </div>

                    <LoginForm
                        isDark={isDark}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        handleEmailLogin={handleEmailLogin}
                        error={error}
                        isLoading={isLoading}
                    />

                    <div className="relative my-8 flex items-center">
                        <div className="flex-grow border-t border-dashed border-slate-700/30"></div>
                        <span className="px-4 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">One-Tap Auth</span>
                        <div className="flex-grow border-t border-dashed border-slate-700/30"></div>
                    </div>
                    <GoogleAuth isDark={isDark} />
                </div>
            </div>
        </div>
    );
}