import React from 'react';
import { FileText, Stethoscope } from 'lucide-react'; // Import Stethoscope for 'Prescribe' icon
import { useNavigate } from 'react-router-dom';

const PatientQueueCard = ({ patient }) => {
    const navigate = useNavigate();
    const handleHistoryClick = () => {
        navigate(`/doctor/patients/${patient.id}`); // Assuming patient.id is the MongoDB _id
    };
    const handlePrescribeClick = () => {
        // Logic to open prescription writer, passing patient details
        console.log(`Prescribe for ${patient.name}`);
        // You might open a modal or navigate to a prescription page
        navigate(`/doctor/prescriptions/new?patientId=${patient.id}`);
    };

    return (
        <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <img src={patient.profilePicture || 'https://via.placeholder.com/100'} alt={patient.name} className="w-12 h-12 rounded-full object-cover"/>
                <div>
                    <p className="font-semibold text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">Patient ID: {patient.patientId}</p>
                    <p className="text-sm text-muted-foreground">{patient.reason || 'General check-up'}</p>
                    <p className="text-xs text-muted-foreground">Scheduled: {new Date(patient.date).toLocaleDateString()} at {patient.time}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={handleHistoryClick}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                    <FileText size={16}/> History
                </button>
                <button 
                    onClick={handlePrescribeClick}
                    className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                >
                    <Stethoscope size={16}/> Prescribe
                </button>
            </div>
        </div>
    );
};

export default PatientQueueCard;