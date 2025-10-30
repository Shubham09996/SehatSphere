import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import api from '../../../utils/api'; // Import the API utility
import { motion } from 'framer-motion'; // FIX: Missing import ko yahan add kiya gaya hai

const getTodayString = () => new Date().toISOString().split('T')[0];

const Step3SelectDateAndSlot = ({ onNext, details, onBack }) => {
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [errorSlots, setErrorSlots] = useState(null);
    const { hospital, department, doctor } = details;
    const [dailyAvailability, setDailyAvailability] = useState({}); // New state for daily availability
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Effect to fetch daily availability for the calendar
    useEffect(() => {
        const fetchDailyAvailability = async () => {
            if (!doctor) {
                return;
            }
            // If 'first_available' doctor is selected, ensure hospital and department details are present
            if (doctor._id === 'first_available' && (!hospital?._id || !department?.name)) {
                return;
            }

            try {
                const params = { year: currentYear, month: currentMonth };
                if (doctor._id === 'first_available') {
                    params.hospitalId = hospital._id;
                    // Conditionally set specialty. If 'All Departments', don't send specialty filter.
                    if (department?.name !== 'All Departments') {
                        params.specialty = department.name;
                    }
                }
                const res = await api.get(`/api/doctors/daily-availability/${doctor._id}`, { params });
                setDailyAvailability(res.data);
            } catch (err) {
                console.error("Failed to fetch daily availability:", err);
            }
        };
        fetchDailyAvailability();
    }, [doctor?._id, hospital?._id, department?.name, currentMonth, currentYear]); // Refined dependencies

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedDate || !doctor) {
                setAvailableSlots([]);
                setLoadingSlots(false);
                return;
            }
            // If 'first_available' doctor is selected, ensure hospital and department details are present
            if (doctor._id === 'first_available' && (!hospital?._id || !department?.name)) {
                setAvailableSlots([]);
                setLoadingSlots(false);
                return;
            }

            setLoadingSlots(true);
            setErrorSlots(null);
            try {
                const params = { date: selectedDate };
                if (doctor._id === 'first_available') {
                    params.hospitalId = hospital._id;
                    // Conditionally set specialty. If 'All Departments', don't send specialty filter.
                    if (department?.name !== 'All Departments') {
                        params.specialty = department.name;
                    }
                }
                const response = await api.get(`/api/doctors/available-slots/${doctor._id}`, { params });
                setAvailableSlots(response.data);
            } catch (err) {
                console.error("Failed to fetch available slots:", err);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
    }, [selectedDate, doctor?._id, hospital?._id, department?.name]); // Refined dependencies

    const getDayStatus = (dateString) => {
        // Use the fetched dailyAvailability to determine the status
        const status = dailyAvailability[dateString];
        if (new Date(dateString) < new Date(getTodayString())) return 'disabled';
        switch (status) {
            case 'fully_available': return 'green';
            case 'partially_available': return 'orange';
            case 'unavailable': return 'red';
            default: return 'disabled'; // Default for dates not in the availability map
        }
    };

    const handleMonthChange = (newMonth, newYear) => {
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    // Remove the old `availableTimes` useMemo as `availableSlots` is now fetched directly

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                 <button onClick={onBack} className="p-2 rounded-full hover:bg-muted"><ArrowLeft size={20}/></button>
                 <div>
                    <h2 className="text-2xl font-bold text-foreground">Select Date & Time</h2>
                    <p className="text-muted-foreground text-sm">Booking for <span className="font-semibold text-primary">{doctor ? doctor.user.name : department.name}</span></p>
                 </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 bg-card p-6 rounded-xl border border-border">
                <div>
                     <BookingCalendar 
                         onDateSelect={setSelectedDate} 
                         getDayStatus={getDayStatus} 
                         initialDate={new Date(selectedDate)}
                         onMonthChange={handleMonthChange}
                     />
                     <div className="flex flex-wrap space-x-4 mt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-300 dark:bg-green-800 border border-border"></span>Available</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-300 dark:bg-orange-800 border border-border"></span>Few Slots</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-300 dark:bg-red-800 border border-border"></span>Fully Booked</div>
                    </div>
                </div>
                
                <motion.div key={selectedDate} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Clock size={18}/> Available Slots</h3>
                     <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2">
                        {loadingSlots ? (
                            <div className="col-span-3 text-center text-muted-foreground">Loading slots...</div>
                        ) : errorSlots ? (
                            <div className="col-span-3 text-center text-red-500">Error: {errorSlots.message}</div>
                        ) : availableSlots.length > 0 ? (
                            availableSlots.map(slot => (
                                <motion.button 
                                    key={slot.time} 
                                    onClick={() => onNext({ date: selectedDate, time: slot.time })} 
                                    className="p-2 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {slot.time}
                                </motion.button>
                            ))
                        ) : (
                            <div className="col-span-3 text-center bg-muted p-4 rounded-lg">
                               <p className="text-muted-foreground text-sm">No slots available for <br/> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
export default Step3SelectDateAndSlot;