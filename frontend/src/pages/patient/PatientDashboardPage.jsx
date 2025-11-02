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
    const [patientName, setPatientName] = useState(''); // Default to empty, will be updated dynamically
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [ePrescriptions, setEPrescriptions] = useState([]);
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
            const [statsRes, appointmentsRes, prescriptionsRes] = await Promise.all([
                api.get(`/api/patients/dashboard-stats`),
                api.get(`/api/patients/upcoming-appointments`),
                api.get(`/api/prescriptions/patient`),
                // api.get(`/api/doctors`), // New API call to fetch all doctors
            ]);

            setPatientDashboardStats(statsRes.data.dashboardStats);
            setPatientName(statsRes.data.patientName);
            
            // Remove the redundant formatting here, as it's already formatted by the backend
            setUpcomingAppointments(appointmentsRes.data.upcomingAppointments);
            
            setEPrescriptions(prescriptionsRes.data.prescriptions);
            // setDoctors(doctorsRes.data); // Set the fetched doctors data
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
        <div className="flex flex-col gap-4 sm:gap-6">
            <div>
                {/* === EMOJI KO GRADIENT SE ALAG KIYA HAI === */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Welcome back, {patientName}!
                    </span>
                    {/* Yeh span emoji ko original color mein rakhega */}
                    <span>👋</span>
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">Here's your health overview for today</p>
            </div>

            {patientDashboardStats && <DashboardStats stats={patientDashboardStats} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <UpcomingAppointments upcomingAppointments={upcomingAppointments} onAppointmentUpdate={fetchPatientDashboardData} />
                <EPrescriptions ePrescriptions={ePrescriptions} />
            </div>

            {/* New Section for Family Members */}
            {user?.role === 'Patient' && (
                <FamilyMemberList /> // Conditionally render for Patients only
            )}

            
            <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-30">
                <button className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white p-3 sm:p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>
        </div>
    );
};

export default PatientDashboardPage;