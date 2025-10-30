import React from 'react';
// NEW: Import useOutletContext to receive the premium status
import { NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { Store, CreditCard, Users, Puzzle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const settingsNav = [
    { name: 'Shop Profile', href: '/shop/settings/profile', icon: Store },
    { name: 'Plan & Billing', href: '/shop/settings/billing', icon: CreditCard },
    { name: 'Staff Management', href: '/shop/settings/staff', icon: Users },
    { name: 'Integrations', href: '/shop/settings/integrations', icon: Puzzle },
];

const ShopSettingsPage = () => {
    const location = useLocation();
    // NEW: Receive the isPremium context from the parent layout (ShopDashboardLayout)
    const { isPremium, setIsPremium } = useOutletContext();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Shop Settings
                </h1>
                <p className="text-muted-foreground mt-1">Manage your pharmacy's profile, billing, staff, and integrations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="md:col-span-1">
                    <nav className="flex flex-col space-y-2">
                        {settingsNav.map((item) => (
                            <NavLink key={item.name} to={item.href}
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md font-semibold ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>
                                <item.icon size={18} /><span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="md:col-span-3">
                    <AnimatePresence mode="wait">
                         <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}>
                            {/* NEW: Pass the context down to the child routes (Profile, Billing, Integrations, etc.) */}
                            <Outlet context={{ isPremium, setIsPremium }} /> 
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};
export default ShopSettingsPage;