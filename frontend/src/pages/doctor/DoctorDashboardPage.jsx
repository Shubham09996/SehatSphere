import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Stethoscope, Users, Clock, ClipboardList, CalendarCheck, FileText, BellRing, UserPlus, Heart, Zap, Award, FileWarning } from 'lucide-react';
import PatientQueueCard from '../../components/doctor/PatientQueueCard';
import NowServingCard from '../../components/doctor/NowServingCard';
import AppointmentQueue from '../../components/doctor/AppointmentQueue';
import HourlyActivityChart from '../../components/doctor/HourlyActivityChart';
import api from '../../utils/api'; // api.js se import karein
import { Link } from 'react-router-dom';
// import { doctorData } from '../../data/doctorData'; // Remove this import

const StatCard = ({ icon, title, value, change, colorClass }) => (
    <div className="bg-card p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>{icon}</div>
            <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
            </div>
        </div>
        {change && <p className={`text-xs font-semibold mt-2 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change} vs yesterday</p>}
    </div>
);

const DoctorDashboardPage = () => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    // const [dashboardStats, setDashboardStats] = useState(null); // Removed dashboardStats state
    const [queue, setQueue] = useState([]); // State for managing the appointment queue
    const [patients, setPatients] = useState([]); // State for doctor's patients
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const mockHourlyActivityData = Array.from({ length: 24 }, (_, i) => ({ // Hardcoded data
        hour: i,
        patients: Math.floor(Math.random() * 10) // Changed 'appointments' to 'patients'
    }));

    // Hardcoded dashboard stats
    const mockDashboardStats = {
        totalPatients: { value: 10, change: '+5%' },
        avgConsultationTime: { value: '15 mins', change: '-2%' },
        pendingReports: { value: 3, change: '+1' },
    };

    useEffect(() => {
        const fetchDoctorDashboardData = async () => {
            try {
                setLoading(true);
                const medicalRegistrationNumber = localStorage.getItem('doctorId'); // Retrieve doctorId from localStorage as medicalRegistrationNumber
                if (!medicalRegistrationNumber) {
                    setError(new Error('Doctor ID (Medical Registration Number) not found in local storage.'));
                    setLoading(false);
                    return;
                }
                const [infoRes, queueRes, patientsRes] = await Promise.all([
                    api.get(`/api/doctors/profile/${medicalRegistrationNumber}`), 
                    // api.get(`/api/doctors/dashboard-stats/${medicalRegistrationNumber}`), // Removed API call for dashboard stats
                    api.get(`/api/doctors/appointment-queue/${medicalRegistrationNumber}`),
                    api.get(`/api/patients`), // Fetch doctor's patients
                ]);

                setDoctorInfo(infoRes.data.personalInfo); // Corrected: Access personalInfo
                // setDashboardStats(statsRes.data.dashboardStats); // Removed setting dashboardStats state
                setQueue(queueRes.data); 
                setPatients(patientsRes.data); // Set doctor's patients

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDashboardData();
    }, []);

    const handleNextPatient = () => {
        setQueue(prevQueue => {
            const newQueue = JSON.parse(JSON.stringify(prevQueue)); // Deep copy for safe mutation
            const currentPatientIndex = newQueue.findIndex(p => p.status === 'Now Serving');
            
            if (currentPatientIndex !== -1) {
                newQueue[currentPatientIndex].status = 'Done';
            }
            
            const nextPatientIndex = newQueue.findIndex(p => p.status === 'Up Next');
            if (nextPatientIndex !== -1) {
                newQueue[nextPatientIndex].status = 'Now Serving';
                const upNextIndex = newQueue.findIndex((p, index) => index > nextPatientIndex && p.status === 'Waiting');
                if (upNextIndex !== -1) {
                    newQueue[upNextIndex].status = 'Up Next';
                }
            } else {
                const nextWaitingIndex = newQueue.findIndex(p => p.status === 'Waiting');
                if (nextWaitingIndex !== -1) {
                    newQueue[nextWaitingIndex].status = 'Now Serving';
                }
            }
            return newQueue;
        });
    };

    if (loading) {
        return <div className="text-center text-foreground">Loading doctor dashboard...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading dashboard: {error.message}</div>;
    }

    if (!doctorInfo || !queue) { // Removed dashboardStats from check
        return <div className="text-center text-muted-foreground">No doctor dashboard data found.</div>;
    }

    // Filter out patients with incomplete user data before sorting and processing the queue
    const filteredQueue = queue.filter(appointment => appointment.patient && appointment.patient.user && appointment.patient.user.name);

    // Refined queue processing logic
    const sortedQueue = [...filteredQueue].sort((a, b) => {
        const timeA = a.time.replace(':', '');
        const timeB = b.time.replace(':', '');
        return timeA - timeB;
    });

    let nowServing = sortedQueue.find(p => p.status === 'Now Serving');
    let upNext = null;
    let waiting = [];

    const availableForQueue = sortedQueue.filter(p => 
        p.status === 'Pending' || p.status === 'Confirmed' || p.status === 'Up Next' || p.status === 'Waiting'
    );

    const remainingQueue = availableForQueue.filter(p => 
        (!nowServing || p.id !== nowServing.id) && (p.status !== 'Now Serving')
    );

    if (remainingQueue.length > 0) {
        upNext = remainingQueue[0];
        waiting = remainingQueue.slice(1);
    }

    return (
        <div className="space-y-8">
            <div>
                {/* === IS HEADING PAR GRADIENT LAGAYA HAI === */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Welcome back, {doctorInfo.name}!
                </h1>
                <p className="text-muted-foreground mt-1">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<Users size={20}/>} title="Total Patients" value={mockDashboardStats.totalPatients.value} change={mockDashboardStats.totalPatients.change} colorClass="bg-blue-500/20 text-blue-500"/>
                <StatCard icon={<Clock size={20}/>} title="Avg. Consult Time" value={mockDashboardStats.avgConsultationTime.value} change={mockDashboardStats.avgConsultationTime.change} colorClass="bg-green-500/20 text-green-500"/>
                <StatCard icon={<FileWarning size={20}/>} title="Pending Reports" value={mockDashboardStats.pendingReports.value} change={mockDashboardStats.pendingReports.change} colorClass="bg-orange-500/20 text-orange-500"/>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <NowServingCard nowServingPatient={nowServing} onConsultationDone={handleNextPatient} />
                    <AppointmentQueue upNextPatient={upNext} waitingPatients={waiting} />
                </div>
                
                <div className="lg:col-span-1 space-y-8">
                    {/* The DoctorStatusToggle has been moved to the new DoctorHeader */}
                    <HourlyActivityChart data={mockHourlyActivityData} /> {/* Pass hardcoded data */}
                </div>
            </div>

            {/* New section for Patients List */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-md">
                <h2 className="text-2xl font-bold text-foreground mb-4">My Patients</h2>
                {patients.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border table-auto">
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left text-sm font-semibold text-muted-foreground">Patient ID</th>
                                    <th className="px-3 py-2 text-left text-sm font-semibold text-muted-foreground">Name</th>
                                    <th className="px-3 py-2 text-left text-sm font-semibold text-muted-foreground">Email</th>
                                    <th className="px-3 py-2 text-left text-sm font-semibold text-muted-foreground">Phone</th>
                                    <th className="px-3 py-2 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {patients.map(patient => (
                                    <tr key={patient._id}>
                                        <td className="px-3 py-2 text-sm text-foreground">{patient.patientId}</td>
                                        <td className="px-3 py-2 text-sm text-foreground">{patient.user?.name || 'N/A'}</td>
                                        <td className="px-3 py-2 text-sm text-foreground">{patient.user?.email || 'N/A'}</td>
                                        <td className="px-3 py-2 text-sm text-foreground">{patient.user?.phoneNumber || 'N/A'}</td>
                                        <td className="px-3 py-2 text-sm font-medium">
                                            <Link to={`/doctor/patients/${patient._id}`} className="text-blue-500 hover:underline">View Profile</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-muted-foreground">No patients found for your practice.</p>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboardPage;