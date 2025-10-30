import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const PrescriptionHistory = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                setLoading(true);
                // Assuming user.doctorProfileId exists for a logged-in doctor
                // The backend /api/prescriptions/doctor endpoint will use req.user._id to filter
                const { data } = await api.get('/api/prescriptions/doctor');
                setPrescriptions(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch prescriptions');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'Doctor') {
            fetchPrescriptions();
        }
    }, [user]);

    if (loading) {
        return <div className="text-center py-8 text-foreground">Loading prescriptions...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <motion.div
            className="bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <h3 className="font-bold text-lg text-foreground">Issued Prescriptions</h3>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" placeholder="Search by patient..." className="w-full sm:w-64 bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs text-muted-foreground bg-muted/50">
                        <tr>
                            <th className="p-3">Prescription ID</th>
                            <th className="p-3">Patient Name</th>
                            <th className="p-3">Date Issued</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map(rx => (
                            <tr key={rx.id} className="border-b border-border hover:bg-muted cursor-pointer">
                                {/* === IS ID PAR GRADIENT LAGAYA HAI === */}
                                <td className="p-3 font-mono text-sm bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                                    {rx.prescriptionId}
                                </td>
                                <td className="p-3 font-semibold text-foreground">{rx.patient?.user?.name || 'N/A'}</td>
                                <td className="p-3 text-muted-foreground">{new Date(rx.issueDate).toLocaleDateString()}</td>
                                <td className="p-3">
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">{rx.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default PrescriptionHistory;