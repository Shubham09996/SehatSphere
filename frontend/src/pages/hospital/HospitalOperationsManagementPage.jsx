import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Droplet, ShieldCheck, BriefcaseMedical } from 'lucide-react';

const HospitalOperationsManagementPage = ({ dashboardData }) => {
    const tokenSystem = dashboardData?.tokenSystem || {
        status: 'Active',
    };

    const labTests = dashboardData?.labTests || [
        { name: 'Complete Blood Count', price: 500 },
        { name: 'Urine Analysis', price: 200 },
        { name: 'Thyroid Panel', price: 800 },
    ];

    const bloodBank = dashboardData?.bloodBank || {
        APositive: 100,
        BPositive: 80,
        OPositive: 120,
        ANegative: 30,
    };

    const insuranceIntegrations = dashboardData?.insuranceIntegrations || [
        { name: 'HealthSecure', status: 'Active' },
        { name: 'MediCare', status: 'Inactive' },
    ];

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
                            {labTests.map((test, index) => (
                                <li key={index} className="flex items-center justify-between bg-muted/20 p-2 rounded-md">
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
                            {insuranceIntegrations.map((insurance, index) => (
                                <li key={index} className="flex items-center justify-between bg-muted/20 p-2 rounded-md">
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