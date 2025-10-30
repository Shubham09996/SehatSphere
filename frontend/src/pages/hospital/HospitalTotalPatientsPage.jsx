import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const HospitalTotalPatientsPage = ({ dashboardData }) => {
    // Extract relevant data for Total Patients
    const operationalInsights = dashboardData?.operationalInsights || {
        patientsWaiting: 0,
        totalAppointmentsToday: 0,
        upcomingAppointments: 0,
    };
    
    // Dummy data for a simple list of patients
    const patientsData = dashboardData?.patients || [
        { id: 1, name: 'Rahul Sharma', status: 'Waiting', age: 34, gender: 'Male', lastVisit: '2023-10-25' },
        { id: 2, name: 'Priya Singh', status: 'Checked In', age: 28, gender: 'Female', lastVisit: '2023-10-26' },
        { id: 3, name: 'Amit Kumar', status: 'Discharged', age: 45, gender: 'Male', lastVisit: '2023-10-20' },
        { id: 4, name: 'Sneha Gupta', status: 'Waiting', age: 22, gender: 'Female', lastVisit: '2023-10-27' },
        { id: 5, name: 'Vikram Patel', status: 'Checked In', age: 50, gender: 'Male', lastVisit: '2023-10-28' },
        { id: 6, name: 'Neha Sharma', status: 'Discharged', age: 39, gender: 'Female', lastVisit: '2023-10-18' },
        { id: 7, name: 'Rohan Verma', status: 'Waiting', age: 19, gender: 'Male', lastVisit: '2023-10-29' },
        { id: 8, name: 'Anjali Devi', status: 'Checked In', age: 62, gender: 'Female', lastVisit: '2023-10-30' },
    ];

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
                    <p className="text-sm font-semibold text-muted-foreground">Patients Waiting</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{operationalInsights.patientsWaiting}</p>
                </div>
                <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
                    <p className="text-sm font-semibold text-muted-foreground">Appointments Today</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{operationalInsights.totalAppointmentsToday}</p>
                </div>
                <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
                    <p className="text-sm font-semibold text-muted-foreground">Upcoming Appointments</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{operationalInsights.upcomingAppointments}</p>
                </div>
            </div>

            {/* Patient List (Example) */}
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
                                <tr key={patient.id} className="border-b border-border/70 last:border-b-0">
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