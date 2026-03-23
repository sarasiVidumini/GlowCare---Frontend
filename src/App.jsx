import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState(null);

    // No more isSignInOpen state needed!

    useEffect(() => {
        // FIX 1: Matched the localStorage key to 'currentUser' (what your auth forms use)
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
            try {
                setUser(JSON.parse(loggedInUser));
            } catch (error) {
                console.error("Failed to parse user session");
            }
        }
    }, []);

    const toggleTheme = () => setIsDark(!isDark);

    const handleLoginSuccess = (userData) => {
        console.log("Logged in User: ", userData);
        setUser(userData);
        // Ensure state and storage are perfectly synced
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('jwt_token'); // FIX 2: Added token cleanup on logout!
        window.location.href = '/'; // Force redirect to home to clear any protected states
    };

    return (
        <Router>
            <div className={`flex flex-col min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#FBFBFD] text-slate-900'}`}>

                {/* Top Climate Banner */}
                <div className={`${isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-600 text-white'} text-[10px] uppercase tracking-[0.2em] py-2 text-center font-bold`}>
                    Current Climate: High Humidity (82%) — Routines Adjusted for Sri Lanka
                </div>

                <Navbar
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    user={user}
                    onLogout={handleLogout}
                    // FIX 3: Removed onSignInClick prop (Navbar uses its own router now)
                />

                <main className="flex-grow">
                    <AppRoutes
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                        onLoginSuccess={handleLoginSuccess}
                        user={user}
                        // FIX 4: Removed all modal state props being passed down
                    />
                </main>

                <Footer isDark={isDark} />
            </div>
        </Router>
    );
}

export default App;