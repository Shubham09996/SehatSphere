import React from 'react';
import { Bell, UserCircle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext is used for user info
import { useTheme } from '../../context/ThemeContext.jsx'; // Import useTheme
import { motion } from 'framer-motion'; // motion import karna zaroori hai agar use kar rahe ho
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const HospitalHeader = ({ theme, toggleTheme }) => { // Component name should match export
    const { user } = useAuth(); // === useAuth() hook add kiya ===
    const { theme: currentTheme, toggleTheme: toggleCurrentTheme } = useTheme(); // Use theme context
    const navigate = useNavigate(); // Initialize useNavigate

    const handleNotificationsClick = () => {
        navigate('/hospital/notifications');
    };

    const handleProfileClick = () => {
        navigate('/hospital/profile');
    };

    return (
        <header className="bg-card border-b border-border p-4 flex items-center justify-between shadow-sm">
            {/* === HEADING PAR GRADIENT LAGAYA HAI === */}
            <h2 className="text-xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                Hospital Dashboard
            </h2>
            <div className="flex items-center gap-4">
                <button onClick={handleNotificationsClick} className="p-2 rounded-full hover:bg-muted transition-colors">
                    <Bell size={20} className="text-foreground" />
                </button>
                
                {/* === THEME TOGGLE BUTTON PAR GRADIENT AUR ICONS KO SAFED KIYA HAI === */}
                <motion.button 
                    onClick={toggleCurrentTheme} 
                    className="p-2 rounded-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 15 }} 
                    transition={{ duration: 0.2 }}
                >
                    {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.button>

                <div onClick={handleProfileClick} className="flex items-center gap-2 cursor-pointer">
                    <UserCircle size={32} className="text-muted-foreground" />
                    <span className="font-medium text-foreground hidden sm:block">{user?.name || 'Hospital Admin'}</span>
                </div>
            </div>
        </header>
    );
};

export default HospitalHeader; // Export name should match component name