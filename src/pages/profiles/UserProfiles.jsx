import React from 'react';
import UserNexusHub from '../../features/admin/UserNexusHub';

export default function UserProfilesPage({ isDark }) {
    return (
        <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#F8FAFC]'}`}>
            <UserNexusHub isDark={isDark} />
        </div>
    );
}