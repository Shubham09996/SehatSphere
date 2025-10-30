import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, IndianRupee, BarChart2, Settings, ChevronsLeft, ChevronsRight, LifeBuoy, Lock, GitBranch, X } from 'lucide-react';

const ShopSidebar = ({ isCollapsed, toggleCollapse, onCloseMobileSidebar, isPremium }) => {
    const navItems = [
        { icon: LayoutDashboard, text: 'Dashboard', path: '/shop/dashboard' },
        { icon: ShoppingCart, text: 'Orders', path: '/shop/orders' },
        { icon: Package, text: 'Inventory', path: '/shop/inventory' },
        { icon: IndianRupee, text: 'Billing', path: '/shop/billing' },
        { icon: BarChart2, text: 'Analytics', path: '/shop/analytics', isPremium: true },
        { icon: Settings, text: 'Settings', path: '/shop/settings' },
    ];

    return (
        <aside className="w-full h-full bg-card text-foreground flex flex-col p-4 border-r border-border relative">
            
            <div className={`flex items-center mb-8 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between px-2'} hidden md:flex`}>
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end rounded-lg">
                        <GitBranch className="text-white"/>
                    </div>
                    {!isCollapsed && (
                        <p className="font-bold text-lg text-foreground">Pharmacy Panel</p>
                    )}
                 </div>
            </div>
            
            {/* HealthSphere Logo for Mobile View */}
            {!isCollapsed && (
                <div className="mb-6 flex items-center justify-between md:hidden">
                    <NavLink to="/" className="flex items-center space-x-2" onClick={onCloseMobileSidebar}>
                        <div className="bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end p-2 rounded-md">
                            <GitBranch className="text-white"/>
                        </div>
                        <span className="text-xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                            Pharmacy Panel
                        </span>
                    </NavLink>
                    {onCloseMobileSidebar && (
                        <button
                            onClick={onCloseMobileSidebar}
                            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            )}
            
            {/* Collapse button for desktop */}
            <button 
                onClick={toggleCollapse} 
                className="absolute -right-3 top-8 z-10 p-1 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hidden md:block"
            >
                {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            </button>
            
            <nav className="flex-1 flex flex-col space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.text}
                        to={item.path}
                        onClick={onCloseMobileSidebar} // Close on tap
                        className={({ isActive }) => 
                            `flex items-center justify-between py-3 rounded-lg transition-all duration-200 ${
                                isCollapsed ? 'px-3 justify-center' : 'px-4'
                            } ${
                                isActive 
                                ? 'bg-gradient-to-r from-[#0096C7] to-[#2A9D8F] text-white shadow-md' 
                                : 'text-muted-foreground hover:bg-muted'
                            }`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={22} className="flex-shrink-0" />
                            {!isCollapsed && <span className="font-semibold whitespace-nowrap">{item.text}</span>}
                        </div>
                        {!isCollapsed && item.isPremium && !isPremium && <Lock size={14} className="text-yellow-500 flex-shrink-0"/>}
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

export default ShopSidebar;