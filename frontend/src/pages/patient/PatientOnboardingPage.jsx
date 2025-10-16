import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientOnboardingModal from '../../components/patient/PatientOnboardingModal.jsx';

const PatientOnboardingPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true); // Always open when on this page

    const handleClose = () => {
        setIsOpen(false);
        navigate('/patient/dashboard'); // Redirect to dashboard after onboarding
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <PatientOnboardingModal
                isOpen={isOpen}
                onClose={handleClose}
                patientId={null} // patientId will be fetched by the modal itself using userId
                userId={userId}
            />
        </div>
    );
};

export default PatientOnboardingPage;
