import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function OAuth2RedirectHandler({ onLoginSuccess }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const isNewUser = params.get('new') === 'true';
        const error = params.get('error');

        if (token) {
            localStorage.setItem('jwt_token', token);

            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));

                const decoded = JSON.parse(jsonPayload);

                const sessionUser = {
                    email: decoded.sub,
                    name: decoded.sub.split('@')[0],
                    role: decoded.role.toLowerCase(),
                    picture: `https://ui-avatars.com/api/?name=${decoded.sub}&background=10b981&color=fff`
                };

                // No longer setting localStorage here since handleLoginSuccess does it securely
                if (onLoginSuccess) {
                    onLoginSuccess(sessionUser);
                }

                // LOGIC: If new Google user, go to Step 2. Otherwise, go to Dashboard.
                if (isNewUser) {
                    navigate('/complete-profile');
                } else {
                    if (sessionUser.role === 'admin') {
                        navigate('/user-profiles');
                    } else if (sessionUser.role === 'expert') {
                        navigate('/timeline');
                    } else {
                        navigate('/');
                    }
                }

            } catch (e) {
                console.error("Token Decode Failed", e);
                navigate('/?error=LoginFailed');
            }
        } else {
            navigate('/?error=' + (error || 'OAuth2Failed'));
        }
        // FIX: Only track the exact string (location.search) instead of the whole object
    }, [navigate, location.search, onLoginSuccess]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-emerald-500">
            <Loader2 size={48} className="animate-spin mb-4" />
            <h2 className="text-sm font-black uppercase tracking-widest animate-pulse">Finalizing Workspace...</h2>
        </div>
    );
}