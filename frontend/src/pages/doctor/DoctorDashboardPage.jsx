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
    const [dashboardStats, setDashboardStats] = useState(null);
    const [hourlyActivity, setHourlyActivity] = useState([]);
    const [queue, setQueue] = useState([]); // State for managing the appointment queue
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const [infoRes, statsRes, activityRes, queueRes] = await Promise.all([
                    api.get(`/api/doctors/profile/${medicalRegistrationNumber}`), 
                    api.get(`/api/doctors/dashboard-stats/${medicalRegistrationNumber}`),
                    api.get(`/api/doctors/hourly-activity/${medicalRegistrationNumber}`),
                    api.get(`/api/doctors/appointment-queue/${medicalRegistrationNumber}`),
                ]);

                setDoctorInfo(infoRes.data.personalInfo); // Corrected: Access personalInfo
                setDashboardStats(statsRes.data.dashboardStats); 
                setHourlyActivity(activityRes.data); // Corrected: Access data directly from activityRes
                setQueue(queueRes.data); 

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

    if (!doctorInfo || !dashboardStats || !hourlyActivity || !queue) {
        return <div className="text-center text-muted-foreground">No doctor dashboard data found.</div>;
    }

    const nowServing = queue.find(p => p.status === 'Now Serving');
    const upNext = queue.find(p => p.status === 'Up Next');
    const waiting = queue.filter(p => p.status === 'Waiting');

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
                <StatCard icon={<Users size={20}/>} title="Total Patients" value={dashboardStats.totalPatients.value} change={dashboardStats.totalPatients.change} colorClass="bg-blue-500/20 text-blue-500"/>
                <StatCard icon={<Clock size={20}/>} title="Avg. Consult Time" value={dashboardStats.avgConsultationTime.value} change={dashboardStats.avgConsultationTime.change} colorClass="bg-green-500/20 text-green-500"/>
                <StatCard icon={<FileWarning size={20}/>} title="Pending Reports" value={dashboardStats.pendingReports.value} change={dashboardStats.pendingReports.change} colorClass="bg-orange-500/20 text-orange-500"/>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <NowServingCard nowServingPatient={nowServing} onConsultationDone={handleNextPatient} />
                    <AppointmentQueue upNextPatient={upNext} waitingPatients={waiting} />
                </div>
                
                <div className="lg:col-span-1 space-y-8">
                    {/* The DoctorStatusToggle has been moved to the new DoctorHeader */}
                    <HourlyActivityChart data={hourlyActivity} />
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboardPage;