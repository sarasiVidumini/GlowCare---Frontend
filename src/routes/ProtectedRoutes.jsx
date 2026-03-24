import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ user, children }) {
    const location = useLocation();

    if (!user) {
        // Redirect to the dedicated sign-in page
        // We save the 'from' location so we can redirect them back after they log in
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    return children;
}