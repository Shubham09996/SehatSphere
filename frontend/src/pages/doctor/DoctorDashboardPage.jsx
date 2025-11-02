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
    const [dashboardStats, setDashboardStats] = useState(null); // Added dashboardStats state
    const [queue, setQueue] = useState([]); // State for managing the appointment queue
    const [patients, setPatients] = useState([]); // State for doctor's patients
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hourlyActivityData, setHourlyActivityData] = useState([]); // State for real hourly activity data

    // State for Patient History Modal
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [patientHistory, setPatientHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    // Removed hardcoded dashboard stats

    const handleViewHistory = async (patientId) => {
        try {
            setHistoryLoading(true);
            setHistoryError(null);
            // Make API call to fetch patient history
            const response = await api.get(`/api/patients/${patientId}/history`); 
            setPatientHistory(response.data);
            setShowHistoryModal(true);
        } catch (error) {
            console.error('Error fetching patient history:', error);
            setHistoryError(error.response?.data?.message || 'Failed to fetch patient history.');
            setPatientHistory([]);
            setShowHistoryModal(true);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        const fetchDoctorDashboardData = async () => {
            try {
                setLoading(true);
                const doctorProfileId = localStorage.getItem('doctorProfileId'); // Retrieve doctorProfileId
                console.log("DoctorDashboardPage: doctorProfileId from localStorage:", doctorProfileId); // Debug log
                if (!doctorProfileId) {
                    setError(new Error('Doctor Profile ID not found in local storage.'));
                    setLoading(false);
                    return;
                }

                // Removed the initial fetch of doctorProfile as medicalRegistrationNumber is directly available
                // const doctorProfileRes = await api.get(`/api/doctors/${doctorIdFromLocalStorage}`);
                // const doctorProfile = doctorProfileRes.data;
                // console.log("Doctor Profile fetched:", doctorProfile); // Debug log
                // console.log("Doctor User object:", doctorProfile.user); // Debug log
                // const medicalRegistrationNumber = doctorProfile.medicalRegistrationNumber;
                
                // The medicalRegistrationNumber is now directly from localStorage
                
                const [doctorProfileRes, queueRes, patientsRes, statsRes, hourlyActivityRes] = await Promise.all([
                    api.get(`/api/doctors/${doctorProfileId}`), // Fetch full profile using doctorProfileId
                    api.get(`/api/doctors/appointment-queue/${doctorProfileId}`),
                    api.get(`/api/patients`), // Fetch doctor's patients (this might need to be specific to the doctor's patients in future)
                    api.get(`/api/doctors/dashboard-stats/${doctorProfileId}`),
                    api.get(`/api/doctors/hourly-activity/${doctorProfileId}`),
                ]);

                // Set doctor info from the newly fetched doctorProfileRes
                setDoctorInfo(doctorProfileRes.data.user); // Assuming doctorProfileRes.data contains a user object
                setQueue(queueRes.data);
                setPatients(patientsRes.data); // Set doctor's patients
                setDashboardStats(statsRes.data.dashboardStats); // Set dashboardStats state
                setHourlyActivityData(hourlyActivityRes.data); // Set hourly activity data

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

    if (!doctorInfo || !queue || !dashboardStats || !hourlyActivityData) { // Added hourlyActivityData to check
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

    console.log("DoctorDashboardPage: nowServing", nowServing);
    console.log("DoctorDashboardPage: upNext", upNext);
    console.log("DoctorDashboardPage: waiting", waiting);

    return (
        <div className="space-y-8">
            <div>
                {/* === IS HEADING PAR GRADIENT LAGAYA HAI === */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Welcome back, {doctorInfo?.name || 'Doctor'}!
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
                    <AppointmentQueue upNextPatient={upNext} waitingPatients={waiting} onViewHistory={handleViewHistory} />
                </div>
                
                <div className="lg:col-span-1 space-y-8">
                    {/* The DoctorStatusToggle has been moved to the new DoctorHeader */}
                    <HourlyActivityChart data={hourlyActivityData} /> {/* Pass real hourly activity data */}
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
                                    <th className="px-3 py-2 text-left text-sm font-semibold text-muted-foreground">Profile Picture</th>
                                    <th className="px-3 py-2 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {patients.map(patient => (
                                    <tr key={patient._id}>
                                        <td className="px-3 py-2 text-sm text-foreground">{patient.patientId}</td>
                                        <td className="px-3 py-2 text-sm text-foreground">{patient.name || 'N/A'}</td>
                                        <td className="px-3 py-2 text-sm text-foreground">{patient.user?.email || 'N/A'}</td>
                                        <td className="px-3 py-2 text-sm text-foreground">{patient.user?.phoneNumber || 'N/A'}</td>
                                        <td className="px-3 py-2 text-sm text-foreground">
                                            {patient.profilePicture ? (
                                                <img src={patient.profilePicture} alt={patient.name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-sm font-medium">
                                            <Link to={`/doctor/patients/${patient._id}`} className="text-blue-500 hover:underline mr-4">View Profile</Link>
                                            <Link to={`/doctor/patients/${patient._id}/history`} className="text-purple-500 hover:underline">View History</Link>
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
            {/* Patient History Modal */}
            <AnimatePresence>
                {showHistoryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: -30 }}
                            className="bg-card p-6 rounded-lg shadow-xl max-w-lg w-full"
                        >
                            <h2 className="text-xl font-bold mb-4 text-foreground">Patient History</h2>
                            {historyLoading ? (
                                <p>Loading history...</p>
                            ) : historyError ? (
                                <p className="text-red-500">Error: {historyError}</p>
                            ) : patientHistory.length > 0 ? (
                                <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto">
                                    {patientHistory.map((item, index) => (
                                        <div key={index} className="mb-4 last:mb-0">
                                            <p className="text-sm font-semibold text-foreground mb-1">Date: {new Date(item.date).toLocaleDateString()}</p>
                                            {item.type === 'Prescription' ? (
                                                <div className="text-muted-foreground whitespace-pre-wrap">
                                                    <p>Prescribed by Dr. {item.doctorName}.</p>
                                                    <p>Notes: {item.notes}.</p>
                                                    <p>Medicines: {item.medicines}</p>
                                                </div>
                                            ) : item.type === 'Appointment' ? (
                                                <div className="text-muted-foreground whitespace-pre-wrap">
                                                    <p>Appointment with Dr. {item.doctorName}.</p>
                                                    <p>Reason: {item.reason}.</p>
                                                    <p>Status: {item.status}</p>
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground whitespace-pre-wrap">{item.details}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No history found for this patient.</p>
                            )}
                            <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={() => setShowHistoryModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorDashboardPage;