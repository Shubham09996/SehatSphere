import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Sun, Moon, User, Settings, LogOut, ChevronDown, Repeat, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { shopData } from '../../data/shopData.js';

const ShopHeader = ({ onMenuClick, isPremium, setIsPremium }) => {
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex-shrink-0 flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-30">
            {/* Left Side: Menu Toggle and Logo */}
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden p-1 text-muted-foreground hover:text-foreground">
                    <Menu size={24} />
                </button>
                <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] p-2 rounded-md">
                        <span className="text-white font-bold text-lg">H</span>
                    </div>
                    <span className="hidden sm:inline text-xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        HealthSphere
                    </span>
                </Link>
            </div>

            {/* Center: Search Bar */}
            <div className="relative w-full max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                    type="text" 
                    placeholder="Search orders, medicines, customers..." 
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Right Side: Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Freemium Toggle */}
                <div className="hidden sm:flex items-center gap-2 p-1 bg-muted rounded-full self-start shadow-sm">
                    <span className="text-xs font-semibold text-muted-foreground ml-2">Tier:</span>
                    <button onClick={() => setIsPremium(true)} className={`relative px-3 py-1 text-sm font-semibold rounded-full ${isPremium ? 'text-primary' : 'text-muted-foreground'}`}>
                        {isPremium && <motion.div layoutId="tier-pill-header" className="absolute inset-0 bg-primary/10 rounded-full" />}
                        <span className="relative">Premium</span>
                    </button>
                    <button onClick={() => setIsPremium(false)} className={`relative px-3 py-1 text-sm font-semibold rounded-full ${!isPremium ? 'text-primary' : 'text-muted-foreground'}`}>
                        {!isPremium && <motion.div layoutId="tier-pill-header" className="absolute inset-0 bg-primary/10 rounded-full" />}
                        <span className="relative">Free</span>
                    </button>
                </div>

                <motion.button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.button>
                <Link to="/shop/notifications" className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                    <Bell size={20}/>
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-card"/>
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 group">
                        <img src="https://avatar.iran.liara.run/public/boy" alt="Owner" className="w-9 h-9 rounded-full group-hover:ring-2 group-hover:ring-primary transition-all"/>
                        <div className="hidden lg:block text-left">
                            <p className="font-bold text-sm text-foreground">{shopData.shopInfo.name}</p>
                            <div className="flex items-center gap-1">
                                {isPremium && <Star size={12} className="text-yellow-500 fill-yellow-500"/>}
                                <p className="text-xs text-muted-foreground">{isPremium ? 'Premium Tier' : 'Free Tier'}</p>
                            </div>
                        </div>
                        <ChevronDown size={16} className={`hidden lg:block text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                    </button>
                    <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50"
                        >
                            <div className="p-2">
                                <Link to="/shop/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md">
                                    <User size={14}/> View Profile
                                </Link>
                                <div className="h-px bg-border my-1"></div>
                                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-muted rounded-md">
                                    <LogOut size={14}/> Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default ShopHeader;