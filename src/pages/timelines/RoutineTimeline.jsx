import React from 'react';
// Import the main feature orchestrator we just built
import RoutineHub from '../../features/routines/RoutineHub';

export default function RoutineTimelinePage({ isDark }) {
    return (
        // The wrapper div ensures the page takes up the full screen height
        // and matches the global background color based on the theme.
        <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#050505]' : 'bg-[#FBFBFD]'}`}>

            {/* This is the massive Routine feature we just separated,
              imported as one clean, readable component tag.
            */}
            <RoutineHub isDark={isDark} />

        </div>
    );
}