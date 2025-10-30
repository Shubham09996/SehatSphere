import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';

const AdminDashboardLayout = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* The Header now receives the state setter function */}
            <AdminHeader 
                isSidebarOpen={isMobileSidebarOpen} 
                setIsSidebarOpen={setIsMobileSidebarOpen}
            />
            
            <div className="flex flex-1 overflow-hidden">
                {/* --- Desktop Sidebar --- */}
                <div className={`hidden md:block transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                    <AdminSidebar 
                        isCollapsed={isSidebarCollapsed} 
                        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    />
                </div>
                
                {/* --- Mobile Sidebar Overlay --- */}
                <div 
                    className={`md:hidden fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                    onClick={() => setIsMobileSidebarOpen(false)}
                >
                    <div 
                        className={`fixed top-0 left-0 h-full w-64 bg-card transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* The sidebar inside the overlay receives the function to close itself */}
                        <AdminSidebar 
                            isCollapsed={false} 
                            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)} 
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/40">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;