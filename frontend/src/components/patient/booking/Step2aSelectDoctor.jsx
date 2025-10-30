import React, { useState, useEffect } from 'react';
import { User, Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../utils/api';

const Step2aSelectDoctor = ({ onNext, details, onBack }) => {
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [errorDoctors, setErrorDoctors] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!details.hospital || !details.department) {
                setLoadingDoctors(false);
                return;
            }
            try {
                setLoadingDoctors(true);
                const response = await api.get('/api/doctors', {
                    params: {
                        hospital: details.hospital._id,
                        specialty: details.department.name,
                    },
                });
                setDoctors(response.data);
            } catch (err) {
                setErrorDoctors(err);
            } finally {
                setLoadingDoctors(false);
            }
        };
        fetchDoctors();
    }, [details.hospital, details.department]);

    if (loadingDoctors) {
        return <div className="text-center text-foreground">Loading doctors...</div>;
    }

    if (errorDoctors) {
        return <div className="text-center text-red-500">Error loading doctors: {errorDoctors.message}</div>;
    }
    return (
        <div className="bg-card p-6 rounded-xl shadow-md">
            <ArrowLeft size={18} onClick={onBack} className="cursor-pointer text-muted-foreground mb-4"/>
            <h2 className="text-2xl font-bold text-foreground">Select a Doctor</h2>
            <p className="text-muted-foreground mb-6">Choose a doctor from {details.department.name} or book with the first available.</p>
            <div className="space-y-3">
                <motion.div onClick={() => onNext({ doctor: { _id: 'first_available', user: { name: 'First Available Doctor' } } })}
                    className="flex items-center gap-4 p-4 border-2 border-primary rounded-lg cursor-pointer hover:bg-muted bg-primary/10"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <Users className="text-primary" size={32} />
                    <div>
                        <h3 className="font-semibold text-foreground">First Available Doctor</h3>
                        <p className="text-sm text-muted-foreground">Book the earliest available slot in the department.</p>
                    </div>
                </motion.div>
                {doctors.length > 0 ? (
                    doctors
                        .filter(doc => doc.user && doc.user.name) // Filter out doctors with null user or missing name
                        .map(doc => (
                        <motion.div key={doc._id} onClick={() => onNext({ doctor: doc })}
                            className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted"
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                            <img src={doc.user?.profilePicture || "https://via.placeholder.com/100"} alt={doc.user?.name || 'Doctor'} className="w-12 h-12 object-cover rounded-full"/>
                            <div>
                                <h3 className="font-semibold text-foreground">Dr. {doc.user?.name || 'Unknown'}</h3>
                                <p className="text-sm text-muted-foreground">{doc.specialty} • {doc.experience} years of experience</p>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No doctors available for this department and hospital.</p>
                )}
            </div>
        </div>
    );
};
export default Step2aSelectDoctor;