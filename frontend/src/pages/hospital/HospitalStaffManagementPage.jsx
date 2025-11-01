import React from 'react';
import { motion } from 'framer-motion';
import { BriefcaseMedical, Users } from 'lucide-react';

const HospitalStaffManagementPage = ({ dashboardData }) => {
    const doctors = dashboardData?.doctors || [
        { name: 'Dr. John Doe', specialty: 'Cardiology', status: 'Available' },
        { name: 'Dr. Jane Smith', specialty: 'Pediatrics', status: 'Unavailable' },
        { name: 'Dr. Bob Johnson', specialty: 'Orthopedics', status: 'Available' },
    ];

    const aiAssignment = dashboardData?.aiAssignment || {
        status: 'Active',
        lastRun: '2023-07-24 10:30 AM',
    };

    const jobPostings = dashboardData?.jobPostings || [
        { title: 'Cardiologist', applicants: 5 },
        { title: 'Pediatric Nurse', applicants: 12 },
        { title: 'Lab Technician', applicants: 8 },
    ];

    const roles = dashboardData?.roles || [
        { name: 'Doctor', permissions: ['view_patients', 'manage_appointments'] },
        { name: 'Receptionist', permissions: ['schedule_appointments', 'register_patients'] },
        { name: 'Admin Staff', permissions: ['manage_staff', 'view_analytics'] },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* === GRADIENT COLORS CHANGE KIYE HAIN === */}
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6">Staff & Doctor Management</h1>
            <p className="text-muted-foreground mb-8">Centralized control over hospital staff, doctor roster, and AI assignments.</p>

            {/* Doctor Roster & AI Assignment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Doctor Roster</h3>
                    <div className="h-60 flex items-center justify-center text-muted-foreground">
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr className="text-xs text-muted-foreground bg-muted/50">
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Specialty</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((doctor, index) => (
                                    <tr key={index} className="border-b border-border/70 last:border-b-0">
                                        <td className="p-2 font-semibold text-foreground">{doctor.name}</td>
                                        <td className="p-2 text-muted-foreground text-sm">{doctor.specialty}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${doctor.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {doctor.status}
                                            </span>
                                        </td>
                                        <td className="p-2 text-sm text-primary-500 cursor-pointer hover:underline">Edit</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">AI Doctor Assignment Monitoring</h3>
                    <div className="h-60 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{aiAssignment.status}</p>
                            <p className="text-sm text-muted-foreground mt-2">Last run: {aiAssignment.lastRun}</p>
                            {/* AI Assignment button par gradient */}
                            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-sm hover:opacity-90">View Details</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Portal & Role-Based Access */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Job Portal Management</h3>
                    <div className="h-60 flex items-center justify-center text-muted-foreground">
                        <ul className="space-y-3 w-full">
                            {jobPostings.map((job, index) => (
                                <li key={index} className="flex items-center justify-between bg-muted/20 p-3 rounded-md">
                                    <span className="font-medium text-foreground">{job.title}</span>
                                    <span className="text-sm text-muted-foreground">{job.applicants} Applicants</span>
                                    {/* Job Posting button par gradient */}
                                    <button className="px-3 py-1 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-xs hover:opacity-90">View</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Role-Based Access Control</h3>
                    <div className="h-60 flex items-center justify-center text-muted-foreground">
                        <div className="w-full space-y-4">
                            {roles.map((role, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
                                    <span className="font-medium text-foreground">{role.name}</span>
                                    {/* Role-Based Access button par gradient */}
                                    <button className="px-3 py-1 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-xs hover:opacity-90">Manage Permissions</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HospitalStaffManagementPage;