import React from 'react';
// Import the main feature orchestrator from your newly organized scanner folder
import ScannerHub from '../../features/scanner/ScannerHub.jsx';

export default function SkinAnalysisPage({ isDark }) {
    return (
        // The wrapper div ensures the page takes up the full screen height
        // and matches the global background color based on the theme.
        <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#030303]' : 'bg-[#FDFDFD]'}`}>

            {/* Load the massive Scanner feature with a single, clean tag */}
            <ScannerHub isDark={isDark} />

        </div>
    );
}