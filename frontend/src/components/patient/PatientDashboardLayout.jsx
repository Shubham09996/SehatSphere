import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import PatientSidebar from './PatientSidebar.jsx';
import Header from './Header.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import Chatbot from './Chatbot.jsx'; // Chatbot component imported
import api from '../../utils/api'; // Import the configured axios instance

const PatientDashboardLayout = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true); // New loading state
    const { theme, toggleTheme } = useTheme();
    const location = useLocation(); // Initialize useLocation
    const navigate = useNavigate(); // Initialize useNavigate

    // New useEffect to fetch user profile after component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await api.get('/api/users/profile');
                if (res.data) {
                    localStorage.setItem('userName', res.data.name);
                    localStorage.setItem('userProfilePicture', res.data.profilePicture); // Store profile picture
                    localStorage.setItem('userRole', res.data.role); // Store user role

                    if (res.data.specificProfile && res.data.role === 'Patient') {
                        localStorage.setItem('patientId', res.data.specificProfile.patientId);
                    }
                    window.dispatchEvent(new Event('localStorageUpdated'));
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // If fetching profile fails (e.g., 401 Unauthorized due to missing/expired httpOnly cookie),
                // then redirect to login.
                navigate('/login');
            } finally {
                setLoading(false); // Set loading to false after fetch attempt
            }
        };

        fetchUserProfile(); // Always attempt to fetch profile, rely on backend for auth status

    }, [navigate]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    if (loading) {
        // Optionally render a loading spinner or placeholder
        return <div className="flex items-center justify-center min-h-screen bg-background text-foreground">Loading dashboard...</div>;
    }

    // Ensure patientId is available before rendering dependent components
    if (localStorage.getItem('userRole') === 'Patient' && !localStorage.getItem('patientId')) {
        // This case should ideally not happen if onboarding is completed, but as a safeguard
        // If a patient is logged in but has no patientId, it might indicate incomplete onboarding or data issue
        // For now, we can redirect them to onboarding or show an error.
        console.error("Patient role detected but patientId not found in localStorage.");
        // You might want to redirect to onboarding page again or show a more specific error.
        // For now, let's redirect to login as a fallback.
        navigate('/login');
        return null; // Don't render anything else
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            <Header 
                isSidebarOpen={isMobileSidebarOpen} 
                setIsSidebarOpen={setIsMobileSidebarOpen}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className={`hidden md:block transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                    <PatientSidebar 
                        isCollapsed={isSidebarCollapsed} 
                        toggleCollapse={toggleSidebar}
                    />
                </div>

                {/* Mobile Sidebar (handled by Header button) */}
                <div 
                    className={`md:hidden fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                    onClick={() => setIsMobileSidebarOpen(false)}
                >
                    <div 
                        className={`fixed top-0 left-0 h-full w-64 bg-card transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PatientSidebar isCollapsed={false} onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)} />
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
            
            {/* Chatbot component added here to be available on all dashboard pages */}
            <Chatbot />
        </div>
    );
};

export default PatientDashboardLayout;