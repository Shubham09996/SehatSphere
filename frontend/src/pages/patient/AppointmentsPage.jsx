import React, { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import AppointmentCard from '../../components/patient/AppointmentCard';
import { Link } from 'react-router-dom'; // Button ko link banane ke liye import
import { useEffect } from 'react';
import api from '../../utils/api';

// Dummy data for demonstration
const upcomingAppointmentsData = [
    {
        doctor: 'Dr. Anjali Sharma',
        specialty: 'Cardiology',
        hospital: 'City Hospital',
        date: 'Oct 15, 2025',
        time: '10:30 AM',
        status: 'Upcoming',
    },
    {
        doctor: 'Dr. Rohan Verma',
        specialty: 'Dermatology',
        hospital: 'Care & Cure Clinic',
        date: 'Oct 22, 2025',
        time: '02:00 PM',
        status: 'Upcoming',
    },
];

const previousAppointmentsData = [
    {
        doctor: 'Dr. Priya Singh',
        specialty: 'Pediatrics',
        hospital: 'Child Health Center',
        date: 'Sep 28, 2025',
        time: '11:00 AM',
        status: 'Completed',
    },
     {
        doctor: 'Dr. Sameer Gupta',
        specialty: 'General Physician',
        hospital: 'City Hospital',
        date: 'Aug 12, 2025',
        time: '09:00 AM',
        status: 'Cancelled',
    },
];


const AppointmentsPage = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [dynamicUpcomingAppointments, setDynamicUpcomingAppointments] = useState([]);
    const [dynamicPreviousAppointments, setDynamicPreviousAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch all appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/appointments/myappointments');
            const fetchedAppointments = response.data;

            const now = new Date();
            const upcoming = [];
            const previous = [];

            fetchedAppointments.forEach(appt => {
                const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
                let mappedStatus = appt.status;
                if (['Pending', 'Confirmed', 'Now Serving', 'Up Next', 'Waiting'].includes(appt.status)) {
                    mappedStatus = 'Upcoming';
                }

                const formattedAppt = {
                    _id: appt._id, // Pass the original _id for API calls
                    doctor: appt.doctor?.user?.name,
                    specialty: appt.doctor?.specialty,
                    hospital: appt.hospital?.name,
                    date: new Date(appt.date).toDateString(),
                    time: appt.time,
                    status: mappedStatus,
                };

                if (apptDateTime > now) {
                    upcoming.push(formattedAppt);
                } else {
                    previous.push(formattedAppt);
                }
            });

            setDynamicUpcomingAppointments(upcoming);
            setDynamicPreviousAppointments(previous);
        } catch (err) {
            setError(err);
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
        // For simplicity, we'll just show an alert. 
        // A real implementation would involve a date picker modal or navigation.
        alert('Reschedule functionality coming soon!');
        // You would typically navigate to a rescheduling page or open a modal here.
        // Example: navigate(`/patient/reschedule-appointment/${appointmentId}`);
        // Or: onOpenRescheduleModal(appointmentId);
    };


    if (loading) {
        return <div className="text-center py-12 text-foreground">Loading appointments...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">Error loading appointments: {error.message}</div>;
    }

    const combinedUpcomingAppointments = [...upcomingAppointmentsData, ...dynamicUpcomingAppointments];
    const combinedPreviousAppointments = [...previousAppointmentsData, ...dynamicPreviousAppointments];

    const appointmentsToShow = activeTab === 'upcoming' ? combinedUpcomingAppointments : combinedPreviousAppointments;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Appointments</h1>
                    <p className="text-muted-foreground mt-1">View and manage your appointments.</p>
                </div>
                <Link 
                    to="/patient/book-appointment"
                    className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <CalendarPlus size={18} />
                    Book New Appointment
                </Link>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-3 sm:space-x-6">
                    {/* === UPCOMING TAB PAR GRADIENT LAGAYA HAI === */}
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                            activeTab === 'upcoming' 
                            ? 'border-primary bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text' 
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Upcoming
                    </button>
                    {/* === PREVIOUS TAB PAR GRADIENT LAGAYA HAI === */}
                    <button 
                        onClick={() => setActiveTab('previous')}
                        className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                            activeTab === 'previous' 
                            ? 'border-primary bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text' 
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Previous
                    </button>
                </nav>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {appointmentsToShow.length > 0 ? (
                    appointmentsToShow.map((appt, index) => (
                        <AppointmentCard key={appt._id || index} appointment={appt} onCancel={handleCancel} onReschedule={handleReschedule} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-card rounded-lg border border-dashed">
                        <h3 className="text-lg font-semibold text-foreground">No appointments found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            You have no {activeTab} appointments at this time.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;