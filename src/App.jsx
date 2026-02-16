import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import AppRoute from './routes/AppRoutes.jsx';

function App() {
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState(null);
    const [isSignInOpen, setIsSignInOpen] = useState(false); // අලුතින් එක් කළා

    useEffect(() => {
        const loggedInUser = localStorage.getItem('activeUser');
        if (loggedInUser) {
            setUser(JSON.parse(loggedInUser));
        }
    }, []);

    const toggleTheme = () => setIsDark(!isDark);

    const handleLoginSuccess = (userData) => {
        console.log("Logged in User: ", userData);
        setUser(userData);
        localStorage.setItem('activeUser', JSON.stringify(userData));
        setIsSignInOpen(false); // ලොග් වූ පසු ක්ලෝස් කරන්න
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('activeUser');
    };

    return (
        <Router>
            <div className={`flex flex-col min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#050505] text-white' : 'bg-white text-slate-900'}`}>

                <div className={`${isDark ? 'bg-emerald-900' : 'bg-emerald-600'} text-white text-[10px] uppercase tracking-[0.2em] py-2 text-center font-bold`}>
                    Current Climate: High Humidity (82%) — Routines Adjusted for Sri Lanka
                </div>

                <Navbar
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    user={user}
                    onLogout={handleLogout}
                    onSignInClick={() => setIsSignInOpen(true)} // Navbar එකට ෆන්ක්ෂන් එක දුන්නා
                />

                <main className="flex-grow">
                    <AppRoute
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                        onLoginSuccess={handleLoginSuccess}
                        user={user}
                        isSignInOpen={isSignInOpen} // අලුතින් එක් කළා
                        setIsSignInOpen={setIsSignInOpen} // අලුතින් එක් කළා
                    />
                </main>

                <Footer isDark={isDark} />
            </div>
        </Router>
    );
}

export default App;