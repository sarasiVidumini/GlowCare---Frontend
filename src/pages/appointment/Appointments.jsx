import React from 'react';
// Import the main feature orchestrator we just built
import AppointmentHub from '../../features/appointments/AppointmentHub.jsx';

export default function AppointmentsPage({ isDark }) {

    // This file acts as a clean entry point for your router.
    // If you ever need to add page-level SEO (React Helmet),
    // analytics tracking, or specific layout wrappers (like a Navbar/Sidebar),
    // you wrap them around the feature component here.

    return (
        <div className="page-wrapper">
            {/* You could add a <Navbar isDark={isDark} /> here later */}

            <AppointmentHub isDark={isDark} />

            {/* You could add a <Footer isDark={isDark} /> here later */}
        </div>
    );
}