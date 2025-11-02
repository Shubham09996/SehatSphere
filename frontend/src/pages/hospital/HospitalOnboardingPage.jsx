import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
    Building, MapPin, Phone, Mail, FileText, User, Users, Hospital as HospitalIcon, Globe 
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const HospitalOnboardingPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();

    const [hospitalName, setHospitalName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [directorName, setDirectorName] = useState('');
    const [numberOfBeds, setNumberOfBeds] = useState('');
    const [website, setWebsite] = useState('');
    const [specialties, setSpecialties] = useState([]);
    const [emergencyServices, setEmergencyServices] = useState(false);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]); // NEW: State for departments
    const [currentDepartmentInput, setCurrentDepartmentInput] = useState(''); // State for the currently typed department

    const availableSpecialties = [
        'Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics', 
        'Dermatology', 'Ophthalmology', 'ENT', 'Gastroenterology', 'Nephrology'
    ];

    useEffect(() => {
        if (!user || user._id !== userId || user.role?.toLowerCase() !== 'hospital') {
            navigate('/login'); // Redirect if not the correct user or role
        } else if (user.isOnboarded) {
            navigate('/hospital/dashboard'); // Redirect to dashboard if already onboarded
        }
    }, [user, userId, navigate]);

    const handleSpecialtyChange = (specialty) => {
        setSpecialties(prev => 
            prev.includes(specialty) 
                ? prev.filter(s => s !== specialty) 
                : [...prev, specialty]
        );
    };

    // NEW: Handler for department input
    const handleDepartmentInputChange = (e) => {
        if (e.key === 'Enter' && currentDepartmentInput.trim() !== '') {
            e.preventDefault();
            const newDepartment = currentDepartmentInput.trim();
            if (!departments.includes(newDepartment)) {
                setDepartments(prev => {
                    const updatedDepartments = [...prev, newDepartment];
                    console.log('Departments state after adding:', updatedDepartments);
                    return updatedDepartments;
                });
            }
            setCurrentDepartmentInput(''); // Clear the input field's state
        }
    };

    // NEW: Handler for removing a department
    const removeDepartment = (deptToRemove) => {
        setDepartments(prev => prev.filter(dept => dept !== deptToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let finalDepartments = [...departments];
        if (currentDepartmentInput.trim() !== '' && !finalDepartments.includes(currentDepartmentInput.trim())) {
            finalDepartments.push(currentDepartmentInput.trim());
        }

        const hospitalData = {
            hospitalName,
            address,
            city,
            state,
            zipCode,
            phoneNumber,
            email,
            description,
            licenseNumber,
            directorName,
            numberOfBeds: parseInt(numberOfBeds, 10),
            website,
            specialties,
            emergencyServices,
            user: userId, // Link to the user ID
            departments: finalDepartments, // Use the potentially updated departments array
        };

        console.log('Hospital data sent from frontend:', hospitalData);

        try {
            // Send data to backend endpoint for hospital onboarding
            const res = await api.post(`/api/hospitals/onboard`, hospitalData);
            
            if (res.data) {
                toast.success('Hospital details saved. Awaiting Admin approval.');
                // We do NOT mark isOnboarded: true here, as it requires admin approval first.
                // The user will remain on this page or be redirected to a 'pending' status page.
                // For now, let's redirect to a generic pending page or show a message.
                navigate('/hospital/dashboard?status=pending'); // Redirect to dashboard with pending status
            }
        } catch (error) {
            console.error('Hospital Onboarding Failed:', error);
            toast.error(error.response?.data?.message || 'Failed to save hospital details.');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-foreground text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-background p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-card p-8 rounded-lg shadow-xl max-w-2xl w-full border border-border">
                <h1 className="text-3xl font-bold text-foreground text-center mb-6">Welcome, Hospital Admin!</h1>
                <p className="text-muted-foreground text-center mb-8">Please provide the essential details for your hospital.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Information */}
                    <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2">General Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                id="hospitalName"
                                placeholder="Hospital Name"
                                value={hospitalName}
                                onChange={(e) => setHospitalName(e.target.value)}
                                className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                                required
                            />
                            <Building size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="licenseNumber"
                                placeholder="License Number"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                                required
                            />
                            <FileText size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            placeholder="Contact Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                            required
                        />
                        <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="relative">
                        <input
                            type="tel"
                            id="phoneNumber"
                            placeholder="Contact Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                            required
                        />
                        <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    
                    <div className="relative">
                        <input
                            type="text"
                            id="website"
                            placeholder="Website URL (Optional)"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                        />
                        <Globe size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>

                    {/* Address */}
                    <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2 mt-8">Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                id="address"
                                placeholder="Street Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                                required
                            />
                            <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="city"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                                required
                            />
                            <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="state"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                                required
                            />
                            <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="zipCode"
                                placeholder="Zip Code"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                                required
                            />
                            <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Additional Details */}
                    <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2 mt-8">Additional Details</h2>
                    <div className="relative">
                        <textarea
                            id="description"
                            placeholder="Brief Description of Hospital"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle resize-y"
                            required
                        ></textarea>
                        <HospitalIcon size={20} className="absolute left-3 top-4 text-muted-foreground" />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            id="directorName"
                            placeholder="CEO / Director Name"
                            value={directorName}
                            onChange={(e) => setDirectorName(e.target.value)}
                            className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                            required
                        />
                        <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            id="numberOfBeds"
                            placeholder="Number of Beds"
                            value={numberOfBeds}
                            onChange={(e) => setNumberOfBeds(e.target.value)}
                            className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                            min="0"
                            required
                        />
                        <Users size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>

                    {/* Departments */}
                    <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2 mt-8">Departments</h2>
                    <div className="relative">
                        <input
                            type="text"
                            id="departments"
                            placeholder="Add Department (e.g., Cardiology, Pediatrics) and press Enter"
                            value={currentDepartmentInput} // Controlled component: bind value to state
                            onChange={(e) => setCurrentDepartmentInput(e.target.value)} // Update state on change
                            onKeyDown={handleDepartmentInputChange}
                            className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                        />
                        <HospitalIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                        {departments.map((dept, index) => (
                            <span 
                                key={index} 
                                className="flex items-center bg-muted text-foreground px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {dept}
                                <button 
                                    type="button" 
                                    onClick={() => removeDepartment(dept)} 
                                    className="ml-2 text-muted-foreground hover:text-foreground focus:outline-none"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Specialties */}
                    <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2 mt-8">Specialties</h2>
                    <div className="flex flex-wrap gap-3">
                        {availableSpecialties.map(specialty => (
                            <button
                                key={specialty}
                                type="button"
                                onClick={() => handleSpecialtyChange(specialty)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors 
                                    ${specialties.includes(specialty) 
                                        ? 'bg-hs-gradient-middle text-white border-hs-gradient-middle' 
                                        : 'bg-background text-muted-foreground border-border hover:bg-muted'
                                    }`}
                            >
                                {specialty}
                            </button>
                        ))}
                    </div>

                    {/* Emergency Services */}
                    <div className="flex items-center space-x-3 mt-6">
                        <input
                            type="checkbox"
                            id="emergencyServices"
                            checked={emergencyServices}
                            onChange={(e) => setEmergencyServices(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-hs-gradient-middle rounded-md border-border bg-background focus:ring-hs-gradient-middle"
                        />
                        <label htmlFor="emergencyServices" className="text-foreground text-base">Provides Emergency Services</label>
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300 mt-8"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        disabled={loading}
                    >
                        {loading ? 'Saving Details...' : 'Complete Onboarding'}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default HospitalOnboardingPage;
