import React from 'react';
import { Plus } from 'lucide-react';
import PrescriptionHistory from '../../components/doctor/prescriptions/PrescriptionHistory';
import { useNavigate } from 'react-router-dom';

const DoctorPrescriptionsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    {/* 1. HEADING PAR GRADIENT LAGAYA HAI */}
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Prescriptions</h1>
                    <p className="text-muted-foreground mt-1">Create and manage patient prescriptions.</p>
                </div>
                {/* 2. BUTTON PAR GRADIENT LAGAYA HAI */}
                <button 
                    onClick={() => navigate('/doctor/prescriptions/new')}
                    className="flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                >
                    <Plus size={18}/> Create New Prescription
                </button>
            </div>

            {/* Prescription Writer will open as a full-screen modal */}
            

            {/* Prescription History */}
            <PrescriptionHistory />
        </div>
    );
};
    
export default DoctorPrescriptionsPage;