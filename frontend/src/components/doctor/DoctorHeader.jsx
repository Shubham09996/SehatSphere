import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Sun, Moon, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../utils/api'; // Import the configured axios instance
import { useAuth } from '../../context/AuthContext.jsx'; // Import the useAuth hook

// Reusable animated switch toggle for the status
const SwitchToggle = ({ enabled, setEnabled, labels }) => (
    <div 
        onClick={() => setEnabled(!enabled)} 
        className={`relative w-full p-1 flex rounded-full cursor-pointer transition-colors ${enabled ? 'bg-green-500/20' : 'bg-orange-500/20'}`}
    >
        <div className="w-1/2 text-center z-10">
            <span className={`font-semibold text-xs transition-colors ${enabled ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}`}>{labels.on}</span>
        </div>
        <div className="w-1/2 text-center z-10">
            <span className={`font-semibold text-xs transition-colors ${!enabled ? 'text-orange-700 dark:text-orange-300' : 'text-muted-foreground'}`}>{labels.off}</span>
        </div>
        <motion.div 
            layoutId="status-indicator-header" 
            className="absolute h-6 top-1 left-1 w-1/2 bg-card rounded-full shadow-md border border-border" 
            animate={{ x: enabled ? '0%' : '100%' }} 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
    </div>
);

const DoctorHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // useAuth se user aur logout function lo
    
    const userProfilePicture = user?.profilePicture || '/placeholders/default_avatar.jpg';
    const userName = user?.name || 'Doctor';
    const userSpecialty = user?.doctorSpecialty || ''; // Assuming doctorSpecialty is part of user object

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40">
            <div className="flex items-center space-x-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 rounded-md hover:bg-muted"><Menu size={24} /></button>
                {/* Mobile HealthSphere Logo */}
                <div className="flex items-center space-x-2 md:hidden">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] p-2 rounded-md">
                            <span className="text-white font-bold text-lg">H</span>
                        </div>
                    </Link>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] p-2 rounded-md"><span className="text-white font-bold text-lg">H</span></div>
                        <span className="text-xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">HealthSphere</span>
                    </Link>
                </div>
            </div>

            <div className="relative w-full max-w-md hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input type="text" placeholder="Search patients by name or ID..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"/>
            </div>

            <div className="flex items-center space-x-4">
                <motion.button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.1, rotate: 15 }} 
                    transition={{ duration: 0.2 }}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.button>
                <Link to="/doctor/notifications" className="relative cursor-pointer">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-white text-xs">3</span>
                    </span>
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 group">
                        {userProfilePicture ? (
                            <img src={userProfilePicture} alt={userName} className="w-9 h-9 rounded-full group-hover:ring-2 group-hover:ring-primary transition-all"/>
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end flex items-center justify-center text-white font-bold">{userName.charAt(0)}</div>
                        )}
                        <div className="hidden lg:block text-left">
                            <p className="font-bold text-sm text-foreground">{userName}</p>
                            <p className="text-xs text-muted-foreground">{userSpecialty}</p>
                        </div>
                        <ChevronDown size={16} className={`hidden lg:block text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                    </button>
                    <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50"
                        >
                            <div className="p-4 border-b border-border">
                                <p className="font-bold text-foreground">{userName}</p>
                                <p className="text-sm text-muted-foreground">{userSpecialty}</p>
                            </div>
                            <div className="p-2">
                                <div className="p-2">
                                    <SwitchToggle enabled={isAvailable} setEnabled={setIsAvailable} labels={{ on: 'Available', off: 'On a Break' }}/>
                                </div>
                                <Link to="/doctor/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"><User size={16}/> My Profile</Link>
                                <Link to="/doctor/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"><Settings size={16}/> Settings</Link>
                                <div className="h-px bg-border my-1"></div>
                                <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-muted rounded-md"><LogOut size={16}/> Logout</button>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default DoctorHeader;