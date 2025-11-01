import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Droplets, Heart, Phone, ShieldAlert, User } from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'; // Import useEffect
import { useAuth } from '../../context/AuthContext'; // NEW: Import useAuth

const PatientOnboardingModal = ({ isOpen, onClose, userId, patientId }) => {
    const navigate = useNavigate();
    const { user, login } = useAuth(); // NEW: Get user and login from AuthContext
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
    const [allergies, setAllergies] = useState('');
    const [chronicConditions, setChronicConditions] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Removed redundant patientId state and local storage fetching

    useEffect(() => {
        // This useEffect is no longer needed for patientId fetching since it's passed as a prop
        // However, it could be used for other side effects if necessary
    }, [user]); // Depend on user for other user-related effects

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!patientId) {
            setError('Patient ID is not available. Please try again.');
            setLoading(false);
            return;
        }

        const patientDetails = {
            dob,
            gender,
            bloodGroup,
            emergencyContact: {
                name: emergencyContactName,
                relation: emergencyContactRelation, // Corrected to relation
                phone: emergencyContactPhone,
            },
            allergies: allergies.split(',').map(item => item.trim()).filter(item => item !== ''),
            chronicConditions: chronicConditions.split(',').map(item => item.trim()).filter(item => item !== ''),
        };

        try {
            await api.put(`/api/patients/profile/${patientId}`, patientDetails); // Use patientId prop
            console.log('Patient details updated successfully');

            // NEW: Update user context and mark isNewUser as false
            if (user && user.isNewUser) {
                const updatedUser = { ...user, isNewUser: false, token: localStorage.getItem('jwt') }; // Include existing token
                login(updatedUser); // Update user in AuthContext and localStorage
            }

            localStorage.setItem('userRole', 'Patient'); // Assuming role is Patient for this modal
            window.dispatchEvent(new Event('localStorageUpdated'));

            onClose();
            navigate('/patient/dashboard'); // Redirect to dashboard after updating details
        } catch (err) {
            console.error('Error updating patient details:', err);
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
                            Complete Your Profile
                        </h2>
                        <p className="text-center text-muted-foreground mb-8">
                            Please provide a few more details to help us personalize your health journey.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

                            {/* Date of Birth */}
                            <div className="relative group">
                                <input
                                    type="date"
                                    id="dob"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                />
                                <label
                                    htmlFor="dob"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Calendar size={20} />
                                </label>
                            </div>

                            {/* Gender */}
                            <div className="relative group">
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30 appearance-none"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <label
                                    htmlFor="gender"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <User size={20} />
                                </label>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>

                            {/* Blood Group */}
                            <div className="relative group">
                                <select
                                    id="bloodGroup"
                                    value={bloodGroup}
                                    onChange={(e) => setBloodGroup(e.target.value)}
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30 appearance-none"
                                    required
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                                <label
                                    htmlFor="bloodGroup"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Droplets size={20} />
                                </label>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">Emergency Contact</h3>
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="emergencyContactName"
                                    value={emergencyContactName}
                                    onChange={(e) => setEmergencyContactName(e.target.value)}
                                    placeholder="Name"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                />
                                <label
                                    htmlFor="emergencyContactName"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <User size={20} />
                                </label>
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="emergencyContactRelation"
                                    value={emergencyContactRelation}
                                    onChange={(e) => setEmergencyContactRelation(e.target.value)}
                                    placeholder="Relation (e.g., Mother, Spouse)"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                />
                                <label
                                    htmlFor="emergencyContactRelation"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Heart size={20} />
                                </label>
                            </div>
                            <div className="relative group">
                                <input
                                    type="tel"
                                    id="emergencyContactPhone"
                                    value={emergencyContactPhone}
                                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                                    placeholder="Phone Number"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                    required
                                />
                                <label
                                    htmlFor="emergencyContactPhone"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Phone size={20} />
                                </label>
                            </div>

                            <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">Medical Information</h3>
                            <div className="relative group">
                                <textarea
                                    id="allergies"
                                    value={allergies}
                                    onChange={(e) => setAllergies(e.target.value)}
                                    placeholder="Allergies (comma-separated, e.g., Penicillin, Peanuts)"
                                    rows="3"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                ></textarea>
                                <label
                                    htmlFor="allergies"
                                    className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <ShieldAlert size={20} />
                                </label>
                            </div>
                            <div className="relative group">
                                <textarea
                                    id="chronicConditions"
                                    value={chronicConditions}
                                    onChange={(e) => setChronicConditions(e.target.value)}
                                    placeholder="Chronic Conditions (comma-separated, e.g., Diabetes, Hypertension)"
                                    rows="3"
                                    className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30"
                                ></textarea>
                                <label
                                    htmlFor="chronicConditions"
                                    className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                                >
                                    <Heart size={20} />
                                </label>
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

export default PatientOnboardingModal;
