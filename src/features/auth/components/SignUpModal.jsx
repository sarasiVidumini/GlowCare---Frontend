import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'; // Added Loader2 for loading state

import SignUpBanner from '../ui/SignUpBanner';
import SignUpForm from '../ui/SignUpForm';
import { authService } from '../../../services/authService'; // IMPORT YOUR SERVICE

export default function SignUpModal({ isDark, onClose }) {
    const navigate = useNavigate();

    const [role, setRole] = useState('user');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const [formData, setFormData] = useState({
        id: '', // Used for UI visuals only
        name: '',
        email: '',
        password: '',
        license: ''
    });

    const showToast = (msg, type = 'success') => {
        setNotification({ show: true, message: msg, type: type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Map frontend role to Spring Boot Role Enum
        const backendRole = role === 'user' ? 'CLIENT' : 'EXPERT';

        // Prepare data for the Spring Boot RegisterRequest DTO
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: backendRole,
            licenseNumber: role === 'expert' ? formData.license : null // Send license only if expert
        };

        try {
            // Call our new Service!
            const response = await authService.register(payload);

            // Save the JWT token returned by Spring Boot
            localStorage.setItem('jwt_token', response.token);

            // Save user info for UI purposes
            const sessionUser = {
                name: response.name,
                email: response.email,
                role: response.role.toLowerCase()
            };
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));

            showToast(response.message || `Account Created Successfully!`, "success");

            setTimeout(() => {
                navigate('/');
                if (onClose) onClose();
            }, 1500);

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

            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => { if(onClose) onClose(); else navigate('/'); }} />

            <div className={`relative w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-100'}`}>

                <button onClick={() => { if(onClose) onClose(); else navigate('/'); }} className={`absolute top-6 right-6 z-50 p-2 rounded-full transition-colors ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                    <X size={20} />
                </button>

                <SignUpBanner />

                {/* NOTE: You might want to pass isLoading to SignUpForm to disable the submit button while waiting */}
                <SignUpForm
                    isDark={isDark}
                    role={role}
                    setRole={setRole}
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}