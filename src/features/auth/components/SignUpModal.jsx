import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

import SignUpBanner from '../ui/SignUpBanner';
import SignUpForm from '../ui/SignUpForm';

export default function SignUpModal({ isDark, onClose }) {
    const navigate = useNavigate();

    const [role, setRole] = useState('user');
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        license: '',
        role: 'user'
    });

    const showToast = (msg, type = 'success') => {
        setNotification({ show: true, message: msg, type: type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const existingUsers = JSON.parse(localStorage.getItem('userProfiles')) || [];
        const storedExperts = JSON.parse(localStorage.getItem('glow_experts')) || [];

        const userExists = existingUsers.find(u => u.email === formData.email);
        const expertExists = storedExperts.find(e => e.email === formData.email);

        if (userExists || expertExists) {
            showToast("This email is already registered!", "error");
            return;
        }

        if (role === 'user') {
            const newUser = {
                ...formData,
                role: 'user',
                createdAt: new Date().toISOString()
            };
            const updatedUsers = [...existingUsers, newUser];
            localStorage.setItem('userProfiles', JSON.stringify(updatedUsers));
        } else if (role === 'expert') {
            const newExpertEntry = {
                id: formData.id || Date.now(),
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: "Clinical Expert",
                license: formData.license,
                bio: `Licensed professional (ID: ${formData.license}). Available for skin consultations.`
            };

            const updatedExpertList = [...storedExperts, newExpertEntry];
            localStorage.setItem('glow_experts', JSON.stringify(updatedExpertList));
        }

        showToast(`Account Created Successfully for ${formData.name}!`, "success");

        setTimeout(() => {
            navigate('/');
            // Check if onClose was provided (it might not be if accessed via direct URL)
            if (onClose) onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Notification Toast */}
            {notification.show && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] shadow-2xl backdrop-blur-xl border ${notification.type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' : 'bg-emerald-600/90 border-emerald-400 text-white'}`}>
                        {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                        <span className="text-xs font-black uppercase tracking-wider">{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => { if(onClose) onClose(); else navigate('/'); }} />

            {/* Modal Container */}
            <div className={`relative w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-100'}`}>

                <button onClick={() => { if(onClose) onClose(); else navigate('/'); }} className={`absolute top-6 right-6 z-50 p-2 rounded-full transition-colors ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                    <X size={20} />
                </button>

                <SignUpBanner />

                <SignUpForm
                    isDark={isDark}
                    role={role}
                    setRole={setRole}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />
            </div>
        </div>
    );
}