import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar.jsx';
import DoctorHeader from './DoctorHeader.jsx';

const DoctorDashboardLayout = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-background">
            <DoctorHeader 
                isSidebarOpen={isMobileSidebarOpen} 
                setIsSidebarOpen={setIsMobileSidebarOpen}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* --- Desktop Sidebar --- */}
                <div className={`hidden md:block transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                    <DoctorSidebar 
                        isCollapsed={isSidebarCollapsed} 
                        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    />
                </div>
                
                {/* --- Mobile Sidebar --- */}
                <div 
                    className={`md:hidden fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                    onClick={() => setIsMobileSidebarOpen(false)}
                >
                    <div 
                        className={`fixed top-0 left-0 h-full w-64 bg-card transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* UPDATED: Passing the function to close the mobile sidebar on link clicks */}
                        <DoctorSidebar 
                            isCollapsed={false} 
                            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)} 
                        />
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DoctorDashboardLayout;