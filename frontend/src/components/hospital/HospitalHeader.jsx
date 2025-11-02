import React, { useState, useEffect, useRef } from 'react';
import { Bell, UserCircle, Sun, Moon, Menu } from 'lucide-react';
import { LogOut, ChevronDown, User } from 'lucide-react'; // NEW: Import additional icons
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext is used for user info
import { useTheme } from '../../context/ThemeContext.jsx'; // Import useTheme
import { motion, AnimatePresence } from 'framer-motion'; // NEW: Import motion and AnimatePresence
import { useNavigate, Link } from 'react-router-dom'; // NEW: Import Link

const HospitalHeader = ({ isSidebarOpen, setIsSidebarOpen }) => { // Component name should match export
    const { user, logout } = useAuth(); // === useAuth() hook add kiya ===
    const { theme: currentTheme, toggleTheme: toggleCurrentTheme } = useTheme(); // Use theme context
    const navigate = useNavigate(); // Initialize useNavigate
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // NEW: State for dropdown
    const dropdownRef = useRef(null); // NEW: Ref for dropdown

    const handleNotificationsClick = () => {
        navigate('/hospital/notifications');
    };

    const handleProfileClick = () => {
        navigate('/hospital/profile');
    };

    const handleLogout = () => { // NEW: Handle logout function
        // console.log('Hospital logout initiated'); // Log when logout is called
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
        <header className="bg-card border-b border-border p-4 flex items-center justify-between shadow-sm">
            {/* === HEADING PAR GRADIENT LAGAYA HAI === */}
            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="md:hidden p-1 text-muted-foreground hover:text-foreground"
                >
                    <Menu size={24} />
                </button>
                <Link to="/" className="flex items-center space-x-2"> {/* NEW: Link to homepage */}
                    <div className="p-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end rounded-lg text-white">
                        <span className="text-primary-foreground font-bold text-lg">H</span>
                    </div>
                    <span className="text-2xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        HealthSphere
                    </span>
                </Link>
                <h2 className="text-xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text hidden">
                    Hospital Dashboard
                </h2>
            </div>
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

                {/* Hospital Profile Dropdown */}
                <div className="relative" ref={dropdownRef}> {/* Attach ref to the dropdown container */}
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 group"> {/* Button to toggle dropdown */}
                        {user?.profilePicture ? (
                            <img 
                                src={user.profilePicture} 
                                alt="Profile" 
                                className="w-8 h-8 rounded-full object-cover border border-border"
                            />
                        ) : (
                            <UserCircle size={32} className="text-muted-foreground" />
                        )}
                        <span className="font-medium text-foreground hidden sm:block">{user?.name || 'Hospital Admin'}</span>
                        <ChevronDown size={16} className={`hidden sm:block text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} /> {/* Dropdown arrow */}
                    </button>
                    <AnimatePresence> {/* For animation */}
                    {isDropdownOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50"
                        >
                            <div className="p-2">
                                <Link to="/hospital/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"><User size={14}/> View Profile</Link>
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

export default HospitalHeader; // Export name should match component name