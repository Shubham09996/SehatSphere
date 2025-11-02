import React, { useState, useEffect } from 'react';
import { CalendarPlus, User, Users } from 'lucide-react';
import AppointmentCard from '../../components/patient/AppointmentCard';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const AppointmentsPage = () => {
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'previous'
    const [myUpcomingAppointments, setMyUpcomingAppointments] = useState([]);
    const [myPreviousAppointments, setMyPreviousAppointments] = useState([]);
    const [familyUpcomingAppointments, setFamilyUpcomingAppointments] = useState([]);
    const [familyPreviousAppointments, setFamilyPreviousAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to format and categorize appointments
    const categorizeAppointments = (appointments, isFamilyAppointments = false) => {
        const now = new Date();
        const upcoming = [];
        const previous = [];

        appointments.forEach(appt => {
            const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
            let mappedStatus = appt.status;
            if (['Pending', 'Confirmed', 'Now Serving', 'Up Next', 'Waiting'].includes(appt.status)) {
                mappedStatus = 'Upcoming';
            }

            // Extract patient name - only for family appointments
            let patientName = null;
            if (isFamilyAppointments || appt.patient?.primaryPatient) {
                // For family appointments, use the patient's name
                patientName = appt.patient?.name || appt.patient?.user?.name || 'Unknown Family Member';
            }

            const formattedAppt = {
                _id: appt._id,
                doctor: appt.doctor?.user?.name || 'Unknown Doctor',
                specialty: appt.doctor?.specialty || 'N/A',
                hospital: appt.hospital?.name || 'N/A',
                date: new Date(appt.date).toDateString(),
                time: appt.time,
                status: mappedStatus,
                patientName: patientName,
                patientId: appt.patient?._id || appt.patient,
            };

            if (apptDateTime > now && mappedStatus !== 'Cancelled' && mappedStatus !== 'Completed') {
                upcoming.push(formattedAppt);
            } else {
                previous.push(formattedAppt);
            }
        });

        return { upcoming, previous };
    };

    // Function to fetch all appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            
            // Fetch all appointments (includes my appointments + family member appointments)
            const appointmentsRes = await api.get('/api/appointments/myappointments');
            const allAppointments = appointmentsRes.data;

            // Get the primary patient ID to distinguish between my appointments and family appointments
            const patientId = localStorage.getItem('patientId');
            
            // Separate my appointments from family appointments
            const myAppointments = [];
            const familyAppointments = [];

            allAppointments.forEach(appt => {
                // Check if the appointment belongs to the primary patient or a family member
                const apptPatientId = appt.patient?._id || appt.patient;
                
                if (appt.patient?.primaryPatient) {
                    // This is a family member's appointment (has primaryPatient field)
                    familyAppointments.push(appt);
                } else if (apptPatientId === patientId || !appt.patient?.primaryPatient) {
                    // This is my appointment (no primaryPatient field means it's the primary patient)
                    myAppointments.push(appt);
                } else {
                    // Fallback: treat as family appointment if it has a different patient ID
                    familyAppointments.push(appt);
                }
            });

            // Categorize appointments
            const myCategorized = categorizeAppointments(myAppointments, false);
            setMyUpcomingAppointments(myCategorized.upcoming);
            setMyPreviousAppointments(myCategorized.previous);

            const familyCategorized = categorizeAppointments(familyAppointments, true);
            setFamilyUpcomingAppointments(familyCategorized.upcoming);
            setFamilyPreviousAppointments(familyCategorized.previous);

        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancel = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.put(`/api/appointments/${appointmentId}`, { status: 'Cancelled' });
                alert('Appointment cancelled successfully!');
                fetchAppointments(); // Refresh the list
            } catch (error) {
                console.error('Error cancelling appointment:', error);
                alert('Failed to cancel appointment.');
            }
        }
    };

    const handleReschedule = async (appointmentId) => {
        alert('Reschedule functionality coming soon!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading appointments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">Error loading appointments: {error.message}</div>;
    }

    // Component for rendering sub-section (My Appointments or Family Appointments)
    const SubSection = ({ title, icon: Icon, appointments, emptyMessage, isFamilySection = false }) => (
        <div className="mb-6 last:mb-0">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end rounded-lg">
                    <Icon className="text-white w-4 h-4" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{title}</h3>
                <span className="ml-auto text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {appointments.length}
                </span>
            </div>
            <div className="space-y-3">
                {appointments.length > 0 ? (
                    appointments.map((appt) => (
                        <AppointmentCard 
                            key={appt._id} 
                            appointment={appt} 
                            onCancel={handleCancel} 
                            onReschedule={handleReschedule}
                            isFamilyAppointment={isFamilySection}
                        />
                    ))
                ) : (
                    <div className="text-center py-6 bg-background rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        My Appointments
                    </h1>
                    <p className="text-muted-foreground mt-1">View and manage your appointments and family appointments.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Link 
                        to="/patient/book-appointment"
                        className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <CalendarPlus size={18} />
                        Book Doctor Appointment
                    </Link>
                    <Link 
                        to="/patient/book-test-appointment"
                        className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <CalendarPlus size={18} />
                        Book Test Appointment
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-card rounded-lg sm:rounded-xl border border-border shadow-sm">
                <div className="border-b border-border">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`flex-1 sm:flex-none py-4 px-6 text-base sm:text-lg font-semibold border-b-2 transition-colors ${
                                activeTab === 'upcoming'
                                    ? 'border-blue-500 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${activeTab === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                <span>Upcoming Appointments</span>
                                <span className={`text-sm font-normal px-2 py-0.5 rounded-full ${
                                    activeTab === 'upcoming' 
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                                        : 'bg-muted text-muted-foreground'
                                }`}>
                                    {myPreviousAppointments.length + familyPreviousAppointments.length}
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('previous')}
                            className={`flex-1 sm:flex-none py-4 px-6 text-base sm:text-lg font-semibold border-b-2 transition-colors ${
                                activeTab === 'previous'
                                    ? 'border-gray-500 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${activeTab === 'previous' ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                                <span>Previous Appointments</span>
                                <span className={`text-sm font-normal px-2 py-0.5 rounded-full ${
                                    activeTab === 'previous' 
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' 
                                        : 'bg-muted text-muted-foreground'
                                }`}>
                                    {myUpcomingAppointments.length + familyUpcomingAppointments.length}
                                </span>
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="p-4 sm:p-6">
                    {/* Upcoming Appointments Section */}
                    {activeTab === 'upcoming' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* My Previous Appointments */}
                            <div className="border-r-0 lg:border-r border-border pr-0 lg:pr-6">
                                <SubSection
                                    title="My Appointments"
                                    icon={User}
                                    appointments={myPreviousAppointments}
                                    emptyMessage="No previous appointments for you"
                                    isFamilySection={false}
                                />
                            </div>

                            {/* Family Previous Appointments */}
                            <div className="pl-0 lg:pl-6">
                                <SubSection
                                    title="Family Appointments"
                                    icon={Users}
                                    appointments={familyPreviousAppointments}
                                    emptyMessage="No previous appointments for family members"
                                    isFamilySection={true}
                                />
                            </div>
                        </div>
                    )}

                    {/* Previous Appointments Section */}
                    {activeTab === 'previous' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* My Upcoming Appointments */}
                            <div className="border-r-0 lg:border-r border-border pr-0 lg:pr-6">
                                <SubSection
                                    title="My Appointments"
                                    icon={User}
                                    appointments={myUpcomingAppointments}
                                    emptyMessage="No upcoming appointments for you"
                                    isFamilySection={false}
                                />
                            </div>

                            {/* Family Upcoming Appointments */}
                            <div className="pl-0 lg:pl-6">
                                <SubSection
                                    title="Family Appointments"
                                    icon={Users}
                                    appointments={familyUpcomingAppointments}
                                    emptyMessage="No upcoming appointments for family members"
                                    isFamilySection={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsPage;