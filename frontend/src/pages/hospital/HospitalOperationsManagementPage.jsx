import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Droplet, ShieldCheck, BriefcaseMedical } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const HospitalOperationsManagementPage = () => {
    const [tokenSystem, setTokenSystem] = useState({});
    const [labTests, setLabTests] = useState([]);
    const [bloodBank, setBloodBank] = useState({});
    const [insuranceIntegrations, setInsuranceIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOperationsData = async () => {
            try {
                setLoading(true);
                const [tokenSystemRes, labTestsRes, bloodBankRes, insuranceIntegrationsRes] = await Promise.all([
                    api.get('/api/hospitals/token-system'),
                    api.get('/api/hospitals/lab-tests'),
                    api.get('/api/hospitals/blood-bank'),
                    api.get('/api/hospitals/insurance-integrations'),
                ]);

                setTokenSystem(tokenSystemRes.data);
                setLabTests(labTestsRes.data);
                setBloodBank(bloodBankRes.data);
                setInsuranceIntegrations(insuranceIntegrationsRes.data);

                toast.success('Operations management data loaded successfully!');
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || err.message);
                setTokenSystem({});
                setLabTests([]);
                setBloodBank({});
                setInsuranceIntegrations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOperationsData();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground p-8">Loading operations management data...</div>;
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
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6">Operations Management</h1>
            <p className="text-muted-foreground mb-8">Control day-to-day functional modules of the hospital.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Token System Control</h3>
                    <div className="h-40 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <p className="text-xl font-bold text-foreground">Token System: {tokenSystem.status}</p>
                            {/* Token System Control button par gradient */}
                            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-sm hover:opacity-90">Toggle Status</button>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Lab Test Management</h3>
                    <div className="h-40 flex items-center justify-center text-muted-foreground">
                        <ul className="space-y-2 w-full">
                            {labTests.map((test) => (
                                <li key={test.name} className="flex items-center justify-between bg-muted/20 p-2 rounded-md">
                                    <span className="font-medium text-foreground">{test.name}</span>
                                    <span className="text-sm text-muted-foreground">₹{test.price}</span>
                                </li>
                            ))}
                            {/* Add New Test button par gradient */}
                            <button className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-sm hover:opacity-90">Add New Test</button>
                        </ul>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Blood Bank Management</h3>
                    <div className="h-40 flex items-center justify-center text-muted-foreground">
                        <div className="text-center w-full">
                            <p className="text-xl font-bold text-foreground">Blood Stock (A+): {bloodBank.APositive} units</p>
                            <p className="text-xl font-bold text-foreground">Blood Stock (B+): {bloodBank.BPositive} units</p>
                            {/* Manage Requests button par gradient */}
                            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-sm hover:opacity-90">Manage Requests</button>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm lg:col-span-1">
                    <h3 className="font-bold text-lg text-foreground mb-4">Insurance Integration</h3>
                    <div className="h-40 flex items-center justify-center text-muted-foreground">
                        <ul className="space-y-2 w-full">
                            {insuranceIntegrations.map((insurance) => (
                                <li key={insurance.name} className="flex items-center justify-between bg-muted/20 p-2 rounded-md">
                                    <span className="font-medium text-foreground">{insurance.name}</span>
                                    <span className="text-sm text-muted-foreground">{insurance.status}</span>
                                </li>
                            ))}
                            {/* Add New Insurance button par gradient */}
                            <button className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-sm hover:opacity-90">Add New Insurance</button>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HospitalOperationsManagementPage;