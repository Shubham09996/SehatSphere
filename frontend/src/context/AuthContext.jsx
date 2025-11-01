import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api'; // Assuming you have an api utility for logout

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // NEW: Function to set auth data from redirect (e.g., from Google OAuth)
    const setAuthDataFromRedirect = (token, userInfo) => {
        const parsedUserInfo = JSON.parse(userInfo);
        localStorage.setItem('jwt', token);
        localStorage.setItem('userInfo', JSON.stringify(parsedUserInfo));
        setUser(parsedUserInfo);
        // NEW: Also store specificProfileId if available (for Google sign-ups)
        if (parsedUserInfo.specificProfileId) {
            if (parsedUserInfo.role === 'Patient') {
                localStorage.setItem('patientId', parsedUserInfo.specificProfileId);
            } else if (parsedUserInfo.role === 'Doctor') {
                localStorage.setItem('doctorId', parsedUserInfo.specificProfileId);
            } else if (parsedUserInfo.role === 'Shop') {
                localStorage.setItem('shopId', parsedUserInfo.specificProfileId);
            }
        }
    };

    useEffect(() => {
        const loadUserFromLocalStorage = () => {
            try {
                const storedUser = localStorage.getItem('userInfo');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    // Ensure specificProfileId is present for doctors
                    if (parsedUser.role === 'Doctor' && !parsedUser.specificProfileId) {
                        console.warn('Doctor user loaded from localStorage without specificProfileId.');
                        // You might want to re-fetch user profile here or clear userInfo
                        setUser(null); // Clear user if critical data is missing
                    } else {
                        setUser(parsedUser);
                    }
                }
            } catch (error) {
                console.error("Failed to parse user info from localStorage", error);
                localStorage.removeItem('userInfo');
            } finally {
                setLoading(false);
            }
        };
        loadUserFromLocalStorage();

        // NEW: Listen for localStorage changes
        const handleStorageChange = () => {
            loadUserFromLocalStorage();
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('localStorageUpdated', handleStorageChange); // Custom event

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('localStorageUpdated', handleStorageChange);
        };
    }, []);

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        localStorage.setItem('jwt', userData.token); // Store JWT in localStorage here
        console.log("AuthContext: JWT stored in localStorage:", localStorage.getItem('jwt')); // NEW LOG
        setUser(userData);
        // Ensure specificProfileId is always stored in localStorage regardless of role
        if (userData.specificProfileId) {
            if (userData.role === 'Doctor') {
                localStorage.setItem('doctorId', userData.specificProfileId); // Store doctorId in local storage
            } else if (userData.role === 'Patient') {
                localStorage.setItem('patientId', userData.specificProfileId); // Store patientId in local storage
            } else if (userData.role === 'Shop') {
                localStorage.setItem('shopId', userData.specificProfileId);
            }
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/users/logout'); // Call your logout API
        } catch (error) {
            console.error('Logout API failed:', error);
        } finally {
            // Clear ALL localStorage data
            localStorage.clear();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, setAuthDataFromRedirect }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};