import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import shared components
import FallingLeaves from '../../components/ui/FallingLeaves';

// Import feature components
import AlertBanner from './components/AlertBanner';
import AdminHeader from './components/AdminHeader';
import UserCard from './components/UserCard';
import EditUserModal from './components/EditUserModal';

export default function UserNexusHub({ isDark }) {
    const navigate = useNavigate();

    // State
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);

    // Get Auth Info
    const activeUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('activeUser'));
    const isAdmin = activeUser?.email === 'admin@glowcare.ai';
    const API_BASE_URL = "http://localhost:8080/api/v1/users";

    // Helper to get the token (Checks both common keys just in case)
    const getAuthHeader = () => {
        const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // --- 1. GET: Fetch all profiles from Spring Boot ---
    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(API_BASE_URL, {
                headers: getAuthHeader() // FIXED: Added Auth Header
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Fetch Error:", error);
            // If the error is a 401 or 403, the session might be expired
            if (error.response?.status === 401 || error.response?.status === 403) {
                showAlert("Session expired. Please log in again.", "error");
            } else {
                showAlert("Failed to connect to GlowCare server", "error");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [isAdmin, navigate, fetchUsers]);

    const showAlert = (msg, type) => {
        setAlert({ show: true, msg, type });
        setTimeout(() => setAlert({ show: false, msg: '', type: '' }), 3000);
    };

    // --- 2. DELETE: Terminate Identity in MySQL ---
    const deleteUser = async (id) => {
        if (!window.confirm("Permanently delete this user?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/${id}`, {
                headers: getAuthHeader() // FIXED: Added Auth Header
            });
            setUsers(prev => prev.filter(u => u.id !== id));
            showAlert("Identity Terminated from Database", "error");
        } catch (error) {
            showAlert("Delete failed. Unauthorized or Server error.", "error");
        }
    };

    // --- 3. PUT: Update Profile in MySQL ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/${editingUser.id}`, editingUser, {
                headers: getAuthHeader() // FIXED: Added Auth Header
            });

            await fetchUsers();
            setEditingUser(null);
            showAlert("Profile Synced to Database", "success");
        } catch (error) {
            showAlert("Update failed. Check your connection.", "error");
        }
    };

    const handleAvatarUpload = (e, userId) => {
        showAlert("Avatar upload functionality pending API setup", "success");
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isAdmin) return null;

    return (
        <div className={`relative min-h-screen p-6 transition-all duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />
            <AlertBanner alert={alert} />

            <div className="relative z-10 max-w-7xl mx-auto">
                <AdminHeader isDark={isDark} userCount={users.length} setSearchTerm={setSearchTerm} />

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {filteredUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                isDark={isDark}
                                isAdmin={isAdmin}
                                user={user}
                                handleAvatarUpload={handleAvatarUpload}
                                setEditingUser={setEditingUser}
                                deleteUser={deleteUser}
                            />
                        ))}
                    </div>
                )}

                <EditUserModal
                    isDark={isDark}
                    editingUser={editingUser}
                    setEditingUser={setEditingUser}
                    handleUpdate={handleUpdate}
                />
            </div>
        </div>
    );
}