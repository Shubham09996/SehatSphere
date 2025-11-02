import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../utils/api'; // Import the API utility
// import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'; // Commented out headlessui components

const statusStyles = {
    'Active': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Needs Follow-up': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'New': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};

const PatientListTable = ({ patients, onPatientSelect, onSeeSecretNotes }) => {
    // Removed secret notes modal state and logic
    // const [showSecretNotesModal, setShowSecretNotesModal] = useState(false);
    // const [currentSecretNotes, setCurrentSecretNotes] = useState([]);
    // const [isEditingNotes, setIsEditingNotes] = useState(false);
    // const [editableNotes, setEditableNotes] = useState([]);
    // const [loading, setLoading] = useState(false);

    // Removed useEffect for isEditingNotes
    // useEffect(() => {
    //     console.log("Frontend: isEditingNotes state changed to:", isEditingNotes);
    // }, [isEditingNotes]);

    // Removed fetchSecretNotes, handleEditClick, handleNoteChange, handleSaveNotes, handleCancelEdit functions
    // const fetchSecretNotes = async (patientId) => { /* ... */ };
    // const handleEditClick = () => { /* ... */ };
    // const handleNoteChange = (e, index) => { /* ... */ };
    // const handleSaveNotes = async () => { /* ... */ };
    // const handleCancelEdit = () => { /* ... */ };

    return (
        // NEW: Container for scrollability
        <div className="h-full bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-y-auto">
            <table className="w-full text-left">
                {/* NEW: Sticky header for scrolling */}
                <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm text-sm text-muted-foreground z-10">
                    <tr>
                        <th className="p-4">Patient ID</th>
                        <th className="p-4">Patient Name</th>
                        <th className="p-4 hidden md:table-cell">Last Visit</th>
                        <th className="p-4 hidden sm:table-cell">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.length > 0 ? (
                        patients.map(patient => (
                            <tr 
                                key={patient.id} 
                                // onClick={() => onPatientSelect(patient.id)} // Remove direct row click for detail drawer
                                className="border-t border-border hover:bg-muted cursor-pointer"
                            >
                                <td className="p-4 text-sm text-foreground font-semibold" onClick={() => onPatientSelect(patient.id)}>{patient.id}</td>
                                <td className="p-4" onClick={() => onPatientSelect(patient.id)}>
                                    <div className="flex items-center gap-3">
                                        <img src={patient.pfp || 'https://via.placeholder.com/100'} alt={patient.name || 'Unknown Patient'} className="w-10 h-10 rounded-full"/>
                                        <div>
                                            <p className="font-bold text-foreground">{patient.name || 'Unknown Patient'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell" onClick={() => onPatientSelect(patient.id)}>
                                    {new Date(patient.lastVisit).toLocaleDateString()}
                                </td>
                                <td className="p-4 hidden sm:table-cell" onClick={() => onPatientSelect(patient.id)}>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[patient.status]}`}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onPatientSelect(patient.id); }}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            View Details
                                        </button>
                                        <span className="text-muted-foreground">|</span>
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                onSeeSecretNotes(patient.id);
                                            }}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            See Secret Notes
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-12 text-muted-foreground">
                                No patients found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Removed secret notes modal */}
        </div>
    );
};

export default PatientListTable;