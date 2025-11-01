import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BriefcaseMedical,
    Building,
    Package,
    TrendingUp,
    ChevronsLeft,
    ChevronsRight,
    LifeBuoy,
    ShieldCheck,
} from 'lucide-react';

const HospitalSidebar = ({ isCollapsed, toggleCollapse, onCloseMobileSidebar }) => {
    const navLinks = [
        { name: 'Overview', icon: LayoutDashboard, path: '/hospital/dashboard' },
        { name: 'Total Patients', icon: Users, path: '/hospital/patients' },
        { name: 'Staff Management', icon: BriefcaseMedical, path: '/hospital/staff-management' },
        { name: 'Operations', icon: Building, path: '/hospital/operations' },
        { name: 'Linked Pharmacy Partner', icon: Package, path: '/hospital/pharmacy-partners' },
        { name: 'Analytics & Fraud', icon: TrendingUp, path: '/hospital/analytics-fraud' },
    ];

    return (
        <aside className="w-full h-full bg-card text-foreground flex flex-col p-4 border-r border-border relative transition-all duration-300 ease-in-out">
            {/* Header Section with Logo */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end rounded-lg text-white">
                        <ShieldCheck size={20} />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold text-foreground">Hospital Panel</span>
                    )}
                </div>

                {/* Mobile Close Button */}
                {onCloseMobileSidebar && (
                    <button
                        onClick={onCloseMobileSidebar}
                        className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground md:hidden"
                    >
                        <ChevronsLeft size={20} />
                    </button>
                )}
            </div>

            {/* Collapse button for desktop */}
            {toggleCollapse && (
                <button
                    onClick={toggleCollapse}
                    className="absolute -right-3 top-8 z-10 p-1 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hidden md:block"
                >
                    {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
                </button>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        onClick={onCloseMobileSidebar}
                        className={({ isActive }) =>
                            `flex items-center py-3 rounded-lg transition-all duration-200 ${
                                isCollapsed ? 'px-3 justify-center' : 'px-4 space-x-3'
                            } ${
                                isActive
                                    ? 'bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`
                        }
                    >
                        <link.icon size={22} className="flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="font-semibold whitespace-nowrap">{link.name}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Section */}
            {!isCollapsed && (
                <div className="mt-auto">
                    <div className="bg-muted rounded-lg p-4 text-center">
                        <LifeBuoy size={32} className="mx-auto text-muted-foreground mb-2" />
                        <h3 className="font-bold text-foreground">Need Help?</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Contact support anytime
                        </p>
                        <button className="mt-4 text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                            Get Support
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default HospitalSidebar;
