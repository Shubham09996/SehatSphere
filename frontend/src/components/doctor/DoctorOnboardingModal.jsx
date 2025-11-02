import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Stethoscope, Briefcase, Award, GraduationCap, DollarSign, Calendar, Clock, Heart, Phone, Hospital, User, Brain } from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorOnboardingModal = ({ isOpen, onClose, doctorId, userId }) => {
    const navigate = useNavigate();
    const [specialty, setSpecialty] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [experience, setExperience] = useState(0);
    const [medicalRegistrationNumber, setMedicalRegistrationNumber] = useState('');
    const [bio, setBio] = useState('');
    const [expertise, setExpertise] = useState(''); // Comma-separated string
    const [consultationFee, setConsultationFee] = useState(0);
    const [appointmentDuration, setAppointmentDuration] = useState(15);
    const [workSchedule, setWorkSchedule] = useState(() => {
        const initialSchedule = {};
        daysOfWeek.forEach(day => {
            initialSchedule[day] = { from: '09:00', to: '17:00', enabled: true };
        });
        return initialSchedule;
    });
    const [hospitals, setHospitals] = useState([]); // New state for hospitals data
    const [selectedHospital, setSelectedHospital] = useState(''); // New state for selected hospital ID
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch hospitals on component mount or when modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchHospitals = async () => {
                try {
                    const res = await api.get('/api/hospitals');
                    setHospitals(res.data);
                    // Optionally, pre-select a hospital if doctorId is available and doctor has an assigned hospital
                    // This would require fetching doctor details first
                } catch (err) {
                    console.error('Failed to fetch hospitals:', err);
                }
            };
            fetchHospitals();
        }
    }, [isOpen]);

    // NEW: Fetch doctor details to get medicalRegistrationNumber
    useEffect(() => {
        if (isOpen && doctorId) {
            const fetchDoctorDetails = async () => {
                try {
                    // Use the /api/doctors/:id route which fetches by MongoDB _id
                    const res = await api.get(`/api/doctors/${doctorId}`);
                    const doctorData = res.data;
                    setSpecialty(doctorData.specialty || '');
                    setQualifications(doctorData.qualifications || '');
                    setExperience(doctorData.experience || 0);
                    setMedicalRegistrationNumber(doctorData.medicalRegistrationNumber || '');
                    setBio(doctorData.bio || '');
                    setExpertise(doctorData.expertise ? doctorData.expertise.join(', ') : '');
                    setConsultationFee(doctorData.consultationFee || 0);
                    setAppointmentDuration(doctorData.appointmentDuration || 15);
                    setSelectedHospital(doctorData.hospital?._id || '');
                    if (doctorData.workSchedule) {
                        setWorkSchedule(prev => {
                            const newSchedule = { ...prev };
                            daysOfWeek.forEach(day => {
                                if (doctorData.workSchedule[day]) { // Changed .get(day) to [day]
                                    newSchedule[day] = doctorData.workSchedule[day];
                                }
                            });
                            return newSchedule;
                        });
                    }
                } catch (err) {
                    console.error('Error fetching doctor details:', err);
                    // Handle case where doctor might not be found or data is incomplete
                }
            };
            fetchDoctorDetails();
        }
    }, [isOpen, doctorId]);

    const handleScheduleChange = (day, field, value) => {
        setWorkSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const doctorDetails = {
            hospital: selectedHospital, // Add hospital to the details
            specialty,
            qualifications,
            experience: Number(experience),
            medicalRegistrationNumber,
            bio,
            expertise: expertise.split(',').map(item => item.trim()).filter(item => item !== ''),
            consultationFee: Number(consultationFee),
            appointmentDuration: Number(appointmentDuration),
            workSchedule,
        };

        try {
            // console.log('DEBUG: DoctorOnboardingModal - medicalRegistrationNumber:', medicalRegistrationNumber);
            // console.log('DEBUG: DoctorOnboardingModal - API URL:', `/api/doctors/profile/${medicalRegistrationNumber}`);
            
            let res;
            if (doctorId) {
                // If doctorId exists, it's an update operation
                res = await api.put(`/api/doctors/${doctorId}`, doctorDetails);
                console.log('Doctor details updated successfully', res.data);
            } else {
                // If no doctorId, it's an initial onboarding (create operation)
                res = await api.post(`/api/doctors/onboard`, doctorDetails);
                console.log('Doctor onboarded successfully', res.data);
            }
            
            onClose();
            navigate('/doctor/dashboard'); // Redirect to dashboard after updating details
        } catch (err) {
            console.error('Error updating doctor details:', err);
            setError(err.response?.data?.message || 'Failed to update details.');
        } finally {
            setLoading(false);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -50, transition: { duration: 0.2 } },
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-card text-foreground rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto relative border border-border"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                            Complete Your Doctor Profile
                        </h2>
                        <p className="text-center text-muted-foreground mb-8">
                            Please provide a few more details to set up your professional profile.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

                            {/* Hospital Selection */}
                            <div className="relative group">
                                <select
                                    id="hospital"
                                    value={selectedHospital}
                                    onChange={(e) => setSelectedHospital(e.target.value)}
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                >
                                    <option value="">Select your Hospital</option>
                                    {hospitals.map(hosp => (
                                        <option key={hosp._id} value={hosp._id}>{hosp.name}</option>
                                    ))}
                                </select>
                                <label
                                    htmlFor="hospital"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Hospital size={20} />
                                </label>
                            </div>

                            {/* Specialty */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="specialty"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    placeholder="Specialty (e.g., Cardiologist, Pediatrician)"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                />
                                <label
                                    htmlFor="specialty"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Stethoscope size={20} />
                                </label>
                            </div>

                            {/* Qualifications */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="qualifications"
                                    value={qualifications}
                                    onChange={(e) => setQualifications(e.target.value)}
                                    placeholder="Qualifications (e.g., MBBS, MD)"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                />
                                <label
                                    htmlFor="qualifications"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <GraduationCap size={20} />
                                </label>
                            </div>

                            {/* Experience */}
                            <div className="relative group">
                                <input
                                    type="number"
                                    id="experience"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    placeholder="Years of Experience"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                    min="0"
                                />
                                <label
                                    htmlFor="experience"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Briefcase size={20} />
                                </label>
                            </div>

                            {/* Medical Registration Number */}
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="medicalRegistrationNumber"
                                    value={medicalRegistrationNumber}
                                    onChange={(e) => setMedicalRegistrationNumber(e.target.value)}
                                    placeholder="Medical Registration Number"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                />
                                <label
                                    htmlFor="medicalRegistrationNumber"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Award size={20} />
                                </label>
                            </div>

                            {/* Bio */}
                            <div className="relative group">
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="A short bio about yourself and your practice"
                                    rows="3"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                ></textarea>
                                <label
                                    htmlFor="bio"
                                    className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <User size={20} />
                                </label>
                            </div>

                            {/* Expertise (Comma-separated) */}
                            <div className="relative group">
                                <textarea
                                    id="expertise"
                                    value={expertise}
                                    onChange={(e) => setExpertise(e.target.value)}
                                    placeholder="Expertise (comma-separated, e.g., Diabetes Management, Dermatology)"
                                    rows="2"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                ></textarea>
                                <label
                                    htmlFor="expertise"
                                    className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Brain size={20} />
                                </label>
                            </div>

                            {/* Consultation Fee */}
                            <div className="relative group">
                                <input
                                    type="number"
                                    id="consultationFee"
                                    value={consultationFee}
                                    onChange={(e) => setConsultationFee(e.target.value)}
                                    placeholder="Consultation Fee (in INR)"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                    min="0"
                                />
                                <label
                                    htmlFor="consultationFee"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <DollarSign size={20} />
                                </label>
                            </div>

                            {/* Appointment Duration */}
                            <div className="relative group">
                                <input
                                    type="number"
                                    id="appointmentDuration"
                                    value={appointmentDuration}
                                    onChange={(e) => setAppointmentDuration(e.target.value)}
                                    placeholder="Appointment Duration (in minutes)"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                    min="5"
                                />
                                <label
                                    htmlFor="appointmentDuration"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Clock size={20} />
                                </label>
                            </div>

                            {/* Work Schedule */}
                            <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">Work Schedule</h3>
                            <div className="space-y-3">
                                {daysOfWeek.map(day => (
                                    <div key={day} className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id={`${day}-enabled`}
                                            checked={workSchedule[day].enabled}
                                            onChange={(e) => handleScheduleChange(day, 'enabled', e.target.checked)}
                                            className="form-checkbox h-5 w-5 rounded-md text-hs-gradient-middle focus:ring-hs-gradient-middle border-border bg-background transition-colors duration-300 dark:bg-muted/30 dark:border-muted/50"
                                        />
                                        <label htmlFor={`${day}-enabled`} className="flex-1 text-foreground font-medium">{day}</label>
                                        <input
                                            type="time"
                                            value={workSchedule[day].from}
                                            onChange={(e) => handleScheduleChange(day, 'from', e.target.value)}
                                            className="w-28 p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                            disabled={!workSchedule[day].enabled}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <input
                                            type="time"
                                            value={workSchedule[day].to}
                                            onChange={(e) => handleScheduleChange(day, 'to', e.target.value)}
                                            className="w-28 p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                            disabled={!workSchedule[day].enabled}
                                        />
                                    </div>
                                ))}
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Details'}
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DoctorOnboardingModal;
