import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

import SignUpBanner from '../ui/SignUpBanner';
import SignUpForm from '../ui/SignUpForm';
import GoogleAuth from '../ui/GoogleAuth';
import { authService } from '../../../services/authServices.js';

export default function SignUpModal({ isDark, onClose }) {
    const navigate = useNavigate();
    const [role, setRole] = useState('user'); // 'user' or 'expert'
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', license: ''
    });

    const showToast = (msg, type = 'success') => {
        setNotification({ show: true, message: msg, type: type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const backendRole = role === 'user' ? 'CLIENT' : 'EXPERT';

        try {
            const response = await authService.register({
                ...formData,
                role: backendRole,
                licenseNumber: role === 'expert' ? formData.license : null
            });

            localStorage.setItem('jwt_token', response.token);
            const sessionUser = { name: response.name, email: response.email, role: response.role.toLowerCase() };
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));

            showToast("Account Created Successfully!", "success");
            setTimeout(() => { navigate('/'); if (onClose) onClose(); }, 1500);
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {notification.show && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] shadow-2xl backdrop-blur-xl border ${notification.type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' : 'bg-emerald-600/90 border-emerald-400 text-white'}`}>
                        {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                        <span className="text-xs font-black uppercase tracking-wider">{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => onClose?.() || navigate('/')} />

            <div className={`relative w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-100'}`}>
                <button onClick={() => onClose?.() || navigate('/')} className="absolute top-6 right-6 z-50 p-2 rounded-full text-slate-500 hover:text-emerald-500 transition-colors">
                    <X size={20} />
                </button>

                <SignUpBanner />

                <div className="flex flex-col p-10">
                    <SignUpForm
                        isDark={isDark} role={role} setRole={setRole}
                        formData={formData} handleChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                        handleSubmit={handleSubmit} isLoading={isLoading}
                    />

                    {/* Role-aware Google Login */}
                    <div className="mt-6">
                        <GoogleAuth isDark={isDark} role={role === 'user' ? 'CLIENT' : 'EXPERT'} />
                    </div>
                </div>
            </div>
        </div>
    );
}