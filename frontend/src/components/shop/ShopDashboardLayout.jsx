import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ShopSidebar from './ShopSidebar.jsx';
import ShopHeader from './ShopHeader.jsx';
import { shopData } from '../../data/shopData.js'; // To get the initial premium status

const ShopDashboardLayout = () => {
    // FIX: Added a comma between the state variable and the setter function.
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    
    // NEW: State for desktop sidebar collapse
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Premium status is managed at the layout level so it can be shared
    // with the sidebar (to show locks) and child pages (to show/hide content).
    const [isPremium, setIsPremium] = useState(shopData.shopInfo.isPremium);

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* The Header receives the state and the function to toggle it */}
            <ShopHeader 
                onMenuClick={() => setIsMobileSidebarOpen(true)}
                isPremium={isPremium}
                setIsPremium={setIsPremium}
            />
            
            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar (static) */}
                <div className={`hidden lg:block ${isCollapsed ? 'w-[70px]' : 'w-64'} flex-shrink-0 transition-all duration-300`}>
                    <ShopSidebar 
                        isPremium={isPremium} 
                        isCollapsed={isCollapsed} 
                        toggleCollapse={toggleCollapse}
                    />
                </div>
                
                {/* Mobile Sidebar (overlay) */}
                <div 
                    className={`fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                >
                    <div 
                        className={`absolute top-0 left-0 h-full w-64 bg-card transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <ShopSidebar 
                            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
                            isPremium={isPremium} 
                            isCollapsed={isCollapsed}
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/40">
                    {/* The Outlet passes the premium status down to the child pages (Dashboard, Analytics, etc.) */}
                    <Outlet context={{ isPremium, setIsPremium }} />
                </main>
            </div>
        </div>
    );
};

export default ShopDashboardLayout;