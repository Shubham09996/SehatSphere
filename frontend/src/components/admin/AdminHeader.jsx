import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Sun, Moon, LogOut, ChevronDown, Shield, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../utils/api'; // Import the api utility
import { useAuth } from '../../context/AuthContext.jsx'; // NEW: Import useAuth hook

const AdminHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [adminProfile, setAdminProfile] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth(); // NEW: Get logout from AuthContext

    // Fetch admin profile on component mount
    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const res = await api.get('/api/admin/profile');
                setAdminProfile(res.data.personalInfo);
            } catch (error) {
                console.error('Failed to fetch admin profile:', error);
                // Optionally handle error, e.g., redirect to login if not authorized
            }
        };
        fetchAdminProfile();
    }, []);

    // Handle Logout
    const handleLogout = async () => {
        logout(); // Use the logout function from AuthContext
        navigate('/login'); // Redirect to login page
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="flex-shrink-0 flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40">
            {/* Left Side: Menu Toggle and Logo */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="md:hidden p-1 text-muted-foreground hover:text-foreground"
                >
                    <Menu size={24} />
                </button>
                {/* UPDATED: Link now points to the homepage "/" */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] p-2 rounded-md">
                        <span className="text-white font-bold text-lg">H</span>
                    </div>
                    <span className="hidden sm:inline text-xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        HealthSphere
                    </span>
                </Link>
            </div>

            {/* Center: Global Search Bar */}
            <div className="relative w-full max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                    type="text" 
                    placeholder="Search users, hospitals, reports..." 
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Right Side: Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
                <motion.button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.button>
                
                <Link to="/admin/notifications" className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                    <Bell size={20}/>
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-card"/>
                </Link>
                
                {/* Admin Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 group">
                        <img src={adminProfile?.pfp || "/uploads/default.jpg"} alt={adminProfile?.name || "Admin"} className="w-9 h-9 rounded-full group-hover:ring-2 group-hover:ring-primary transition-all"/>
                        <div className="hidden lg:block text-left">
                            <p className="font-bold text-sm text-foreground">{adminProfile?.name || "Admin User"}</p>
                            <p className="text-xs text-muted-foreground">{adminProfile?.role || "Super Administrator"}</p>
                        </div>
                        <ChevronDown size={16} className={`hidden lg:block text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                    </button>
                    <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50"
                        >
                            <div className="p-2">
                                <Link to="/admin/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"><User size={14}/> View Profile</Link>
                                <Link to="/admin/security" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"><Shield size={14}/> Security</Link>
                                <div className="h-px bg-border my-1"></div>
                                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-muted rounded-md"><LogOut size={14}/> Logout</button>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;