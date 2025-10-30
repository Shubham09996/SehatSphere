import React from 'react';
// 'useMatch' ko import karna zaroori hai
import { NavLink, Outlet, useLocation, useMatch } from 'react-router-dom';
import { User, Stethoscope, Shield, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const settingsNav = [
    { name: 'Profile', href: '/doctor/settings/profile', icon: User },
    { name: 'Consultation', href: '/doctor/settings/consultation', icon: Stethoscope },
    { name: 'Security', href: '/doctor/settings/security', icon: Shield },
    { name: 'Notifications', href: '/doctor/settings/notifications', icon: Bell },
];

// === NAVLINK KE LIYE YEH NAYA COMPONENT BANAYA HAI ===
// Taki active state par icon gayab na ho
const SettingsNavItem = ({ item }) => {
    const match = useMatch({ path: item.href, end: true });
    const isActive = !!match;

    return (
        <NavLink
            to={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md font-semibold transition-colors ${
                isActive
                    ? 'bg-primary/10'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
        >
            {/* Icon ko active state par solid color milega */}
            <span className={isActive ? 'text-primary' : ''}>
                <item.icon size={18} />
            </span>
            {/* Text ko active state par gradient milega */}
            <span className={isActive ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text' : ''}>
                {item.name}
            </span>
        </NavLink>
    );
};

const DoctorSettingsPage = () => {
    const location = useLocation();

    return (
        <div className="space-y-8">
            <div>
                {/* 1. HEADING PAR GRADIENT LAGAYA HAI */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your professional profile and consultation settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Left Column: Navigation */}
                <aside className="md:col-span-1">
                    <nav className="flex flex-col space-y-2">
                        {/* 2. SECTIONS (NAV ITEMS) PAR GRADIENT LAGAYA HAI */}
                        {settingsNav.map((item) => (
                           <SettingsNavItem key={item.name} item={item} />
                        ))}
                    </nav>
                </aside>

                {/* Right Column: Content */}
                <main className="md:col-span-3">
                    <AnimatePresence mode="wait">
                         <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Outlet /> 
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default DoctorSettingsPage;