import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    User, Mail, ShieldCheck, Hash, Trash2, Edit3,
    ArrowLeft, Search, Plus, X, CheckCircle, AlertCircle,
    Camera, Fingerprint, Activity, Database, Leaf
} from 'lucide-react';

// --- FALLING LEAVES COMPONENT ---
const FallingLeaves = ({ isDark }) => {
    const [leaves, setLeaves] = useState([]);
    useEffect(() => {
        setLeaves(Array.from({ length: 10 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 10 + 's',
            duration: 15 + Math.random() * 10 + 's',
            size: 15 + Math.random() * 15 + 'px',
        })));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {leaves.map((leaf) => (
                <div key={leaf.id} className="absolute top-[-5%]" style={{
                    left: leaf.left,
                    animation: `fall ${leaf.duration} linear infinite`,
                    animationDelay: leaf.delay,
                }}>
                    <Leaf size={leaf.size} className={`opacity-20 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`} />
                </div>
            ))}
            <style>{`@keyframes fall { 0% { transform: translateY(0vh) rotate(0deg); } 100% { transform: translateY(110vh) rotate(360deg); } }`}</style>
        </div>
    );
};

export default function UserProfiles({ isDark }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

    // දැනට ලොග් වී සිටින පරිශීලකයා ලබා ගැනීම
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    const isAdmin = activeUser?.email === 'admin@glowcare.ai';

    useEffect(() => {
        // --- 1. ADMIN PROTECTION LOGIC ---
        if (!activeUser || !isAdmin) {
            navigate('/');
            return;
        }

        // --- 2. LOAD DATA FROM CORRECT KEYS ---
        const allSavedProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];
        const glowUsersData = JSON.parse(localStorage.getItem('glow_users')) || [];

        const combinedUsers = [...allSavedProfiles, ...glowUsersData];
        const uniqueUsers = combinedUsers.filter((v, i, a) => a.findIndex(t => t.email === v.email) === i);

        setUsers(uniqueUsers);

        if (location.state && location.state.id) {
            const newUser = {
                ...location.state,
                joinedDate: new Date().toLocaleDateString(),
                status: 'Active',
                avatar: null
            };
            const exists = uniqueUsers.find(u => u.id === newUser.id);
            if (!exists) {
                const updatedList = [newUser, ...uniqueUsers];
                setUsers(updatedList);
                localStorage.setItem('glow_users', JSON.stringify(updatedList));
                showAlert("Identity Integrated Successfully", "success");
            }
            window.history.replaceState({}, document.title);
        }
    }, [location, navigate, isAdmin]);

    const showAlert = (msg, type) => {
        setAlert({ show: true, msg, type });
        setTimeout(() => setAlert({ show: false, msg: '', type: '' }), 3000);
    };

    const deleteUser = (id) => {
        if (!isAdmin) return; // Protection
        const filtered = users.filter(u => u.id !== id);
        setUsers(filtered);
        localStorage.setItem('glow_users', JSON.stringify(filtered));
        localStorage.setItem('userProfiles', JSON.stringify(filtered));
        showAlert("Identity Terminated", "error");
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!isAdmin) return; // Protection
        const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
        setUsers(updatedUsers);
        localStorage.setItem('glow_users', JSON.stringify(updatedUsers));
        localStorage.setItem('userProfiles', JSON.stringify(updatedUsers));
        setEditingUser(null);
        showAlert("Sync Complete", "success");
    };

    const handleAvatarUpload = (e, userId) => {
        if (!isAdmin) return; // Protection
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedUsers = users.map(u => u.id === userId ? { ...u, avatar: reader.result } : u);
                setUsers(updatedUsers);
                localStorage.setItem('glow_users', JSON.stringify(updatedUsers));
                localStorage.setItem('userProfiles', JSON.stringify(updatedUsers));
                showAlert("Biometric Image Updated", "success");
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`relative min-h-screen p-6 md:px-12 md:py-8 transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>

            <FallingLeaves isDark={isDark} />

            {alert.show && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[250] animate-in zoom-in-95 duration-300">
                    <div className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] shadow-2xl border backdrop-blur-3xl ${
                        alert.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
                    }`}>
                        <div className={`p-2.5 rounded-full ${alert.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                            {alert.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                        </div>
                        <span className="font-black uppercase tracking-[0.2em] text-[12px]">{alert.msg}</span>
                    </div>
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 mb-10">
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500 transition-all group-hover:text-white text-emerald-500">
                            <ArrowLeft size={24} />
                        </div>
                        <span className="font-black uppercase tracking-[0.3em] text-[12px] opacity-60 group-hover:opacity-100">Back</span>
                    </div>

                    <div className="text-center flex-1">
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-3">
                            User <span className="text-emerald-500 not-italic font-serif">Nexus.</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4 opacity-50">
                            <div className="flex items-center gap-2"><Database size={14}/> <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{users.length} Records</span></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                            <div className="flex items-center gap-2"><Activity size={14}/> <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Live</span></div>
                        </div>
                    </div>

                    <div className={`relative flex items-center p-1.5 rounded-2xl border transition-all w-full md:w-72 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <Search className="ml-4 opacity-40 text-emerald-500" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH IDENTITY..."
                            className="bg-transparent pl-4 pr-5 py-3 outline-none font-black text-[11px] uppercase tracking-widest w-full"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <hr className="mb-12 border-white/5" />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {filteredUsers.map((user) => (
                        <div key={user.id || user.email} className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-[3.2rem] blur opacity-0 group-hover:opacity-100 transition duration-700"></div>

                            <div className={`relative h-full rounded-[3rem] border overflow-hidden transition-all duration-500 ${isDark ? 'bg-[#0A0A0B]/80 backdrop-blur-md border-white/10' : 'bg-white/90 backdrop-blur-md border-slate-100 shadow-xl shadow-slate-200/50'}`}>

                                <div className={`h-24 relative ${isDark ? 'bg-emerald-950/20' : 'bg-emerald-50'}`}>
                                    <div className="absolute top-7 right-8 flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Identity Verified</span>
                                    </div>
                                </div>

                                <div className="absolute top-8 left-8">
                                    <div className="relative group/avatar">
                                        <div className="w-24 h-24 rounded-[2rem] border-[5px] border-[#0A0A0B] overflow-hidden bg-slate-800 shadow-2xl">
                                            {user.avatar || user.picture ? (
                                                <img src={user.avatar || user.picture} className="w-full h-full object-cover" alt="avatar" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-emerald-500/20 text-emerald-500">
                                                    <Fingerprint size={40} />
                                                </div>
                                            )}
                                        </div>
                                        {/* Avatar Upload (Admin Only) */}
                                        {isAdmin && (
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer rounded-[2rem]">
                                                <Camera size={28} className="text-white" />
                                                <input type="file" hidden onChange={(e) => handleAvatarUpload(e, user.id)} />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="p-9 pt-12">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter truncate leading-tight">{user.name}</h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">{user.role || 'User'}</span>
                                            <span className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em]">REF: {user.id?.slice(-6) || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Network Email</span>
                                                <Mail size={14} className="text-emerald-500" />
                                            </div>
                                            <p className="text-[12px] font-bold truncate tracking-wide">{user.email}</p>
                                        </div>

                                        {user.role === 'expert' && user.license && (
                                            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Security License</span>
                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                </div>
                                                <p className="text-[12px] font-black text-emerald-600 tracking-[0.15em] uppercase truncate">{user.license}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons (Admin Only) */}
                                    {isAdmin && (
                                        <div className="flex gap-3 pt-6 border-t border-white/5">
                                            <button
                                                onClick={() => setEditingUser(user)}
                                                className="flex-[3] flex items-center justify-center gap-3 py-4.5 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                                            >
                                                <Edit3 size={16} /> Sync Profile
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className={`flex-1 flex items-center justify-center rounded-2xl border transition-all ${isDark ? 'border-white/10 hover:bg-red-500 hover:border-red-500 text-white' : 'border-slate-200 hover:bg-red-500 hover:border-red-500 hover:text-white'}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {editingUser && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-xl">
                        <div className="absolute inset-0 bg-black/70" onClick={() => setEditingUser(null)} />
                        <div className={`relative w-full max-w-xl p-12 rounded-[3.5rem] border shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-200'}`}>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-10 text-center">Override <span className="text-emerald-500">Identity.</span></h2>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-3">Full Legal Name</label>
                                    <input
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                        className={`w-full p-6 rounded-2xl border outline-none font-bold text-sm transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500' : 'bg-slate-50 border-slate-100 focus:border-emerald-500'}`}
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-3">Access Email Address</label>
                                    <input
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                        className={`w-full p-6 rounded-2xl border outline-none font-bold text-sm transition-all ${isDark ? 'bg-white/5 border-white/5 focus:border-emerald-500' : 'bg-slate-50 border-slate-100 focus:border-emerald-500'}`}
                                    />
                                </div>
                                <div className="flex gap-5 mt-10">
                                    <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] opacity-50 hover:opacity-100 transition-all">Abort</button>
                                    <button className="flex-[2] bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-emerald-500/30">Commit Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}