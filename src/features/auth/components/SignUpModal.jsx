import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import SignUpBanner from '../ui/SignUpBanner';
import SignUpForm from '../ui/SignUpForm';
import GoogleAuth from '../ui/GoogleAuth';
import { authService } from '../../../services/authServices.js';

export default function SignUpModal({ isDark, onClose }) {
    const navigate = useNavigate();

    // UI States
    const [role, setRole] = useState('user');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    // Updated State to include Clinical Fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        licenseNumber: '',
        expertiseArea: '', // New field for Experts
        bio: ''            // New field for Experts
    });

    const showToast = (msg, type = 'success') => {
        setNotification({ show: true, message: msg, type: type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Construct payload: Include clinical details ONLY for Expert role
        const payload = {
            ...formData,
            role: role === 'user' ? 'CLIENT' : 'EXPERT',
            licenseNumber: role === 'expert' ? formData.licenseNumber : null,
            expertiseArea: role === 'expert' ? formData.expertiseArea : null,
            bio: role === 'expert' ? formData.bio : null
        };

        try {
            const response = await authService.register(payload);

            // Store credentials for the session
            localStorage.setItem('jwt_token', response.token);
            localStorage.setItem('currentUser', JSON.stringify({
                name: response.name,
                email: response.email,
                role: response.role.toLowerCase()
            }));

            showToast("Clinical Profile Verified!", "success");

            // Redirect after brief delay for toast visibility
            setTimeout(() => {
                if (onClose) onClose();
                else navigate('/');
            }, 1500);

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Registration failed. Please check your credentials.";
            showToast(errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Notification Toast */}
            {notification.show && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] shadow-2xl border backdrop-blur-md ${
                        notification.type === 'error'
                            ? 'bg-rose-500/90 border-rose-400 text-white'
                            : 'bg-emerald-600/90 border-emerald-400 text-white'
                    }`}>
                        {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-500"
                onClick={() => onClose?.()}
            />

            {/* Modal Container */}
            <div className={`relative w-full max-w-[960px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl transition-all duration-500 ${
                isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-100'
            }`}>

                {/* Close Trigger */}
                <button
                    onClick={() => onClose?.()}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                >
                    <X size={20} />
                </button>

                {/* Left Side: Visual Banner */}
                <div className="hidden lg:block w-full">
                    <SignUpBanner />
                </div>

                {/* Right Side: Form Content */}
                <div className="flex flex-col p-4 md:p-6 overflow-y-auto max-h-[90vh] no-scrollbar">
                    <SignUpForm
                        isDark={isDark}
                        role={role}
                        setRole={setRole}
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />

                    {/* Social Auth Section */}
                    <div className="px-8 md:px-12 pb-10">
                        <div className="relative flex items-center gap-4 mb-6">
                            <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Secure Protocol</span>
                            <div className={`h-px flex-1 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                        </div>
                        <GoogleAuth
                            isDark={isDark}
                            role={role === 'user' ? 'CLIENT' : 'EXPERT'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}