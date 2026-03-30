import React, { useState, useEffect } from 'react';
import { X, Search, User, Edit3, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import PrivateChatModal from './expert/PrivateChatModal.jsx';
import ExpertFormModal from './expert/ExpertFormModal.jsx'; // Assuming separate file

export default function ExpertConsultModals({ isDark, showExpertsModal, setShowExpertsModal }) {
    const activeUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('activeUser'));
    const isAdmin = activeUser?.email === 'admin@glowcare.ai';

    const [experts, setExperts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [privateChat, setPrivateChat] = useState({ open: false, expert: null });

    // State for the Edit/Add Modal
    const [expertEditModal, setExpertEditModal] = useState({
        open: false, id: null, fullName: "", expertiseArea: "", bio: ""
    });

    const fetchExperts = async () => {
        try {
            const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token?.replace(/"/g, '')}` };
            const res = await axios.get('http://localhost:8080/api/v1/users', { headers });
            // Logic: Filter users with role EXPERT
            setExperts(res.data.filter(u => u.role === 'EXPERT'));
        } catch (error) {
            console.error("Failed to fetch experts:", error);
        }
    };

    useEffect(() => {
        if (showExpertsModal) fetchExperts();
    }, [showExpertsModal]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to revoke this expert's access?")) return;
        try {
            const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/v1/users/${id}`, {
                headers: { Authorization: `Bearer ${token?.replace(/"/g, '')}` }
            });
            fetchExperts(); // Refresh list
        } catch (error) {
            alert("Delete failed: Admin privileges required.");
        }
    };

    const handleSaveExpert = async (data) => {
        try {
            const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token?.replace(/"/g, '')}` };

            if (data.id) {
                await axios.put(`http://localhost:8080/api/v1/users/${data.id}`, data, { headers });
            } else {
                await axios.post('http://localhost:8080/api/v1/users', data, { headers });
            }

            setExpertEditModal({ open: false });
            fetchExperts();
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    const filteredExperts = experts.filter(exp =>
        (exp.name || exp.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {showExpertsModal && (
                <div className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] border flex flex-col ${isDark ? 'bg-[#0D0D0F] border-white/10' : 'bg-[#FBFBFD] border-slate-200 shadow-2xl'}`}>

                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-center">
                            <h2 className="text-3xl font-black italic uppercase text-emerald-500">Expert Panel.</h2>
                            <div className="flex gap-2">
                                {isAdmin && (
                                    <button
                                        onClick={() => setExpertEditModal({ open: true, id: null, fullName: "", expertiseArea: "", bio: "" })}
                                        className="p-3 bg-emerald-500 text-black rounded-xl hover:scale-105 transition-all"
                                    >
                                        <Plus size={20} />
                                    </button>
                                )}
                                <button onClick={() => setShowExpertsModal(false)} className="p-3 bg-white/5 rounded-xl"><X size={20}/></button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="px-8 mb-4">
                            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                                <Search size={18} className="text-slate-400" />
                                <input
                                    placeholder="Search specialty..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent outline-none font-bold text-sm"
                                />
                            </div>
                        </div>

                        {/* Expert Grid */}
                        <div className="flex-1 overflow-y-auto p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 no-scrollbar">
                            {filteredExperts.map((exp) => (
                                <div key={exp.id} className={`group relative p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-lg'}`}>

                                    {/* 🛡️ ADMIN ACTIONS: Only visible to main admin */}
                                    {isAdmin && (
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => setExpertEditModal({
                                                    open: true, id: exp.id, fullName: exp.name || exp.fullName,
                                                    expertiseArea: exp.expertiseArea || "Specialist", bio: exp.bio || ""
                                                })}
                                                className="p-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white"
                                            >
                                                <Edit3 size={14}/>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp.id)}
                                                className="p-2 bg-rose-500/20 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white"
                                            >
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><User /></div>
                                        <div>
                                            <h3 className="font-black uppercase italic">{exp.name || exp.fullName}</h3>
                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{exp.expertiseArea || "Clinical Specialist"}</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] opacity-60 mb-6 line-clamp-2">{exp.bio || "Verified GlowCare Expert."}</p>

                                    <button
                                        onClick={() => setPrivateChat({ open: true, expert: exp })}
                                        className="w-full py-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                                    >
                                        Message Expert
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <ExpertFormModal
                isDark={isDark}
                expertEditModal={expertEditModal}
                setExpertEditModal={setExpertEditModal}
                handleSaveExpert={handleSaveExpert}
            />

            <PrivateChatModal
                isDark={isDark}
                privateChat={privateChat}
                setPrivateChat={setPrivateChat}
                activeUser={activeUser}
            />
        </>
    );
}