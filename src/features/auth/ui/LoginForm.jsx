import React from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginForm({ isDark, email, setEmail, password, setPassword, showPassword, setShowPassword, handleEmailLogin, error }) {
    return (
        <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-500">Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full py-4 pl-12 pr-5 rounded-2xl outline-none text-xs border transition-colors ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`}
                        placeholder="operator@glowcare.ai"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-500">Security Key</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                    <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full py-4 pl-12 pr-12 rounded-2xl outline-none text-xs border transition-colors ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500/50' : 'bg-slate-50 border-slate-100 focus:border-emerald-200'}`}
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors">
                        {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                </div>
            </div>

            {error && <p className="text-[10px] text-red-500 font-bold italic mt-2 text-center animate-in slide-in-from-top-1">{error}</p>}

            <button type="submit" className="w-full mt-6 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                Continue <ArrowRight size={16} />
            </button>
        </form>
    );
}