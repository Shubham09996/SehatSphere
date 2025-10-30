import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios'; // Import axios
import api from '../../../utils/api'; // api.js se import karein
import { CheckCircle, XCircle } from 'lucide-react';

// Reusable components
const SettingsCard = ({ title, description, children, footer }) => (
    <motion.div 
        className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    >
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="p-6 space-y-4">{children}</div>
        {footer && <div className="p-4 bg-muted/50 rounded-b-xl text-right">{footer}</div>}
    </motion.div>
);

const SwitchToggle = ({ enabled, setEnabled }) => (
    // === SWITCH PAR GRADIENT LAGAYA HAI ===
    <div 
        onClick={() => setEnabled(!enabled)} 
        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
            enabled ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end justify-end' : 'bg-muted justify-start'
        }`}
    >
        <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
    </div>
);

const DayAvailability = ({ day, schedule, onScheduleChange }) => {
    const [isOn, setIsOn] = useState(schedule?.isAvailable || false);
    const [startTime, setStartTime] = useState(schedule?.startTime || '09:00');
    const [endTime, setEndTime] = useState(schedule?.endTime || '17:00');

    useEffect(() => {
        onScheduleChange(day, { isAvailable: isOn, startTime, endTime });
    }, [isOn, startTime, endTime]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
            <p className="font-semibold">{day}</p>
            {isOn ? (
                <div className="col-span-2 flex items-center gap-2">
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-background border border-border rounded-md p-2 w-full text-sm"/>
                     <span className="text-muted-foreground">to</span>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-background border border-border rounded-md p-2 w-full text-sm"/>
                    <SwitchToggle enabled={isOn} setEnabled={setIsOn}/>
                </div>
            ) : (
                 <div className="col-span-2 flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Day Off</p>
                    <SwitchToggle enabled={isOn} setEnabled={setIsOn}/>
                 </div>
            )}
        </div>
    );
};

const ConsultationSettings = () => {
    const [consultationFee, setConsultationFee] = useState('');
    const [appointmentDuration, setAppointmentDuration] = useState('');
    const [workSchedule, setWorkSchedule] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const doctorId = '60d0fe4f5311236168a109cb'; // Temporarily using a dummy doctorId. This should come from auth context.

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const fetchConsultationSettings = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/doctors/${doctorId}/settings/consultation`);
                const settings = response.data.settings;
                setConsultationFee(settings.consultationFee);
                setAppointmentDuration(settings.appointmentDuration ? String(settings.appointmentDuration) : '');
                setWorkSchedule(settings.workSchedule || {});
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConsultationSettings();
    }, [doctorId]);

    const handleScheduleChange = (day, schedule) => {
        setWorkSchedule(prevSchedule => ({
            ...prevSchedule,
            [day]: schedule
        }));
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const updatedSettings = {
                consultationFee,
                appointmentDuration,
                workSchedule,
            };
            await api.put(`/doctors/${doctorId}/settings/consultation`, updatedSettings);
            setSaveSuccess(true);
        } catch (err) {
            console.error('Error saving consultation settings:', err);
            setError(err);
        } finally {
            setSaving(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    if (loading) {
        return <div className="text-center text-foreground p-6">Loading consultation settings...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-6">Error loading consultation settings: {error.message}</div>;
    }

    return (
        <div className="space-y-8">
            <SettingsCard
                title="Consultation Details"
                description="Manage your fees and appointment duration."
                // === IS BUTTON PAR GRADIENT LAGAYA HAI ===
                footer={
                    <div className="flex items-center justify-end gap-3">
                        {saveSuccess && <span className="text-sm text-green-500">Settings saved successfully!</span>}
                        <button 
                            onClick={handleSaveChanges} 
                            className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                }
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="consultationFee" className="text-sm font-medium">Consultation Fee (INR)</label>
                        <input 
                            type="number" 
                            id="consultationFee"
                            value={consultationFee}
                            onChange={(e) => setConsultationFee(e.target.value)} 
                            className="mt-1 w-full bg-background border border-border rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="appointmentDuration" className="text-sm font-medium">Appointment Duration</label>
                        <select 
                            id="appointmentDuration"
                            value={appointmentDuration}
                            onChange={(e) => setAppointmentDuration(e.target.value)} 
                            className="mt-1 w-full bg-background border border-border rounded-md p-2"
                        >
                            <option value="15">15 minutes</option>
                            <option value="20">20 minutes</option>
                            <option value="30">30 minutes</option>
                        </select>
                    </div>
                </div>
            </SettingsCard>

             <SettingsCard
                title="Weekly Availability"
                description="Set your available hours for each day. Patients can only book slots within this schedule."
                // === SAVE SCHEDULE BUTTON PAR GRADIENT LAGAYA HAI ===
                footer={
                    <div className="flex items-center justify-end gap-3">
                        {saveSuccess && <span className="text-sm text-green-500">Schedule saved successfully!</span>}
                        <button 
                            onClick={handleSaveChanges} 
                            className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                }
            >
                <div className="space-y-4">
                    {days.map(day => (
                        <DayAvailability 
                            key={day} 
                            day={day} 
                            schedule={workSchedule[day]} 
                            onScheduleChange={handleScheduleChange} 
                        />
                    ))}
                </div>
            </SettingsCard>
        </div>
    );
};

export default ConsultationSettings;