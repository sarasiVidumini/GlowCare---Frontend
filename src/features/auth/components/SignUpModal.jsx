import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import SignUpBanner from '../ui/SignUpBanner';
import SignUpForm from '../ui/SignUpForm';
import GoogleAuth from '../ui/GoogleAuth';
import { authService } from '../../../services/authServices.js';

export default function SignUpModal({ isDark, onClose }) {
    const navigate = useNavigate();
    const [role, setRole] = useState('user');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [formData, setFormData] = useState({ name: '', email: '', password: '', licenseNumber: '' });

    const showToast = (msg, type = 'success') => {
        setNotification({ show: true, message: msg, type: type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = { ...formData, role: role === 'user' ? 'CLIENT' : 'EXPERT', licenseNumber: role === 'expert' ? formData.licenseNumber : null };
        try {
            const response = await authService.register(payload);
            localStorage.setItem('jwt_token', response.token);
            localStorage.setItem('currentUser', JSON.stringify({ name: response.name, email: response.email, role: response.role.toLowerCase() }));
            showToast("Account Created Successfully!", "success");
            setTimeout(() => { if (onClose) onClose(); else navigate('/'); }, 1500);
        } catch (error) {
            showToast(error.response?.data?.message || "Registration failed.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {notification.show && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-4">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] shadow-2xl border ${notification.type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' : 'bg-emerald-600/90 border-emerald-400 text-white'}`}>
                        {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                        <span className="text-xs font-black uppercase tracking-wider">{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => onClose?.()} />

            <div className={`relative w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-100'}`}>

                {/* STRICT CLOSE BUTTON TRIGGER */}
                <button onClick={() => onClose?.()} className="absolute top-6 right-6 z-50 p-2 rounded-full text-slate-500 hover:text-emerald-500 transition-colors">
                    <X size={20} />
                </button>

                <div className="hidden lg:block w-full"><SignUpBanner /></div>

                <div className="flex flex-col p-8 md:p-10 overflow-y-auto max-h-[90vh]">
                    <SignUpForm
                        isDark={isDark} role={role} setRole={setRole} formData={formData}
                        handleChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        handleSubmit={handleSubmit} isLoading={isLoading} showPassword={showPassword} setShowPassword={setShowPassword}
                    />
                    <div className="mt-6"><GoogleAuth isDark={isDark} role={role === 'user' ? 'CLIENT' : 'EXPERT'} /></div>
                </div>
            </div>
        </div>
    );
}