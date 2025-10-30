import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, FileText, Pill, BarChart2, CreditCard, Settings, LifeBuoy, ChevronsLeft, ChevronsRight, User, Ticket, Heart } from 'lucide-react';

const SidebarNavLink = ({ to, icon: Icon, text, isCollapsed, onCloseMobileSidebar }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `w-full flex items-center py-3 rounded-lg transition-all duration-200 ${
                isCollapsed ? 'px-3 justify-center' : 'px-4 space-x-3'
            } ${
                isActive 
                ? 'bg-gradient-to-r from-[#0096C7] to-[#2A9D8F] text-white shadow-md' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`
        }
        onClick={onCloseMobileSidebar} // Close mobile sidebar on link click
    >
        <Icon size={22} className="flex-shrink-0" />
        {/* Text ko conditionally render kiya gaya hai */}
        {!isCollapsed && <span className="font-semibold whitespace-nowrap">{text}</span>}
    </NavLink>
);

const PatientSidebar = ({ isCollapsed, toggleCollapse, onCloseMobileSidebar }) => {
    const navItems = [
        { icon: Home, text: 'Dashboard', path: '/patient/dashboard' },
        { icon: Calendar, text: 'Appointments', path: '/patient/appointments' },
        { icon: FileText, text: 'Prescriptions', path: '/patient/prescriptions' },
        { icon: Pill, text: 'Medicine Finder', path: '/patient/medicine-finder' },
        { icon: BarChart2, text: 'Health Records', path: '/patient/health-records' },
        { icon: Ticket, text: 'My Token', path: '/patient/my-token' },
        { icon: Heart, text: 'Donate', path: '/patient/donate' },
        { icon: CreditCard, text: 'Billing', path: '/patient/billing' },
        { icon: Settings, text: 'Settings', path: '/patient/settings' }
    ];

    return (
        <aside className="w-full h-full bg-card text-foreground flex flex-col p-4 border-r border-border relative">
            {/* HealthSphere Logo for Desktop View */}
            <div className={`mb-6 items-center transition-all duration-300 ${isCollapsed ? 'justify-center flex' : 'justify-between px-2 flex'} hidden md:flex`}>
                <NavLink to="/" className="flex items-center space-x-2">
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
                    <NavLink to="/" className="flex items-center space-x-2" onClick={onCloseMobileSidebar}>
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
            
            <nav className="flex-1 flex flex-col space-y-2">
                {navItems.map(item => (
                    <SidebarNavLink 
                        key={item.text}
                        to={item.path}
                        icon={item.icon}
                        text={item.text}
                        isCollapsed={isCollapsed}
                        onCloseMobileSidebar={onCloseMobileSidebar} // Pass this prop down
                    />
                ))}
            </nav>

            {/* "Need Help?" box ko conditionally render kiya gaya hai */}
            {!isCollapsed && (
                <div className="mt-auto">
                    <div className="bg-muted rounded-lg p-4 text-center">
                        <LifeBuoy size={32} className="mx-auto text-muted-foreground mb-2" />
                        <h3 className="font-bold text-foreground">Need Help?</h3>
                        <p className="text-sm text-muted-foreground mt-1">Contact support 24/7</p>
                        <button className="mt-4 text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                            Get Support
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default PatientSidebar;