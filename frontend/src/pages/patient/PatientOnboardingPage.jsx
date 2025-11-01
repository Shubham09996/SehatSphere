import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientOnboardingModal from '../../components/patient/PatientOnboardingModal.jsx';
import { useAuth } from '../../context/AuthContext';

const PatientOnboardingPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(true); // Always open when on this page

    const handleClose = () => {
        setIsOpen(false);
        navigate('/patient/dashboard'); // Redirect to dashboard after onboarding
    };

    // Get patientId directly from localStorage or user context as a fallback
    const patientId = localStorage.getItem('patientId') || user?.specificProfileId;

    // Render loading or null until user data is fully loaded and patientId is available
    if (loading || !user || !patientId) { // Check for patientId here
        return <div>Loading patient data...</div>; // Or a more sophisticated loading component
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <PatientOnboardingModal
                isOpen={isOpen}
                onClose={handleClose}
                patientId={patientId} // Pass patientId directly from variable
                userId={userId}
            />
        </div>
    );
};

export default PatientOnboardingPage;
