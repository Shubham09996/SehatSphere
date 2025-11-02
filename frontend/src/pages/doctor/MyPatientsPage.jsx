import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search } from 'lucide-react';
// import { patientsData as initialPatients } from '../../data/patientsData'; // Commented out hardcoded data import
import PatientListTable from '../../components/doctor/patients/PatientListTable';
import PatientDetailDrawer from '../../components/doctor/patients/PatientDetailDrawer';
import AddPatientModal from '../../components/doctor/patients/AddPatientModal';
import { useLocation } from 'react-router-dom';
import api from '../../utils/api'; // Import api for backend calls

const filterOptions = ['All', 'New', 'Active', 'Needs Follow-up'];

const MyPatientsPage = () => {
    const [patients, setPatients] = useState([]); // Initialize with empty array
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    // State for Secret Notes Modal
    const [showSecretNotesModal, setShowSecretNotesModal] = useState(false);
    const [currentSecretNotes, setCurrentSecretNotes] = useState([]);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [editableNotes, setEditableNotes] = useState([]);
    const [modalLoading, setModalLoading] = useState(false); // Use separate loading state for modal

    // State for Patient History Modal
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [patientHistory, setPatientHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // Functions for Secret Notes Modal
    const fetchSecretNotes = async (patientId) => {
        try {
            setModalLoading(true);
            const response = await api.get(`/api/prescriptions/doctor`);
            const allPrescriptions = response.data;
            const patientPrescriptions = allPrescriptions.filter(prescription => prescription.patient.patientId === patientId);
            
            const notesArray = patientPrescriptions
                .filter(prescription => prescription.secretNotes) // Only include prescriptions with secret notes
                .map(prescription => ({ 
                    _id: prescription._id, 
                    secretNotes: prescription.secretNotes 
                }));

            setCurrentSecretNotes(notesArray);
            setEditableNotes(notesArray);
            setIsEditingNotes(false); // Ensure not in editing mode initially
            setShowSecretNotesModal(true);
        } catch (error) {
            console.error('Error fetching secret notes:', error);
            setCurrentSecretNotes([]);
            setEditableNotes([]);
            setShowSecretNotesModal(true);
        } finally {
            setModalLoading(false);
        }
    };

    const handleEditClick = () => {
        setIsEditingNotes(true);
    };

    const handleNoteChange = (e, index) => {
        const newEditableNotes = [...editableNotes];
        newEditableNotes[index].secretNotes = e.target.value;
        setEditableNotes(newEditableNotes);
    };

    const handleSaveNotes = async () => {
        try {
            setModalLoading(true);
            for (const note of editableNotes) {
                const originalNote = currentSecretNotes.find(n => n._id === note._id);
                if (originalNote && originalNote.secretNotes !== note.secretNotes) {
                    console.log(`Frontend: Attempting to update note with ID: ${note._id} with new content: "${note.secretNotes}"`);
                    const response = await api.put(`/api/prescriptions/${note._id}`, { secretNotes: note.secretNotes });
                    console.log('Frontend: API PUT response for secret note:', response.data);
                }
            }
            setCurrentSecretNotes(editableNotes); // Update current notes with saved changes
            setIsEditingNotes(false);
            alert('Secret notes updated successfully!');
        } catch (error) {
            console.error('Frontend: Error updating secret notes:', error.response?.data?.message || error.message);
            alert('Failed to update secret notes. Please try again.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditableNotes(currentSecretNotes); // Revert changes
        setIsEditingNotes(false);
    };

    const handleSeeSecretNotes = (patientId) => {
        fetchSecretNotes(patientId);
    };

    const handleViewHistory = async (patientId) => {
        try {
            setHistoryLoading(true);
            setHistoryError(null);
            // Make API call to fetch patient history
            const response = await api.get(`/api/patients/${patientId}/history`); // Assuming this endpoint exists
            console.log("Patient History API Response Data:", response.data); // Debug log
            setPatientHistory(response.data);
            setShowHistoryModal(true);
        } catch (error) {
            console.error('Error fetching patient history:', error);
            setHistoryError(error.response?.data?.message || 'Failed to fetch patient history.');
            setPatientHistory([]);
            setShowHistoryModal(true);
        } finally {
            setHistoryLoading(false);
        }
    };

    // Hardcoded patients data
    // const hardcodedPatientsData = [
    //     {
    //         id: 'PID-102938',
    //         name: 'Ravi Kumar',
    //         pfp: 'https://avatar.iran.liara.run/public/boy?username=Ravi',
    //         age: 34,
    //         gender: 'Male',
    //         lastVisit: '10/5/2025',
    //         status: 'Active',
    //         contact: { phone: '9650843194', email: 'bittu123@gmail.com' },
    //         criticalInfo: { allergies: ['Penicillin'], chronicConditions: ['Asthma'] },
    //         recentVitals: { bloodPressure: '120/80', bloodSugar: '90 mg/dL' },
    //         recentActivity: [
    //             { date: '10/5/2025', title: 'Consultation with Dr. Sharma' },
    //             { date: '9/15/2025', title: 'Lab Report - Blood Test' },
    //         ],
    //     },
    //     {
    //         id: 'PID-102939',
    //         name: 'Sunita Sharma',
    //         pfp: 'https://avatar.iran.liara.run/public/girl?username=Sunita',
    //         age: 28,
    //         gender: 'Female',
    //         lastVisit: '10/2/2025',
    //         status: 'Needs Follow-up',
    //         contact: { phone: '8877665544', email: 'sunita.sharma@example.com' },
    //         criticalInfo: { allergies: ['None'], chronicConditions: ['Hypothyroidism'] },
    //         recentVitals: { bloodPressure: '110/70', bloodSugar: '100 mg/dL' },
    //         recentActivity: [
    //             { date: '10/2/2025', title: 'Follow-up with Dr. Gupta' },
    //         ],
    //     },
    //     {
    //         id: 'PID-102940',
    //         name: 'Amit Singh',
    //         pfp: 'https://avatar.iran.liara.run/public/boy?username=Amit',
    //         age: 45,
    //         gender: 'Male',
    //         lastVisit: '9/28/2025',
    //         status: 'Active',
    //         contact: { phone: '7788990011', email: 'amit.singh@example.com' },
    //         criticalInfo: { allergies: ['Dust'], chronicConditions: ['Diabetes'] },
    //         recentVitals: { bloodPressure: '130/85', bloodSugar: '140 mg/dL' },
    //         recentActivity: [
    //             { date: '9/28/2025', title: 'Consultation with Dr. Khan' },
    //         ],
    //     },
    // ];

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const doctorProfileId = localStorage.getItem('doctorProfileId'); // Corrected key
                console.log('MyPatientsPage: doctorProfileId from localStorage:', doctorProfileId); // Debug log
                if (!doctorProfileId) {
                    setError(new Error('Doctor Profile ID not found in local storage.'));
                    setLoading(false);
                    console.log('MyPatientsPage: No doctorProfileId, setting error and loading to false.'); // Debug log
                    return;
                }
                const response = await api.get(`/api/patients`); // Adjusted API call to fetch doctor's specific patients
                console.log('MyPatientsPage: API response data:', response.data); // Debug log
                
                if (!Array.isArray(response.data)) {
                    throw new Error("API response is not an array.");
                }

                const formattedDynamicPatients = response.data
                    .filter(p => p.user && p.user.name) // Filter out patients with null user or missing name
                    .map(p => ({
                    id: p.patientId, // Use patientId as id
                    name: p.user?.name || 'Unknown Patient',
                    pfp: p.user?.profilePicture || 'https://avatar.iran.liara.run/public/boy?username=Default', // Fallback for profile picture
                    age: new Date().getFullYear() - new Date(p.dob).getFullYear(),
                    gender: p.gender,
                    lastVisit: p.recentActivity && p.recentActivity.length > 0 
                               ? formatLastVisitDate(p.recentActivity[0].date)
                               : 'N/A',
                    status: p.status || 'Active', // Assuming patient has a status or default to Active
                    contact: { phone: p.user?.phoneNumber || 'N/A', email: p.user?.email || 'N/A' },
                    criticalInfo: { 
                        allergies: p.allergies && p.allergies.length > 0 ? p.allergies : ['None'], 
                        chronicConditions: p.chronicConditions && p.chronicConditions.length > 0 ? p.chronicConditions : ['None'],
                    },
                    recentVitals: { 
                        bloodPressure: p.recentVitals?.bloodPressure?.value || 'N/A',
                        bloodSugar: p.recentVitals?.bloodSugar?.value || 'N/A',
                    },
                    recentActivity: p.recentActivity || [],
                }));

                // Merge dynamic patients with hardcoded patients, prioritizing hardcoded if IDs conflict
                // const mergedPatients = hardcodedPatientsData.map(hp => {
                //     const dynamicMatch = formattedDynamicPatients.find(dp => dp.id === hp.id);
                //     return dynamicMatch ? { ...dynamicMatch, ...hp } : hp; // Prioritize hardcoded for specific fields
                // }).concat(formattedDynamicPatients.filter(dp => !hardcodedPatientsData.some(hp => hp.id === dp.id)));

                setPatients(formattedDynamicPatients); // Set patients directly from dynamic data
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Helper function to format last visit date
    const formatLastVisitDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.warn('Invalid date string for lastVisit:', dateString); // Debug log
                return 'Invalid Date';
            }
            return date.toLocaleDateString();
        } catch (e) {
            console.error('Error formatting date:', dateString, e); // Debug log
            return 'Invalid Date';
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromUrl = queryParams.get('patientId');
        if (idFromUrl) {
            setSelectedPatientId(idFromUrl);
        }
    }, [location.search]);

    const filteredPatients = useMemo(() => {
        return patients
            .filter(p => {
                if (activeFilter === 'All') return true;
                return p.status === activeFilter;
            })
            .filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    }, [searchTerm, patients, activeFilter]);

    const selectedPatient = useMemo(() => {
        return patients.find(p => p.id === selectedPatientId);
    }, [selectedPatientId, patients]);

    const handleAddPatient = (newPatientData) => {
        // For now, only add to frontend state
        const newPatient = {
            id: `PID-${Math.floor(100000 + Math.random() * 900000)}`,
            name: newPatientData.name,
            pfp: `https://avatar.iran.liara.run/public/${newPatientData.gender === 'Male' ? 'boy' : 'girl'}?username=${newPatientData.name.split(' ')[0]}`,
            age: new Date().getFullYear() - new Date(newPatientData.dob).getFullYear(),
            gender: newPatientData.gender,
            lastVisit: new Date().toISOString().split('T')[0],
            status: newPatientData.status,
            contact: { phone: newPatientData.phone, email: newPatientData.email },
            criticalInfo: { 
                allergies: newPatientData.allergies ? newPatientData.allergies.split(',').map(a => a.trim()) : ['None'], 
                chronicConditions: newPatientData.chronicConditions ? newPatientData.chronicConditions.split(',').map(c => c.trim()) : ['None'],
            },
            recentVitals: { 
                bloodPressure: newPatientData.bloodPressure || 'N/A',
                bloodSugar: newPatientData.bloodSugar || 'N/A',
            },
            recentActivity: [
                { date: new Date().toISOString().split('T')[0], title: 'Patient Registered' }
            ]
        };
        setPatients(prevPatients => [newPatient, ...prevPatients]);
        setIsModalOpen(false);
    };

    if (loading) return <p className="text-center text-foreground mt-8">Loading patients...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">Error: {error.message}</p>;

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Patients</h1>
                    <p className="text-muted-foreground mt-1">Search, view, and manage your patient records.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                >
                    <UserPlus size={18}/> Add New Patient
                </button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search by patient name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {filterOptions.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`relative px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                activeFilter !== filter && 'text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            {activeFilter === filter && (
                                <motion.div layoutId="patient-filter-indicator" className="absolute inset-0 bg-hs-gradient-start/10 rounded-full" />
                            )}
                            {/* === GRADIENT KO DIRECT TEXT WALE SPAN PAR LAGAYA HAI === */}
                            <span className={`relative z-10 ${
                                activeFilter === filter ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text' : ''
                            }`}>
                                {filter}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Patient List */}
            <div className="flex-1 overflow-hidden">
                <PatientListTable patients={filteredPatients} onPatientSelect={setSelectedPatientId} onSeeSecretNotes={handleSeeSecretNotes} />
                {/* <p>Patient list will go here.</p> */}
            </div>
            
            <AnimatePresence>
                {selectedPatient && (
                    <PatientDetailDrawer patient={selectedPatient} onClose={() => setSelectedPatientId(null)} onViewHistory={handleViewHistory} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && (
                    <AddPatientModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onAddPatient={handleAddPatient} 
                    />
                )}
            </AnimatePresence>

            {/* Secret Notes Modal */}
            <AnimatePresence>
                {showSecretNotesModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: -30 }}
                            className="bg-card p-6 rounded-lg shadow-xl max-w-lg w-full"
                        >
                            <h2 className="text-xl font-bold mb-4 text-foreground">Secret Notes</h2>
                            <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto ">
                                {currentSecretNotes.length > 0 ? (
                                    editableNotes.map((note, index) => (
                                        <div key={note._id} className="mb-4 last:mb-0">
                                            <p className="text-sm font-semibold text-foreground mb-1">Prescription ID: {note._id}</p>
                                            {isEditingNotes ? (
                                                <textarea
                                                    value={note.secretNotes}
                                                    onChange={(e) => handleNoteChange(e, index)}
                                                    rows="3"
                                                    className="w-full bg-background border border-border rounded-md p-2"
                                                ></textarea>
                                            ) : (
                                                <p className="text-muted-foreground whitespace-pre-wrap">{note.secretNotes}</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">No secret notes found for this patient.</p>
                                )}
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                {isEditingNotes ? (
                                    <>
                                        <button
                                            onClick={handleSaveNotes}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            disabled={modalLoading}
                                        >
                                            {modalLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                            disabled={modalLoading}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditClick}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                    >
                                        Edit Notes
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowSecretNotesModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Patient History Modal */}
            <AnimatePresence>
                {showHistoryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: -30 }}
                            className="bg-card p-6 rounded-lg shadow-xl max-w-lg w-full"
                        >
                            <h2 className="text-xl font-bold mb-4 text-foreground">Patient History</h2>
                            {historyLoading ? (
                                <p>Loading history...</p>
                            ) : historyError ? (
                                <p className="text-red-500">Error: {historyError}</p>
                            ) : patientHistory.length > 0 ? (
                                <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto">
                                    {patientHistory.map((item, index) => (
                                        <div key={index} className="mb-4 last:mb-0">
                                            <p className="text-sm font-semibold text-foreground mb-1">Date: {new Date(item.date).toLocaleDateString()}</p>
                                            {item.type === 'Prescription' ? (
                                                <div className="text-muted-foreground whitespace-pre-wrap">
                                                    <p>Prescribed by Dr. {item.doctorName}.</p>
                                                    <p>Notes: {item.notes}.</p>
                                                    <p>Medicines: {item.medicines}</p>
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground whitespace-pre-wrap">{item.details}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No history found for this patient.</p>
                            )}
                            <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={() => setShowHistoryModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyPatientsPage;