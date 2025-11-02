import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, FileText, BarChart2, Settings, ChevronsLeft, ChevronsRight, User, UserPlus, Ticket, FlaskConical, LayoutDashboard, Pill, Heart } from 'lucide-react';

const SidebarNavLink = ({ to, icon: Icon, text, isCollapsed, onCloseMobileSidebar }) => {
    const location = useLocation();
    // Check if this link is active (special handling for medicine-finder)
    const isActive = location.pathname === to || 
        (to === '/patient/medicine-finder' && location.pathname.startsWith('/patient/medicine-finder'));
    
    return (
        <NavLink
            to={to}
            className={`w-full flex items-center py-3 rounded-lg transition-all duration-200 ${
                isCollapsed ? 'px-3 justify-center' : 'px-4 space-x-3'
            } ${
                isActive 
                ? 'bg-gradient-to-r from-[#0096C7] to-[#2A9D8F] text-white shadow-md' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            onClick={onCloseMobileSidebar} // Close mobile sidebar on link click
        >
            <Icon size={22} className="flex-shrink-0" />
            {/* Text ko conditionally render kiya gaya hai */}
            {!isCollapsed && <span className="font-semibold whitespace-nowrap">{text}</span>}
        </NavLink>
    );
};

const PatientSidebar = ({ isCollapsed, toggleCollapse, onCloseMobileSidebar }) => {
    // Mobile-only navigation items (shown only on mobile devices)
    const mobileNavItems = [
        { icon: LayoutDashboard, text: 'Dashboard', path: '/patient/dashboard' },
        { icon: Pill, text: 'Medicine Finder', path: '/patient/medicine-finder' },
        { icon: Heart, text: 'Donate', path: '/patient/donate' }
    ];
    
    // Navigation items shown on all devices
    const navItems = [
        { icon: UserPlus, text: 'Add Family Member', path: '/patient/add-family-member' },
        { icon: Calendar, text: 'Appointments', path: '/patient/appointments' },
        { icon: FileText, text: 'Prescriptions', path: '/patient/prescriptions' },
        { icon: BarChart2, text: 'Health Records', path: '/patient/health-records' },
        { icon: FlaskConical, text: 'Tests info & reports', path: '/patient/tests' },
        { icon: Ticket, text: 'My Token', path: '/patient/my-token' },
        { icon: Settings, text: 'Settings', path: '/patient/settings' }
    ];

    return (
        <aside className="w-full h-full bg-card text-foreground flex flex-col p-4 border-r border-border relative">
            {/* HealthSphere Logo for Desktop View */}
            <div className={`mb-6 items-center transition-all duration-300 ${isCollapsed ? 'justify-center flex' : 'justify-between px-2 flex'} hidden md:flex`}>
                <NavLink to="/patient/dashboard" className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] p-2 rounded-md">
                        <User className="text-primary-foreground" size={24}/>
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                            Patient Dashboard
                        </span>
                    )}
                </NavLink>
            </div>

            {/* HealthSphere Logo for Mobile View */}
            {!isCollapsed && (
                <div className="mb-6 flex items-center justify-between md:hidden">
                    <NavLink to="/patient/dashboard" className="flex items-center space-x-2" onClick={onCloseMobileSidebar}>
                        <div className="bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] p-2 rounded-md">
                            <User className="text-primary-foreground" size={24}/>
                        </div>
                        <span className="text-xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                            Patient Dashboard
                        </span>
                    </NavLink>
                    {onCloseMobileSidebar && (
                        <button
                            onClick={onCloseMobileSidebar}
                            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                            <ChevronsLeft size={20} />
                        </button>
                    )}
                </div>
            )}
            
            {/* Desktop Collapse Button */}
            <button 
                onClick={toggleCollapse} 
                className="absolute -right-3 top-8 z-10 p-1 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hidden md:block"
            >
                {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            </button>
            
            {/* Unified Navigation Menu */}
            <nav className="flex-1 flex flex-col space-y-2">
                {/* Mobile-only items (Dashboard, Medicine Finder, Donate) - hidden on desktop/laptop */}
                {mobileNavItems.map(item => (
                    <div key={item.text} className="md:hidden">
                        <SidebarNavLink 
                            to={item.path}
                            icon={item.icon}
                            text={item.text}
                            isCollapsed={isCollapsed}
                            onCloseMobileSidebar={onCloseMobileSidebar}
                        />
                    </div>
                ))}
                
                {/* All device items */}
                {navItems.map(item => (
                    <SidebarNavLink 
                        key={item.text}
                        to={item.path}
                        icon={item.icon}
                        text={item.text}
                        isCollapsed={isCollapsed}
                        onCloseMobileSidebar={onCloseMobileSidebar}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default PatientSidebar;