import React from 'react';
import { FileText, Pill } from 'lucide-react'; // Import Pill for 'Prescribe' icon
import { useNavigate } from 'react-router-dom';

const PatientQueueCard = ({ patient, onSelectPatient, onViewHistory }) => {
    const navigate = useNavigate();
    const handleHistoryClick = () => {
        onViewHistory(patient.patient.patientId); // Call the passed handler with the correct patientId
    };

    return (
        <div 
            className="bg-card p-4 rounded-xl border border-border flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectPatient(patient.patient)}
        >
            <div className="flex items-center gap-3">
                <img src={patient.patient.profilePicture || 'https://via.placeholder.com/100'} alt={patient.patient.name} className="w-12 h-12 rounded-full object-cover"/>
                <div>
                    <p className="font-semibold text-foreground">{patient.patient.name}</p>
                    <p className="text-sm text-muted-foreground">Patient ID: {patient.patient.patientId}</p>
                    <p className="text-sm text-muted-foreground">{patient.reason || 'General check-up'}</p>
                    <p className="text-xs text-muted-foreground">Scheduled: {new Date(patient.date).toLocaleDateString()} at {patient.time}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card onClick from firing
                        handleHistoryClick();
                    }}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                    <FileText size={16}/> History
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card onClick from firing
                        const targetUrl = `/doctor/prescribe/${patient.patient._id}`;
                        navigate(targetUrl);
                    }}
                    className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                >
                    <Pill size={14}/> Prescribe
                </button>
            </div>
        </div>
    );
};

export default PatientQueueCard;