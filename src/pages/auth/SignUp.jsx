import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpModal from '../../features/auth/components/SignUpModal.jsx';

export default function SignUpPage({ isDark }) {
    const navigate = useNavigate();

    return (
        // The page background behind the modal overlay
        <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#FBFBFD]'}`}>

            {/* Load the feature. If they click close, send them to Home */}
            <SignUpModal isDark={isDark} onClose={() => navigate('/')} />

        </div>
    );
}