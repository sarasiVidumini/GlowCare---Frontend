import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
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

    // FIX: useCallback caches this function so it never changes its memory address.
    // The state updater (prev) acts as a guard clause to physically break the loop!
    const handleLoginSuccess = useCallback((userData) => {
        setUser((prevUser) => {
            // Guard Clause: If the user is already set, do NOTHING to stop the render loop
            if (prevUser?.email === userData.email) {
                return prevUser;
            }

            console.log("Logged in User: ", userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            return userData;
        });
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('jwt_token');
        window.location.href = '/';
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
                />

                <main className="flex-grow">
                    <AppRoutes
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                        onLoginSuccess={handleLoginSuccess}
                        user={user}
                    />
                </main>

                <Footer isDark={isDark} />
            </div>
        </Router>
    );
}

export default App;