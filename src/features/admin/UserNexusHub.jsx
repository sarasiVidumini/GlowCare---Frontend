import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Import shared components
import FallingLeaves from '../../components/ui/FallingLeaves';

// Import feature components
import AlertBanner from './components/AlertBanner';
import AdminHeader from './components/AdminHeader';
import UserCard from './components/UserCard';
import EditUserModal from './components/EditUserModal';

export default function UserNexusHub({ isDark }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    const isAdmin = activeUser?.email === 'admin@glowcare.ai';

    useEffect(() => {
        if (!activeUser || !isAdmin) {
            navigate('/');
            return;
        }

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
        if (!isAdmin) return;
        const filtered = users.filter(u => u.id !== id);
        setUsers(filtered);
        localStorage.setItem('glow_users', JSON.stringify(filtered));
        localStorage.setItem('userProfiles', JSON.stringify(filtered));
        showAlert("Identity Terminated", "error");
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!isAdmin) return;
        const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
        setUsers(updatedUsers);
        localStorage.setItem('glow_users', JSON.stringify(updatedUsers));
        localStorage.setItem('userProfiles', JSON.stringify(updatedUsers));
        setEditingUser(null);
        showAlert("Sync Complete", "success");
    };

    const handleAvatarUpload = (e, userId) => {
        if (!isAdmin) return;
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

            <AlertBanner alert={alert} />

            <div className="relative z-10 max-w-7xl mx-auto">
                <AdminHeader isDark={isDark} userCount={users.length} setSearchTerm={setSearchTerm} />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {filteredUsers.map((user) => (
                        <UserCard
                            key={user.id || user.email}
                            isDark={isDark}
                            isAdmin={isAdmin}
                            user={user}
                            handleAvatarUpload={handleAvatarUpload}
                            setEditingUser={setEditingUser}
                            deleteUser={deleteUser}
                        />
                    ))}
                </div>

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