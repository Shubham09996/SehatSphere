import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Stethoscope, FileText, User, Clock, CalendarCheck, Wallet, Award } from 'lucide-react';
import DashboardStats from '../../components/patient/DashboardStats';
import UpcomingAppointments from '../../components/patient/UpcomingAppointments';
import EPrescriptions from '../../components/patient/EPrescriptions';
import Chatbot from '../../components/patient/Chatbot';
import FamilyMemberList from '../../components/patient/FamilyMemberList'; // NEW: Import FamilyMemberList
import api from '../../utils/api'; // api.js se import karein
import { Link } from 'react-router-dom'; // Added Link import
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const PatientDashboardPage = () => {
    const [patientDashboardStats, setPatientDashboardStats] = useState(null);
    const [patientName, setPatientName] = useState('Ravi'); // Default to Ravi, will be updated dynamically
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [ePrescriptions, setEPrescriptions] = useState([]);
    const [doctors, setDoctors] = useState([]); // New state for doctors list
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { user } = useAuth(); // Access the user object from AuthContext

    // Function to fetch all dashboard data
    const fetchPatientDashboardData = async () => {
        try {
            setLoading(true);
            const patientId = localStorage.getItem('patientId'); // Retrieve patientId from localStorage
            if (!patientId) {
                throw new Error("Patient ID not found in local storage.");
            }
            const [statsRes, appointmentsRes, prescriptionsRes, doctorsRes] = await Promise.all([
                api.get(`/api/patients/dashboard-stats`),
                api.get(`/api/patients/upcoming-appointments`),
                api.get(`/api/prescriptions/patient`),
                api.get(`/api/doctors`), // New API call to fetch all doctors
            ]);

            setPatientDashboardStats(statsRes.data.dashboardStats);
            setPatientName(statsRes.data.patientName);
            
            // Remove the redundant formatting here, as it's already formatted by the backend
            setUpcomingAppointments(appointmentsRes.data.upcomingAppointments);
            
            setEPrescriptions(prescriptionsRes.data.prescriptions);
            setDoctors(doctorsRes.data); // Set the fetched doctors data
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientDashboardData();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading dashboard: {error.message}</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                {/* === EMOJI KO GRADIENT SE ALAG KIYA HAI === */}
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                    <span className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Welcome back, {patientName}!
                    </span>
                    {/* Yeh span emoji ko original color mein rakhega */}
                    <span>👋</span>
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">Here's your health overview for today</p>
            </div>

            {patientDashboardStats && <DashboardStats stats={patientDashboardStats} />}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <UpcomingAppointments upcomingAppointments={upcomingAppointments} onAppointmentUpdate={fetchPatientDashboardData} />
                <EPrescriptions ePrescriptions={ePrescriptions} />
            </div>

            {/* New Section for Family Members */}
            {user?.role === 'Patient' && (
                <FamilyMemberList /> // Conditionally render for Patients only
            )}

            {/* New Section for Doctors List */}
            <div className="bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
                <h2 className="text-2xl font-bold text-foreground mb-4">Find a Doctor</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.length > 0 ? (doctors
                        .filter(doctor => doctor.user && doctor.user.name) // Filter out doctors with null user or missing name
                        .map(doctor => (
                        <motion.div 
                            key={doctor._id} 
                            className="bg-background p-4 rounded-lg border border-border flex items-center gap-4 hover:shadow-lg transition-shadow duration-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img 
                                src={doctor.user?.profilePicture || '/uploads/default.jpg'} 
                                alt={doctor.user?.name || 'Doctor'} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary/50"
                            />
                            <div>
                                <p className="font-semibold text-foreground">Dr. {doctor.user?.name || 'Unknown Doctor'}</p>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            </div>
                            <Link to={`/patient/book-appointment/${doctor.medicalRegistrationNumber}`} className="ml-auto bg-primary text-primary-foreground text-sm px-3 py-1 rounded-md hover:bg-primary/90">Book</Link>
                        </motion.div>
                    ))) : (
                        <p className="text-muted-foreground">No doctors available at the moment.</p>
                    )}
                </div>
            </div>

            <div className="fixed bottom-5 right-5 z-30">
                <button className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <MessageSquare size={24} />
                </button>
            </div>
        </div>
    );
};

export default PatientDashboardPage;