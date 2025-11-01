import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Users, Stethoscope, FlaskConical, Droplet, ShieldCheck, TrendingUp, Package, BriefcaseMedical, Building, ClipboardList, IndianRupee
} from 'lucide-react';

const navLinks = [
    { name: 'Overview', icon: LayoutDashboard, path: '/hospital/dashboard' },
    { name: 'Total Patients', icon: Users, path: '/hospital/patients' }, // NEW: Total Patients page
    { name: 'Staff Management', icon: BriefcaseMedical, path: '/hospital/staff-management' }, // Changed icon
    { name: 'Operations', icon: Building, path: '/hospital/operations' },
    { name: 'Linked Pharmacy Partner', icon: Package, path: '/hospital/pharmacy-partners' },
    { name: 'Analytics & Fraud', icon: TrendingUp, path: '/hospital/analytics-fraud' },
    // Add more links as needed for specific pages like Lab Test Management, Blood Bank, etc.
    // Or nest them under Operations Management if there are sub-pages.
];

const HospitalSidebar = () => {
    return (
        <div className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-8 px-2">
                {/* 1. HEADING PAR GRADIENT LAGAYA HAI */}
                <span className="text-2xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Hospital
                </span>
                <span className="text-sm text-muted-foreground">Dashboard</span>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg text-foreground transition-colors
                                    ${isActive
                                        // 2. ACTIVE LINK PAR GRADIENT LAGAYA HAI
                                        ? 'bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white shadow-md'
                                        : 'hover:bg-muted hover:text-foreground'}`
                                }
                            >
                                <link.icon size={20} />
                                <span className="font-medium text-sm">{link.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Optional: Footer or user info at the bottom of the sidebar */}
            <div className="mt-auto border-t border-border pt-4">
                <p className="text-xs text-muted-foreground px-2">Logged in as Hospital Admin</p>
            </div>
        </div>
    );
};

export default HospitalSidebar;