import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Mic, FileJson } from 'lucide-react';
// import { patientsData } from '../../../data/patientsData'; // Removed hardcoded patientsData import
import api from '../../../utils/api'; // Import API utility
import { useAuth } from '../../../context/AuthContext'; // Corrected import path for AuthContext

const PrescriptionWriter = ({ isOpen, onClose, preselectedPatient }) => {
    const [medicines, setMedicines] = useState([{ medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    const [notes, setNotes] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [expiryDate, setExpiryDate] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() + 7); // Default to 7 days from now
        return today.toISOString().split('T')[0];
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [availableMedicines, setAvailableMedicines] = useState([]); // State for medicines from API
    const { user } = useAuth(); // Get logged-in user (doctor)

    const doctorId = user?.specificProfileId; // Assuming specificProfileId is stored in user object for doctor

    useEffect(() => {
        if (isOpen) {
            // Fetch medicines from backend
            const fetchMedicines = async () => {
                try {
                    setLoading(true);
                    const { data } = await api.get('/api/medicines');
                    setAvailableMedicines(data);
                } catch (err) {
                    setError(err.response?.data?.message || 'Failed to fetch medicines');
                } finally {
                    setLoading(false);
                }
            };
            fetchMedicines();
        }
        if (!isOpen) { // Reset form when closed
            setMedicines([{ medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
            setNotes('');
            setIssueDate(new Date().toISOString().split('T')[0]);
            const today = new Date();
            today.setDate(today.getDate() + 7);
            setExpiryDate(today.toISOString().split('T')[0]);
            setError(null);
        }
    }, [isOpen]);

    const handleAddMedicine = () => {
        setMedicines([...medicines, { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const handleRemoveMedicine = (index) => {
        const list = [...medicines];
        list.splice(index, 1);
        setMedicines(list);
    };

    const handleMedicineChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...medicines];
        list[index][name] = value;
        setMedicines(list);
    };

    const handleSubmitPrescription = async () => {
        setError(null);
        if (!preselectedPatient) {
            setError('No patient selected for prescription.');
            return;
        }
        if (!doctorId) {
            setError('Doctor ID not found. Please log in again.');
            return;
        }
        if (medicines.every(med => !med.medicine)) {
            setError('Please add at least one medicine.');
            return;
        }

        try {
            setLoading(true);

            const formattedMedicines = medicines.filter(med => med.medicine).map(med => {
                const medicineDetails = availableMedicines.find(m => 
                    m.brandName.toLowerCase() === med.medicine.toLowerCase() || 
                    m.genericName.toLowerCase() === med.medicine.toLowerCase()
                ); // Find medicine by brandName or genericName
                return {
                    medicine: medicineDetails ? medicineDetails._id : null, // Use medicine _id if found, otherwise null
                    name: med.medicine, // Always include the typed medicine name
                    dosage: med.dosage,
                    frequency: med.frequency,
                    duration: med.duration,
                    instructions: med.instructions,
                };
            }); // No longer filter out medicines not found in list

            if (formattedMedicines.length === 0) {
                setError('No valid medicines added to prescription.');
                setLoading(false);
                return;
            }

            const prescriptionData = {
                patientId: preselectedPatient.patient._id, // Use the actual patient's MongoDB _id
                doctorId: doctorId,
                issueDate: issueDate,
                expiryDate: expiryDate,
                medicines: formattedMedicines,
                notes: notes,
                // prescriptionImage: null, // No image upload for now
            };

            await api.post('/api/prescriptions', prescriptionData);
            alert('Prescription issued successfully!');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: -30 }}
                    className="bg-card w-full max-w-4xl rounded-xl border border-border shadow-lg flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center border-b border-border">
                        <h2 className="text-lg font-bold text-foreground">Create New Prescription</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                        {/* Patient Selection */}
                        <div>
                            <label className="text-sm font-medium">Select Patient</label>
                            {preselectedPatient ? (
                                <input
                                    type="text"
                                    value={`${preselectedPatient.name} (${preselectedPatient.patientId})`}
                                    className="mt-1 w-full bg-background border border-border rounded-md p-2 cursor-not-allowed text-muted-foreground"
                                    disabled
                                />
                            ) : (
                                <p className="mt-1 text-red-500">No patient pre-selected. This component is typically used from the Now Serving card.</p>
                                // Original select dropdown was here, removed for this specific use case
                            )}
                        </div>
                        
                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Issue Date</label>
                                <input 
                                    type="date"
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                    className="mt-1 w-full bg-background border border-border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Expiry Date</label>
                                <input 
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="mt-1 w-full bg-background border border-border rounded-md p-2"
                                />
                            </div>
                        </div>

                        {/* Medicines List */}
                        <div className="space-y-4">
                             {medicines.map((med, i) => (
                                <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                    <input 
                                        list="medicines" 
                                        name="medicine"
                                        value={med.medicine} 
                                        onChange={e => handleMedicineChange(e, i)} 
                                        placeholder="Medicine Name" 
                                        className="sm:col-span-4 bg-background border border-border rounded-md p-2" 
                                    />
                                    <datalist id="medicines">
                                        {availableMedicines.map(m => <option key={m._id} value={m.name} />)}
                                    </datalist>
                                    <input name="dosage" value={med.dosage} onChange={e => handleMedicineChange(e, i)} placeholder="Dosage (e.g., 500mg)" className="sm:col-span-2 bg-background border border-border rounded-md p-2" />
                                    <input name="frequency" value={med.frequency} onChange={e => handleMedicineChange(e, i)} placeholder="Frequency (e.g., 1-0-1)" className="sm:col-span-2 bg-background border border-border rounded-md p-2" />
                                    <input name="duration" value={med.duration} onChange={e => handleMedicineChange(e, i)} placeholder="Duration (e.g., 5 days)" className="sm:col-span-2 bg-background border border-border rounded-md p-2" />
                                    <input name="instructions" value={med.instructions} onChange={e => handleMedicineChange(e, i)} placeholder="Instructions" className="sm:col-span-2 bg-background border border-border rounded-md p-2" />
                                    <button onClick={() => handleRemoveMedicine(i)} className="sm:col-span-1 text-red-500 hover:bg-red-500/10 p-2 rounded-md"><Trash2 size={18}/></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddMedicine} className="flex items-center gap-2 text-sm font-semibold text-primary"><Plus size={16}/> Add Medicine</button>

                        {/* Notes */}
                        <div className="relative">
                            <label className="text-sm font-medium">Doctor's Notes</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" placeholder="Add any special instructions..." className="mt-1 w-full bg-background border border-border rounded-md p-2 pr-10"></textarea>
                            <Mic size={16} className="absolute right-3 top-9 text-muted-foreground cursor-pointer"/>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
                        {loading && <p className="text-foreground text-sm mt-2">Loading medicines...</p>}
                    </div>

                    {/* Footer */}
                    <div className="p-4 flex flex-col sm:flex-row gap-3 border-t border-border bg-muted/50 rounded-b-xl">
                        <button className="flex-1 flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg border border-border text-foreground hover:bg-muted">
                            <FileJson size={16}/> Preview
                        </button>
                        <button 
                            onClick={handleSubmitPrescription} 
                            className="flex-1 flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                            disabled={loading}
                        >
                            {loading ? 'Issuing...' : 'Issue Prescription'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PrescriptionWriter;