import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, requireAdmin = false, children }) {
    const location = useLocation();

    // 1. Security Check: Is the user logged in?
    if (!user) {
        // Redirect to sign-in, saving where they were trying to go
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    // 2. Security Check: Does this specific page require Admin access?
    if (requireAdmin) {
        const isAdmin = user.email === 'admin@glowcare.ai';
        if (!isAdmin) {
            // If a normal user tries to type /admin/dashboard in the URL, kick them to the timeline!
            return <Navigate to="/timeline" replace />;
        }
    }

    // 3. If all checks pass, render the requested page
    return children;
}