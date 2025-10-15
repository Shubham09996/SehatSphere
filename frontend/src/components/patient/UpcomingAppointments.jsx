import React from 'react';
import { User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const UpcomingAppointments = ({ upcomingAppointments }) => {
    const handleCancel = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.put(`/api/appointments/${appointmentId}`, { status: 'Cancelled' });
                alert('Appointment cancelled successfully!');
                // onAppointmentUpdate(); // This prop will be passed from PatientDashboardPage
            } catch (error) {
                console.error('Error cancelling appointment:', error);
                alert('Failed to cancel appointment.');
            }
        }
    };

    const handleReschedule = async (appointmentId) => {
        // For simplicity, we'll just show an alert. 
        // A real implementation would involve a date picker modal.
        alert('Reschedule functionality coming soon!');
        // You would typically navigate to a rescheduling page or open a modal here.
        // Example: navigate(`/patient/reschedule-appointment/${appointmentId}`);
        // Or: onOpenRescheduleModal(appointmentId);
    };

    return (
        <div className="bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Upcoming Appointments</h2>
                {/* === BOOK NEW BUTTON PE GRADIENT LAGAYA HAI === */}
                <Link to="/patient/book-appointment" className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-1 px-2 sm:py-1.5 sm:px-3 rounded-lg shadow-md hover:opacity-90 transition-opacity text-sm flex items-center gap-2">
                    <Calendar size={16} /> Book New
                </Link>
            </div>
            <p className="text-muted-foreground mb-4">Manage your scheduled consultations</p>
            
            <div className="space-y-4">
                {upcomingAppointments && upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                        <div key={appointment._id} className="bg-background p-4 rounded-lg border border-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                                        <User className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base sm:text-lg text-foreground">Dr. {appointment.doctorName || 'Unknown Doctor'}</h4>
                                        <p className="text-sm text-muted-foreground">{(appointment.doctorSpecialty || 'N/A')} • {appointment.hospitalName}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}  •  {new Date(`2000-01-01T${appointment.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${appointment.status === 'waiting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>{appointment.status}</span>
                                    <p className="text-sm text-muted-foreground mt-2">Token: #{appointment.token}</p>
                                </div>
                            </div>
                            <div className="border-t border-border mt-4 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                                <div className="flex gap-4">
                                    <button onClick={() => handleReschedule(appointment._id)} className="text-sm text-muted-foreground font-semibold hover:text-foreground">Reschedule</button>
                                    <button onClick={() => handleCancel(appointment._id)} className="text-sm text-red-500 font-semibold hover:text-red-700">Cancel</button>
                                </div>
                                <a href="#" className="text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                                    View Queue →
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground">No upcoming appointments.</div>
                )}
            </div>
        </div>
    );
};

export default UpcomingAppointments;