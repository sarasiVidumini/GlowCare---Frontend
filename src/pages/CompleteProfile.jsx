import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authServices';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function CompleteProfile({ isDark }) {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const handleFinish = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = user.role === 'expert' ? { licenseNumber: value } : { skinType: value };
            await authService.completeProfile(payload);
            navigate('/');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>
            <div className={`w-full max-w-md p-10 rounded-[2.5rem] border shadow-2xl ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-200'}`}>
                <h2 className="text-2xl font-black uppercase mb-6">Complete your profile</h2>
                <form onSubmit={handleFinish} className="space-y-6">
                    {user?.role === 'expert' ? (
                        <input required className="w-full p-4 rounded-xl border bg-transparent" placeholder="Professional License ID" onChange={e => setValue(e.target.value)} />
                    ) : (
                        <select required className="w-full p-4 rounded-xl border bg-transparent text-slate-500" onChange={e => setValue(e.target.value)}>
                            <option value="">Select Skin Type</option>
                            <option value="Oily">Oily</option><option value="Dry">Dry</option><option value="Combination">Combination</option>
                        </select>
                    )}
                    <button className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />} Finish
                    </button>
                </form>
            </div>
        </div>
    );
}