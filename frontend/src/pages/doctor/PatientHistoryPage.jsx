import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { Calendar, Stethoscope, FileText, Pill, Thermometer, Heart, User, Clock } from 'lucide-react';

const PatientHistoryPage = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientHistory = async () => {
            try {
                setLoading(true);
                // Fetch patient details and history
                const [patientRes, historyRes] = await Promise.all([
                    api.get(`/api/patients/${patientId}`),
                    api.get(`/api/doctors/patients/${patientId}/history`)
                ]);
                setPatient(patientRes.data);
                setHistory(historyRes.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch patient history');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientHistory();
    }, [patientId]);

    if (loading) {
        return <div className="text-center py-8 text-foreground">Loading patient history...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (!patient || !history) {
        return <div className="text-center py-8 text-muted-foreground">No patient history data found.</div>;
    }

    const renderHistoryCard = (item, index) => {
        let icon, title, details;

        if (item.type === 'appointment') {
            icon = <Calendar size={20} className="text-blue-500" />;
            title = `Appointment on ${new Date(item.date).toLocaleDateString()}`;
            details = (
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock size={16} /> Time: {item.time}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Stethoscope size={16} /> Doctor: {item.doctorName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><FileText size={16} /> Reason: {item.reason}</p>
                    {item.notes && <p className="text-sm text-muted-foreground flex items-center gap-2"><ClipboardList size={16} /> Notes: {item.notes}</p>}
                </div>
            );
        } else if (item.type === 'prescription') {
            icon = <Pill size={20} className="text-green-500" />;
            title = `Prescription on ${new Date(item.date).toLocaleDateString()}`;
            details = (
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Stethoscope size={16} /> Doctor: {item.doctorName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Pill size={16} /> Medicine: {item.medicineName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">Dosage: {item.dosage}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">Instructions: {item.instructions}</p>
                </div>
            );
        } else if (item.type === 'vitals') {
            icon = <Thermometer size={20} className="text-red-500" />;
            title = `Vitals recorded on ${new Date(item.date).toLocaleDateString()}`;
            details = (
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">Temperature: {item.temperature}°C</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">Blood Pressure: {item.bloodPressure}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">Heart Rate: {item.heartRate} bpm</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">Weight: {item.weight} kg</p>
                </div>
            );
        } else {
            icon = <FileText size={20} className="text-gray-500" />;
            title = `Record on ${new Date(item.date).toLocaleDateString()}`;
            details = <p className="text-sm text-muted-foreground">No specific details available.</p>;
        }

        return (
            <motion.div
                key={index}
                className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-start space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
                <div className="flex-shrink-0 mt-1">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-foreground">{title}</h3>
                    {details}
                </div>
            </motion.div>
        );
    };

    return (
        <motion.div
            className="space-y-8 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-4">
                {patient.profilePicture ? (
                    <img src={patient.profilePicture} alt={patient.user?.name} className="w-20 h-20 rounded-full object-cover shadow-lg" />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-muted-foreground shadow-lg">
                        <User size={40} />
                    </div>
                )}
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        {patient.user?.name || 'N/A'}'s History
                    </h1>
                    <p className="text-lg text-muted-foreground">Patient ID: {patient.patientId}</p>
                    <p className="text-md text-muted-foreground">Email: {patient.user?.email || 'N/A'}</p>
                    <p className="text-md text-muted-foreground">Phone: {patient.user?.phoneNumber || 'N/A'}</p>
                </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-md">
                <h2 className="text-2xl font-bold text-foreground mb-4">Complete Medical History</h2>
                {history.length > 0 ? (
                    <div className="space-y-6">
                        {history.map(renderHistoryCard)}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No medical history found for this patient.</p>
                )}
            </div>
        </motion.div>
    );
};

export default PatientHistoryPage;
