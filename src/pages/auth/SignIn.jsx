import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignInModal from '../../features/auth/components/SignInModal.jsx';

export default function SignInPage({ isDark, onLoginSuccess }) {
    const navigate = useNavigate();

    return (
        // The background color wrapper for the page
        <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#FBFBFD]'}`}>

            {/* Render the feature!
              If the user clicks the "X" or the background, we navigate them back to Home
            */}
            <SignInModal
                isDark={isDark}
                onClose={() => navigate('/')}
                onLoginSuccess={onLoginSuccess}
            />

        </div>
    );
}