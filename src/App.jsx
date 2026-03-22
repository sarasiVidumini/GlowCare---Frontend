import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Updated imports to match the new layout structure
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState(null);
    const [isSignInOpen, setIsSignInOpen] = useState(false);

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
        setIsSignInOpen(false);
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
                    onSignInClick={() => setIsSignInOpen(true)}
                />

                <main className="flex-grow">
                    <AppRoutes
                        isDark={isDark}
                        toggleTheme={toggleTheme}
                        onLoginSuccess={handleLoginSuccess}
                        user={user}
<<<<<<< HEAD
                        isSignInOpen={isSignInOpen}
                        setIsSignInOpen={setIsSignInOpen}
=======
                        isSignInOpen={isSignInOpen} // අලුතින් එක් කළා
                        setIsSignInOpen={setIsSignInOpen} // added to better functioning
>>>>>>> 699673d1de31893e942e7adc13d448f0cd1fccac
                    />
                </main>

                <Footer isDark={isDark} />
            </div>
        </Router>
    );
}

export default App;