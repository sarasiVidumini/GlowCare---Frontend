import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Briefcase, Mail, Lock, Eye, EyeOff,
    ArrowRight, Fingerprint, Sparkles, ShieldCheck, X, Hash
} from 'lucide-react';

export default function SignUpModal({ isDark, onClose }) {
    const [role, setRole] = useState('user');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Form data state
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        license: '',
        role: 'user'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. කලින් සේව් කරපු users ලා ගන්නවා
        const existingUsers = JSON.parse(localStorage.getItem('userProfiles')) || [];

        // 2. Email Validation
        const userExists = existingUsers.find(u => u.email === formData.email);
        if (userExists) {
            alert("This email is already registered!");
            return;
        }

        // 3. අලුත් User/Expert Object එක (Role එකත් එක්කම)
        const newUser = {
            ...formData,
            role: role,
            createdAt: new Date().toISOString()
        };

        const updatedUsers = [...existingUsers, newUser];

        // 4. LocalStorage එකට සේව් කිරීම
        localStorage.setItem('userProfiles', JSON.stringify(updatedUsers));

        alert(`Account Created Successfully for ${formData.name}!`);

        // 5. Navigate Logic - Expert නම් Timeline එකට, User නම් Profile එකට
        if (role === 'expert') {
            navigate('/routine-timeline', { state: { profile: newUser } });
        } else {
            navigate('/user-profiles', { state: { profile: newUser } });
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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