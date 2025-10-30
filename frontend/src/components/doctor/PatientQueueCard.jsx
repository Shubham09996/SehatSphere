import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Pill, Video } from 'lucide-react';
import PrescriptionWriter from './prescriptions/PrescriptionWriter';

const PatientQueueCard = ({ patient, isActive = false }) => {
    const [isPrescriptionWriterOpen, setIsPrescriptionWriterOpen] = useState(false);

    return (
        <motion.div 
            className={`p-4 rounded-xl border ${isActive ? 'bg-primary/10 border-primary' : 'bg-muted border-transparent'}`}
            layout
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={patient.profilePicture || '/placeholders/default_avatar.jpg'} alt={patient.name} className="w-14 h-14 rounded-full object-cover"/>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground">{patient.name}{patient.age ? `, ${patient.age}` : ''}</p>
                        {patient.token && <span className="font-mono text-xs px-2 py-0.5 bg-card rounded-md">Token: {patient.token}</span>} {/* Display token if available */}
                    </div>
                    <p className="text-sm text-muted-foreground">{patient.reason || 'General Consultation'}</p>
                    {patient.date && patient.time && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Scheduled: {new Date(patient.date).toLocaleDateString()} at {patient.time}
                        </p>
                    )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                     <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg border border-border hover:bg-border">
                        <FileText size={14}/> History
                    </button>
                     <button 
                        onClick={() => setIsPrescriptionWriterOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                    >
                        <Pill size={14}/> Prescribe
                    </button>
                </div>
            </div>

            <PrescriptionWriter 
                isOpen={isPrescriptionWriterOpen}
                onClose={() => setIsPrescriptionWriterOpen(false)}
                preselectedPatient={{ ...patient, patientId: patient.patientId }}
            />
        </motion.div>
    );
};

export default PatientQueueCard;