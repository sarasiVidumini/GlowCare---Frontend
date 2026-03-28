import React, { useState, useEffect } from 'react';
import { X, Search, User } from 'lucide-react';
import axios from 'axios';
import PrivateChatModal from './expert/PrivateChatModal.jsx';

export default function ExpertConsultModals({ isDark, showExpertsModal, setShowExpertsModal }) {

    const activeUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('activeUser'));
    const isAdmin = activeUser?.email === 'admin@glowcare.ai';

    const [experts, setExperts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [privateChat, setPrivateChat] = useState({ open: false, expert: null });

    useEffect(() => {
        if (!showExpertsModal) return;

        const fetchExperts = async () => {
            try {
                const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const res = await axios.get('http://localhost:8080/api/v1/users', { headers });
                const expertUsers = res.data.filter(u => u.role === 'EXPERT');
                setExperts(expertUsers);
            } catch (error) {
                console.error("Failed to fetch experts:", error);
            }
        };
        fetchExperts();
    }, [showExpertsModal]);

    const openPrivateChat = (expert) => {
        setPrivateChat({ open: true, expert: expert });
        setShowExpertsModal(false);
    };

    const getExpertDetails = (name) => {
        if (name.toLowerCase().includes("ruvinda")) return { title: "Skin Therapist", desc: "10 years experience in skin therapy" };
        if (name.toLowerCase().includes("thilina")) return { title: "Product Chemist", desc: "Medical Degree - Sri Jayawardanapura Univ." };
        return { title: "Clinical Specialist", desc: "Certified GlowCare Professional" };
    };

    const filteredExperts = experts.filter(exp => exp.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            {showExpertsModal && (
                <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className={`w-full max-w-4xl p-8 rounded-[3rem] border shadow-2xl relative ${isDark ? 'bg-[#0D0D0F] border-white/10' : 'bg-[#FBFBFD] border-slate-200'}`}>

                        <button onClick={() => setShowExpertsModal(false)} className={`absolute top-8 right-8 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-500' : 'hover:bg-slate-200 text-slate-400'}`}>
                            <X size={20} />
                        </button>

                        <h2 className={`text-3xl font-black italic uppercase mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Expert <span className="text-emerald-500">Panel.</span>
                        </h2>

                        <div className={`flex items-center gap-3 p-4 rounded-2xl mb-8 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by specialty or clinical focus..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full bg-transparent text-sm font-bold outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredExperts.map((expert, idx) => {
                                const details = getExpertDetails(expert.name);
                                return (
                                    <div key={idx} className={`p-6 rounded-[2rem] border transition-all hover:-translate-y-1 ${isDark ? 'bg-white/5 border-white/10 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50 shadow-lg shadow-slate-200/50'}`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-black uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>{expert.name}</h3>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{details.title}</p>
                                            </div>
                                        </div>
                                        <p className={`text-xs font-bold mb-6 opacity-60 ${isDark ? 'text-white' : 'text-slate-700'}`}>{details.desc}</p>

                                        <button
                                            onClick={() => openPrivateChat(expert)}
                                            className="w-full py-3.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Message Expert
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <PrivateChatModal
                isDark={isDark}
                privateChat={privateChat}
                setPrivateChat={setPrivateChat}
                activeUser={activeUser}
            />
        </>
    );
}