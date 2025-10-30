import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { scheduleData } from '../../data/scheduleData'; // Commented out hardcoded data import
import DayView from '../../components/doctor/schedule/DayView';
import WeekView from '../../components/doctor/schedule/WeekView';
import api from '../../utils/api'; // Import api for backend calls

const SchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('Day'); // 'Day' or 'Week'
    const [dynamicAppointments, setDynamicAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hardcoded schedule data (retained locally)
    const hardcodedScheduleData = [
        {
            id: 'hc-1',
            title: 'Morning Rounds',
            start: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
            type: 'Internal',
            description: 'Check on critical patients.'
        },
        {
            id: 'hc-2',
            title: 'Team Meeting',
            start: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(),
            type: 'Meeting',
            description: 'Weekly department sync.'
        },
        {
            id: 'hc-3',
            title: 'Lunch Break',
            start: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
            type: 'Personal',
            description: 'Personal lunch break.'
        },
        {
            id: 'hc-4',
            title: 'Evening Appointments',
            start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
            type: 'Patient',
            description: 'Scheduled patient consultations.'
        },
    ];

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const medicalRegistrationNumber = localStorage.getItem('doctorId');
                if (!medicalRegistrationNumber) {
                    setError(new Error('Doctor ID not found.'));
                    setLoading(false);
                    return;
                }
                const response = await api.get(`/api/doctors/appointment-queue/${medicalRegistrationNumber}`);
                
                // Format dynamic appointments to match hardcoded data structure
                const formattedDynamicAppointments = response.data.map(app => ({
                    id: app.id,
                    title: `Patient: ${app.name}`, // Assuming app.name is patient's name
                    start: new Date(`${new Date().toISOString().split('T')[0]}T${app.time}:00`).toISOString(), // Use current date with appointment time
                    end: new Date(new Date(`${new Date().toISOString().split('T')[0]}T${app.time}:00`).getTime() + (30 * 60 * 1000)).toISOString(), // Assuming 30 min duration
                    type: 'Patient',
                    description: app.reason || 'General Consultation',
                    patientId: app.patientId, // Add patient ID if needed for deeper links
                    status: app.status,
                }));

                setDynamicAppointments(formattedDynamicAppointments);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [currentDate]); // Re-fetch when date changes

    // Merge hardcoded and dynamic appointments
    const allAppointments = [...hardcodedScheduleData, ...dynamicAppointments];

    const handlePrev = () => {
        if (view === 'Day') {
            setCurrentDate(d => new Date(d.setDate(d.getDate() - 1)));
        } else {
            setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)));
        }
    };

    const handleNext = () => {
         if (view === 'Day') {
            setCurrentDate(d => new Date(d.setDate(d.getDate() + 1)));
        } else {
            setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)));
        }
    };
    
    const handleToday = () => {
        setCurrentDate(new Date());
    }

    const filteredAppointments = allAppointments.filter(apt => {
        const aptDate = new Date(apt.start);
        const currDate = new Date(currentDate);
        return aptDate.toDateString() === currDate.toDateString();
    });

    const getWeekAppointments = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return allAppointments.filter(apt => {
            const aptDate = new Date(apt.start);
            return aptDate >= startOfWeek && aptDate <= endOfWeek;
        });
    };

    if (loading) return <p className="text-center text-foreground mt-8">Loading schedule...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;

    return (
        <div className="h-full flex flex-col">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    {/* === SIRF IS HEADING PAR GRADIENT LAGAYA HAI === */}
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Schedule</h1>
                    <p className="text-muted-foreground mt-1">Manage your appointments and time blocks.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center p-1 bg-muted rounded-lg">
                        <button onClick={handlePrev} className="p-2 rounded-md hover:bg-card"><ChevronLeft size={20}/></button>
                        <button onClick={handleToday} className="px-4 py-1.5 text-sm font-semibold hover:bg-card rounded-md">Today</button>
                        <button onClick={handleNext} className="p-2 rounded-md hover:bg-card"><ChevronRight size={20}/></button>
                    </div>
                     <div className="flex items-center p-1 bg-muted rounded-lg">
                        <button onClick={() => setView('Day')} className={`px-3 py-1.5 text-sm font-semibold rounded-md ${view==='Day' ? 'bg-card shadow-sm' : ''}`}>Day</button>
                        <button onClick={() => setView('Week')} className={`px-3 py-1.5 text-sm font-semibold rounded-md ${view==='Week' ? 'bg-card shadow-sm' : ''}`}>Week</button>
                    </div>
                </div>
            </div>
            
            {/* Calendar View */}
            <div className="flex-1">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {view === 'Day' && <DayView date={currentDate} appointments={filteredAppointments} />}
                        {view === 'Week' && <WeekView date={currentDate} appointments={getWeekAppointments()} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SchedulePage;