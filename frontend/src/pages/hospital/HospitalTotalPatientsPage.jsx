import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const HospitalTotalPatientsPage = () => {
    const [patientsData, setPatientsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Remove operationalInsights as it's no longer passed via prop, and use the dashboard summary endpoint if needed elsewhere

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/api/hospitals/patients');
                setPatientsData(data);
                toast.success('Patient data loaded successfully!');
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || err.message);
                setPatientsData([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground p-8">Loading patient data...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* === GRADIENT COLORS CHANGE KIYE HAIN === */}
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6">Total Patients</h1>
            <p className="text-muted-foreground mb-8">Overview of patient statistics and management.</p>

            {/* Operational Insights for Patients */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
                    <p className="text-sm font-semibold text-muted-foreground">Total Patients</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{patientsData.length}</p>
                </div>
                {/* Removed other operational insights as they are part of the main dashboard and this page focuses on the patient list */}
                {/* If specific patient-related operational insights are needed here, they would require a separate API call or aggregation */}
            </div>

            {/* Patient List */}
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <h3 className="font-bold text-lg text-foreground mb-4">Current Patients</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="text-xs text-muted-foreground bg-muted/50">
                                <th className="p-2">ID</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Age</th>
                                <th className="p-2">Gender</th>
                                <th className="p-2">Last Visit</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientsData.map((patient) => (
                                <tr key={patient._id} className="border-b border-border/70 last:border-b-0">
                                    <td className="p-2 font-semibold text-foreground">{patient.id}</td>
                                    <td className="p-2 text-muted-foreground text-sm">{patient.name}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                            ${patient.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' : 
                                              patient.status === 'Checked In' ? 'bg-blue-100 text-blue-800' : 
                                              'bg-green-100 text-green-800'}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="p-2 text-muted-foreground text-sm">{patient.age}</td>
                                    <td className="p-2 text-muted-foreground text-sm">{patient.gender}</td>
                                    <td className="p-2 text-muted-foreground text-sm">{patient.lastVisit}</td>
                                    <td className="p-2 text-sm text-primary-500 cursor-pointer hover:underline">View Profile</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default HospitalTotalPatientsPage;