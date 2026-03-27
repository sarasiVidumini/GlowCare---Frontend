import React from 'react';
import { User, Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Stethoscope, FileText } from 'lucide-react';

export default function SignUpForm({
                                       isDark,
                                       role,
                                       setRole,
                                       formData,
                                       handleChange,
                                       handleSubmit,
                                       showPassword,
                                       setShowPassword,
                                       isLoading
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
                {/* Full Name & Email (Standard Fields) */}
                <div className="space-y-3.5">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                            <input type="text" name="name" required value={formData.name || ''} onChange={handleChange} placeholder="Full Name" className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                            <input type="email" name="email" required value={formData.email || ''} onChange={handleChange} placeholder="name@clinic.com" className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`} />
                        </div>
                    </div>
                </div>

                {/* Expert Only Section */}
                {role === 'expert' && (
                    <div className="space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">License No</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                    <input type="text" name="licenseNumber" required value={formData.licenseNumber || ''} onChange={handleChange} placeholder="SLMC-XXXXX" className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-[10px] border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Expertise Area</label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                    <select name="expertiseArea" required value={formData.expertiseArea || ''} onChange={handleChange} className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-[10px] border appearance-none transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`}>
                                        <option value="" disabled className={isDark ? 'bg-[#0A0A0B]' : 'bg-white'}>Select Specialty</option>
                                        <option value="Dermatologist" className={isDark ? 'bg-[#0A0A0B]' : 'bg-white'}>Dermatologist</option>
                                        <option value="Cosmetologist" className={isDark ? 'bg-[#0A0A0B]' : 'bg-white'}>Cosmetologist</option>
                                        <option value="Skin Therapist" className={isDark ? 'bg-[#0A0A0B]' : 'bg-white'}>Skin Therapist</option>
                                        <option value="Product Chemist" className={isDark ? 'bg-[#0A0A0B]' : 'bg-white'}>Product Chemist</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Bio</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 text-emerald-500" size={16} />
                                <textarea name="bio" required value={formData.bio || ''} onChange={handleChange} placeholder="Briefly describe your clinical experience..." className={`w-full py-3 pl-11 pr-4 rounded-xl outline-none font-bold text-[10px] border h-20 resize-none transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Password Section */}
                <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                        <input name="password" type={showPassword ? "text" : "password"} required value={formData.password || ''} onChange={handleChange} placeholder="••••••••" className={`w-full py-3 pl-11 pr-11 rounded-xl outline-none font-bold text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50 text-white' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors">
                            {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className={`w-full bg-emerald-500 text-white py-3.5 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-xl shadow-emerald-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {isLoading ? 'Processing...' : `Register ${role}`} <ArrowRight size={14} />
                </button>
            </form>
        </div>
    );
}