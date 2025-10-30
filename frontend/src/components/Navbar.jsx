import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navLinks = [
    { name: 'Features', to: '/features' },
    { name: 'Roles', to: '/roles' },
    { name: 'About', to: '/about' },
];

const Navbar = ({ theme, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] p-2 rounded-md">
                        <span className="text-primary-foreground font-bold text-lg">H</span>
                    </div>
                    <span className="text-xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        HealthSphere
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.to}
                            className={({ isActive }) => 
                                `relative font-medium transition-colors ${isActive ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text' : 'text-foreground hover:text-primary'}`
                            }
                        >
                            {link.name}
                            {/* Animated underline for active link */}
                            {location.pathname === link.to && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end"
                                />
                            )}
                        </NavLink>
                    ))}
                </nav>
                
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <motion.button onClick={toggleTheme} className="p-2 rounded-full text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1, rotate: 15 }} transition={{ duration: 0.2 }}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </motion.button>

                    {/* Desktop Login/Signup Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="font-medium text-foreground hover:text-primary transition-colors">Login</Link>
                        <Link to="/signup" className="px-4 py-2 rounded-md font-medium bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground hover:opacity-90 transition-opacity">
                            Get Started
                        </Link>
                    </div>

                     {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-foreground/70">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg"
                >
                    <nav className="flex flex-col items-center space-y-6 p-6">
                        {navLinks.map(link => (
                             <NavLink
                                key={link.name}
                                to={link.to}
                                className={({ isActive }) => 
                                    `font-medium text-lg ${isActive ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text' : 'text-foreground hover:text-primary'}`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="h-px w-full bg-border"></div>
                        <Link to="/login" className="font-medium text-lg text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        <Link to="/signup" className="w-full max-w-xs text-center px-4 py-2 rounded-md font-medium bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground hover:opacity-90 transition-opacity" onClick={() => setIsMenuOpen(false)}>
                            Get Started
                        </Link>
                    </nav>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;