import React from 'react';
import { User, Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Hash } from 'lucide-react';

export default function SignUpForm({
                                       isDark,
                                       role,
                                       setRole,
                                       formData,
                                       handleChange,
                                       handleSubmit,
                                       showPassword,
                                       setShowPassword,
                                       isLoading // Added to handle button state
                                   }) {
    return (
        <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
                <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-0.5">Get Started</h1>
                <p className={`text-[10px] font-bold opacity-50 tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Secure premium clinical access.
                </p>
            </div>

            {/* Role Switcher */}
            <div className={`flex p-1 rounded-2xl mb-6 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${role === 'user' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 opacity-60'}`}
                >
                    <User size={12} /> User
                </button>
                <button
                    type="button"
                    onClick={() => setRole('expert')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${role === 'expert' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 opacity-60'}`}
                >
                    <Briefcase size={12} /> Expert
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name || ''}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`}
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email || ''}
                            onChange={handleChange}
                            placeholder="name@clinic.com"
                            className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`}
                        />
                    </div>
                </div>

                {/* License Number (Expert Only) - name matches licenseNumber in formData */}
                {role === 'expert' && (
                    <div className="space-y-1 animate-in slide-in-from-left-4 duration-300">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">License No</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                            <input
                                type="text"
                                name="licenseNumber"
                                required
                                value={formData.licenseNumber || ''}
                                onChange={handleChange}
                                placeholder="SLMC-XXXXX"
                                className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`}
                            />
                        </div>
                    </div>
                )}

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password || ''}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full py-3 pl-11 pr-11 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-emerald-500 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Processing...' : `Create ${role}`} <ArrowRight size={14} />
                </button>
            </form>
        </div>
    );
}