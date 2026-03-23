import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, children, setIsSignInOpen }) {
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            setIsSignInOpen(true); // Automatically trigger login modal
        }
    }, [user, setIsSignInOpen]);

    if (!user) {
        // Send them home, but save their intended destination in 'state'
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}