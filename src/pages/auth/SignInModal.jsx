import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, X, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function SignInModal({ isDark, onClose, onLoginSuccess }) {
    const googleButtonRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailLogin = (e) => {
        e.preventDefault();
        setError('');

        const userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
        const foundUser = userProfiles.find(u => u.email === email && u.password === password);

        if (foundUser) {
            // Admin Check
            const userRole = foundUser.email === 'admin@glowcare.ai' ? 'admin' : foundUser.role;

            const sessionUser = {
                name: foundUser.name,
                picture: `https://ui-avatars.com/api/?name=${foundUser.name}&background=10b981&color=fff`,
                email: foundUser.email,
                role: userRole
            };

            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            onLoginSuccess(sessionUser);

            // --- Updated Navigation Logic for Main Admin ---
            if (userRole === 'admin') {
                navigate('/');
            } else if (foundUser.role === 'expert') {
                navigate('/routine-timeline');
            } else {
                navigate('/user-profiles', { state: { profile: foundUser } });
            }
            onClose();
        } else {
            setError('Account not found. Please check your email and password.');
        }
    };

    const handleGoogleResponse = (response) => {
        try {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const userData = JSON.parse(window.atob(base64));

            // Admin Check for Google Login
            const userRole = userData.email === 'admin@glowcare.ai' ? 'admin' : 'user';

            const googleUser = {
                name: userData.name,
                email: userData.email,
                role: userRole,
                picture: userData.picture
            };

            localStorage.setItem('currentUser', JSON.stringify(googleUser));
            onLoginSuccess(googleUser);

            // --- Updated Navigation Logic for Main Admin (Google Login) ---
            if (userRole === 'admin') {
                navigate('/');
            }

            onClose();
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        const isWebView = /wv|Version\/[\d\.]+.*Chrome/.test(navigator.userAgent) || (window.innerWidth === 0);

        if (!isWebView) {
            const script = document.createElement('script');
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.onload = () => {
                if (window.google) {
                    window.google.accounts.id.initialize({
                        client_id: "937933323614-nb2lkq6ulft6amcv41rmhd8gq71qn09e.apps.googleusercontent.com",
                        callback: handleGoogleResponse
                    });
                    window.google.accounts.id.renderButton(googleButtonRef.current, {
                        theme: isDark ? "filled_black" : "outline", size: "large", width: 320, shape: "pill"
                    });
                }
            };
            document.head.appendChild(script);
        } else {
            console.warn("Google Sign In skipped: Detected Web View environment.");
        }
    }, [isDark]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className={`relative w-full max-w-[900px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0c0c0d] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>

                <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2.5 rounded-full hover:bg-emerald-500 hover:text-white transition-all">
                    <X size={18} />
                </button>

                <div className="hidden lg:flex relative bg-emerald-950 p-12 flex-col justify-between">
                    <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="background"/>
                    <div className="relative z-10 text-white">
                        <Sparkles className="text-emerald-400 mb-6" size={32} />
                        <h2 className="text-[40px] font-black italic uppercase leading-tight tracking-tighter">Welcome <br/> Back to <br/> <span className="text-emerald-400">Glow.</span></h2>
                    </div>
                </div>

                <div className="p-10 flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Sign In</h1>
                        <p className="text-[11px] opacity-50 uppercase tracking-widest font-bold">Secure Environment Access</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleEmailLogin}>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-500">Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full py-4 pl-12 pr-5 rounded-2xl outline-none text-xs border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`} placeholder="operator@glowcare.ai" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest ml-1 text-slate-500">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                                <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full py-4 pl-12 pr-12 rounded-2xl outline-none text-xs border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`} placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-[10px] text-red-500 font-bold italic">{error}</p>}

                        <button type="submit" className="w-full bg-emerald-500 text-white py-4.5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                            Continue <ArrowRight size={16} />
                        </button>
                    </form>

                    <div className="relative my-8 flex items-center">
                        <div className="flex-grow border-t border-dashed border-slate-700/30"></div>
                        <span className="px-4 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">One-Tap Auth</span>
                        <div className="flex-grow border-t border-dashed border-slate-700/30"></div>
                    </div>

                    <div ref={googleButtonRef} className="w-full flex justify-center">
                        {window.innerWidth === 0 && <p className="text-[9px] text-red-400 font-bold">Google Sign-In requires a standard browser</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}