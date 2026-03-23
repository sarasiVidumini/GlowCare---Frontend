import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpModal from '../../features/auth/components/SignUpModal.jsx';

export default function SignUpPage({ isDark }) {
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#FBFBFD]'}`}>
            {/* Passes onClose down, so clicking X navigates home */}
            <SignUpModal isDark={isDark} onClose={() => navigate('/')} />
        </div>
    );
}