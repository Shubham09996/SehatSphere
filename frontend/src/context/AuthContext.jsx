import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api'; // Assuming you have an api utility for logout

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
    }, []);

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
        if (userData.role === 'Doctor') {
            if (userData.specificProfileId) {
                localStorage.setItem('doctorId', userData.specificProfileId); // Store doctorId in local storage
            } else {
                console.warn('Doctor logging in without specificProfileId. Check userController.js response.');
            }
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/users/logout'); // Call your logout API
        } catch (error) {
            console.error('Logout API failed:', error);
        } finally {
            localStorage.removeItem('userInfo');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
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
