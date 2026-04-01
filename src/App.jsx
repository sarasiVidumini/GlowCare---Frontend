import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState(null);

    // 1. ADD THIS: A loading state to prevent premature routing
    const [isAuthReady, setIsAuthReady] = useState(false);

    // 2. MOVE INITIALIZATION HERE: Check storage before releasing the app
    useEffect(() => {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            try {
                setUser(JSON.parse(saved));
            } catch (error) {
                console.error("Failed to parse user session");
                setUser(null);
            }
        }
        // We have checked storage. The app is now safe to render routes!
        setIsAuthReady(true);
    }, []);

    const toggleTheme = () => setIsDark(!isDark);

    const handleLoginSuccess = useCallback((userData) => {
        setUser((prevUser) => {
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

    // 3. THE GUARD CLAUSE: Show nothing (or a spinner) until auth is checked
    if (!isAuthReady) {
        // You can replace this with a nice full-screen loading spinner later!
        return <div className={`min-h-screen ${isDark ? 'bg-[#050505]' : 'bg-[#FBFBFD]'}`} />;
    }

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