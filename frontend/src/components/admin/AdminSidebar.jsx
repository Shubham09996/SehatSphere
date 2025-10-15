import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Building, BarChart2, Shield, ChevronsLeft, ChevronsRight, LifeBuoy, PlusCircle } from 'lucide-react';

const AdminSidebar = ({ isCollapsed, toggleCollapse, onCloseMobileSidebar }) => {
    const navItems = [
        { icon: LayoutDashboard, text: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, text: 'User Management', path: '/admin/users' },
        { icon: PlusCircle, text: 'Add User', path: '/admin/users/add' }, // New: Add User link
        { icon: Building, text: 'Hospitals', path: '/admin/hospitals' },
        { icon: PlusCircle, text: 'Add Hospital', path: '/admin/hospitals/add' },
        { icon: BarChart2, text: 'Analytics', path: '/admin/analytics' },
        { icon: Shield, text: 'Security', path: '/admin/security' },
        { icon: LifeBuoy, text: 'Notifications', path: '/admin/notifications' }, // New: Notifications link
    ];

    return (
        <aside className="w-full h-full bg-card text-foreground flex flex-col p-4 border-r border-border relative">
            
            {/* Logo and Close Button for Mobile View */}
            <div className="mb-6 flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end rounded-lg text-white">
                        <Shield size={20}/>
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold text-foreground">Admin Control</span>
                    )}
                </div>
                {/* This button will only be rendered on mobile because onCloseMobileSidebar is only passed in the mobile layout */}
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
            
            <nav className="flex-1 flex flex-col space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.text}
                        to={item.path}
                        onClick={onCloseMobileSidebar} // Close on tap
                        className={({ isActive }) => 
                            `flex items-center py-3 rounded-lg transition-all duration-200 ${
                                isCollapsed ? 'px-3 justify-center' : 'px-4 space-x-3'
                            } ${
                                isActive 
                                ? 'bg-gradient-to-r from-[#0096C7] to-[#2A9D8F] text-white shadow-md' 
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`
                        }
                    >
                        <item.icon size={22} className="flex-shrink-0" />
                        {!isCollapsed && <span className="font-semibold whitespace-nowrap">{item.text}</span>}
                    </NavLink>
                ))}
            </nav>

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

export default AdminSidebar;