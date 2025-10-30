import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path as necessary

const PrivateRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a more sophisticated loading spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
        // Redirect to an unauthorized page or dashboard if role is not allowed or user.role is undefined
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
