import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Briefcase, Mail, Lock, Eye, EyeOff,
    ArrowRight, Fingerprint, Sparkles, ShieldCheck, X, Hash, AlertCircle, CheckCircle2
} from 'lucide-react';

export default function SignUpModal({ isDark, onClose }) {
    const [role, setRole] = useState('user');
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const navigate = useNavigate();

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

        // පවතින email එකක්දැයි පරීක්ෂා කිරීම (Users හෝ Experts දෙගොල්ලන්ගෙම)
        const userExists = existingUsers.find(u => u.email === formData.email);
        const expertExists = storedExperts.find(e => e.email === formData.email);

        if (userExists || expertExists) {
            showToast("This email is already registered!", "error");
            return;
        }

        if (role === 'user') {
            // User කෙනෙක් නම් පමණක් userProfiles වලට add කරයි
            const newUser = {
                ...formData,
                role: 'user',
                createdAt: new Date().toISOString()
            };
            const updatedUsers = [...existingUsers, newUser];
            localStorage.setItem('userProfiles', JSON.stringify(updatedUsers));
        } else if (role === 'expert') {
            // Expert කෙනෙක් නම් glow_experts වලට පමණක් add කරයි
            const newExpertEntry = {
                id: formData.id || Date.now(),
                name: formData.name,
                email: formData.email,
                password: formData.password, // Login වීමට අවශ්‍ය නම් password එකද මෙහි තබාගත හැක
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
            onClose();
        }, 1500);
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

            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

            <div className={`relative w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-100'}`}>

                <button onClick={onClose} className={`absolute top-6 right-6 z-50 p-2 rounded-full transition-colors ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                    <X size={20} />
                </button>

                <div className="hidden lg:flex relative overflow-hidden bg-emerald-600">
                    <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80" alt="Skin Care" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />
                    <div className="relative z-10 p-10 flex flex-col justify-between h-full text-white">
                        <div>
                            <div className="flex items-center gap-2.5 mb-4"><Fingerprint size={28} className="text-emerald-300" /><span className="font-black uppercase tracking-[0.3em] text-[9px]">Clinical Hub</span></div>
                            <h2 className="text-[36px] font-black italic leading-[1.1] uppercase tracking-tighter">Join the <br/> <span className="text-emerald-300 font-serif text-[40px]">Luxury</span> <br/> Network.</h2>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-0.5">Get Started</h1>
                        <p className={`text-[10px] font-bold opacity-50 tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Secure premium clinical access.</p>
                    </div>

                    <div className={`flex p-1 rounded-2xl mb-6 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                        <button type="button" onClick={() => setRole('user')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${role === 'user' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 opacity-60'}`}><User size={12} /> User</button>
                        <button type="button" onClick={() => setRole('expert')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${role === 'expert' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 opacity-60'}`}><Briefcase size={12} /> Expert</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">{role === 'user' ? 'User ID' : 'Expert ID'}</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                <input type="text" name="id" required value={formData.id} onChange={handleChange} placeholder={role === 'user' ? "U-100X" : "E-500X"} className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="name@clinic.com" className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`} />
                            </div>
                        </div>

                        {role === 'expert' && (
                            <div className="space-y-1 animate-in slide-in-from-left-4">
                                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">License No</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                    <input type="text" name="license" required value={formData.license} onChange={handleChange} placeholder="SLMC-XXXXX" className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full py-3 pl-11 pr-11 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors">
                                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-emerald-500 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
                            Create {role} <ArrowRight size={14} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}