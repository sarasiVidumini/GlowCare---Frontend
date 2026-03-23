import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function OAuth2RedirectHandler({ onLoginSuccess }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Grab the token from the URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (token) {
            // 1. Save the token to use in Axios requests
            localStorage.setItem('jwt_token', token);

            try {
                // 2. Decode the JWT token to get the user's role and email
                // JWTs are base64 encoded. We split it and decode the payload (middle section).
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decoded = JSON.parse(jsonPayload);

                // 3. Set up the UI session
                const sessionUser = {
                    email: decoded.sub,
                    name: decoded.sub.split('@')[0], // Fallback name from email
                    role: decoded.role.toLowerCase(),
                    picture: `https://ui-avatars.com/api/?name=${decoded.sub}&background=10b981&color=fff`
                };

                localStorage.setItem('currentUser', JSON.stringify(sessionUser));
                if (onLoginSuccess) onLoginSuccess(sessionUser);

                // 4. Redirect based on their role
                if (sessionUser.role === 'admin') {
                    navigate('/');
                } else if (sessionUser.role === 'expert' || sessionUser.role === 'doctor') {
                    navigate('/timeline');
                } else {
                    navigate('/user-profiles');
                }

            } catch (e) {
                console.error("Failed to decode token", e);
                navigate('/?error=LoginFailed');
            }
        } else {
            // If no token, send them to home with an error
            navigate('/?error=' + (error || 'OAuth2Failed'));
        }
    }, [navigate, location, onLoginSuccess]);

    // Show a spinner while the redirect is processing instantly
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-emerald-500">
            <Loader2 size={48} className="animate-spin mb-4" />
            <h2 className="text-sm font-black uppercase tracking-widest animate-pulse">Authenticating Workspace...</h2>
        </div>
    );
}