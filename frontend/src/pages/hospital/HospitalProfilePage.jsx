import React, { useState, useEffect } from 'react';
import { UserCircle, Mail, Phone, MapPin, Building, CalendarDays, FileText, Users, Globe, BriefcaseMedical, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { HospitalIcon } from 'lucide-react';

const HospitalProfilePage = () => {
    const { user } = useAuth();
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null); // To store the selected file object
    const [profileImagePreview, setProfileImagePreview] = useState(''); // To display image preview

    const { updateUser } = useAuth(); // NEW: Import updateUser from AuthContext

    // Form states for editing
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

    const availableSpecialties = [
        'Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics', 
        'Dermatology', 'Ophthalmology', 'ENT', 'Gastroenterology', 'Nephrology'
    ];

    useEffect(() => {
        const fetchHospitalProfile = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/hospitals/profile');
                const data = res.data;
                setHospital(data);
                // Initialize form states with fetched data
                setHospitalName(data.name);
                setAddress(data.address);
                setCity(data.city);
                setState(data.state);
                setZipCode(data.zipCode);
                setPhoneNumber(data.contactPhone);
                setEmail(data.contactEmail);
                setDescription(data.description);
                setLicenseNumber(data.licenseNumber);
                setDirectorName(data.directorName);
                setNumberOfBeds(data.numberOfBeds);
                setWebsite(data.website);
                setSpecialties(data.specialties || []);
                setEmergencyServices(data.emergencyServices || false);
                setProfileImagePreview(data.image || '/uploads/default_hospital.jpg'); // Initialize image preview
            } catch (err) {
                console.error('Failed to fetch hospital profile:', err);
                toast.error(err.response?.data?.message || 'Failed to load hospital profile.');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'Hospital') {
            fetchHospitalProfile();
        }
    }, [user]);

    const handleSpecialtyChange = (specialty) => {
        setSpecialties(prev => 
            prev.includes(specialty) 
                ? prev.filter(s => s !== specialty) 
                : [...prev, specialty]
        );
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file));
        } else {
            setProfileImage(null);
            setProfileImagePreview(hospital.image || '/uploads/default_hospital.jpg'); // Revert to current hospital image
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();

            formData.append('name', hospitalName);
            formData.append('address', address);
            formData.append('city', city);
            formData.append('state', state);
            formData.append('zipCode', zipCode);
            formData.append('phoneNumber', phoneNumber);
            formData.append('email', email);
            formData.append('description', description);
            formData.append('licenseNumber', licenseNumber);
            formData.append('directorName', directorName);
            formData.append('numberOfBeds', parseInt(numberOfBeds, 10));
            formData.append('website', website);
            formData.append('specialties', JSON.stringify(specialties)); // Send as JSON string
            formData.append('emergencyServices', emergencyServices);

            if (profileImage) {
                formData.append('image', profileImage);
            }

            const res = await api.put('/api/hospitals/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setHospital(res.data); // Update local state with new data
            setProfileImage(null); // Clear selected file after upload
            setProfileImagePreview(res.data.image || '/uploads/default_hospital.jpg'); // Update preview with new image URL
            toast.success('Hospital profile updated successfully!');
            updateUser({ profilePicture: res.data.image }); // NEW: Update AuthContext with new profile picture
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update hospital profile:', err);
            toast.error(err.response?.data?.message || 'Failed to update hospital profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-foreground">Loading hospital profile...</div>;
    }

    if (!hospital) {
        return <div className="text-center py-8 text-red-500">Hospital profile not found or access denied.</div>;
    }

    // If status is pending, show a message and prevent editing
    if (hospital.status === 'Pending') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 text-center p-8 bg-card rounded-xl border border-border/70 shadow-sm"
            >
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-4">Profile Awaiting Approval</h1>
                <p className="text-muted-foreground text-lg mb-6">Your hospital profile has been submitted and is currently awaiting approval from our administrators.</p>
                <p className="text-sm text-gray-500">You will be notified once your profile status changes. Thank you for your patience.</p>
                {loading && <div className="text-center py-4 text-primary">Loading...</div>}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6">Hospital Profile</h1>
            <p className="text-muted-foreground mb-8">Manage and view your hospital's information.</p>

            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <img src={profileImagePreview} alt="Hospital Profile" className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md" />
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-foreground mb-2">{hospital.name}</h2>
                    <p className="text-muted-foreground text-lg mb-4">{hospital.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground">
                        <p className="flex items-center gap-2"><Mail size={16} className="text-primary" /> {hospital.contactEmail}</p>
                        <p className="flex items-center gap-2"><Phone size={16} className="text-primary" /> {hospital.contactPhone}</p>
                        <p className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> {hospital.address}, {hospital.city}, {hospital.state} - {hospital.zipCode}</p>
                        {hospital.website && <p className="flex items-center gap-2"><Globe size={16} className="text-primary" /> <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{hospital.website}</a></p>}
                        <p className="flex items-center gap-2"><FileText size={16} className="text-primary" /> License: {hospital.licenseNumber}</p>
                        <p className="flex items-center gap-2"><UserCircle size={16} className="text-primary" /> Director: {hospital.directorName}</p>
                        <p className="flex items-center gap-2"><Users size={16} className="text-primary" /> Beds: {hospital.numberOfBeds}</p>
                        <p className="flex items-center gap-2"><BriefcaseMedical size={16} className="text-primary" /> Emergency: {hospital.emergencyServices ? 'Yes' : 'No'}</p>
                        <p className="flex items-center gap-2"><HospitalIcon size={16} className="text-primary" /> Status: <span className={`font-semibold ${hospital.status === 'Active' ? 'text-green-500' : hospital.status === 'Pending' ? 'text-orange-500' : 'text-red-500'}`}>{hospital.status}</span></p>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold text-foreground">Specialties:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {hospital.specialties.map((specialty, index) => (
                                <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Section */}
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-foreground">Edit Profile Information</h3>
                    <motion.button 
                        onClick={() => setIsEditing(!isEditing)} 
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </motion.button>
                </div>

                <AnimatePresence mode="wait">
                    {isEditing && (
                        <motion.form 
                            key="edit-form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            onSubmit={handleUpdate} 
                            className="space-y-6 pt-4"
                        >
                            {/* General Information */}
                            <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2">General Information</h2>
                            <div className="relative w-full flex justify-center mb-6">
                                <img src={profileImagePreview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-2 border-border" />
                                <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90">
                                    <Camera size={18} />
                                    <input type="file" id="profileImageInput" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input type="text" id="hospitalName" placeholder="Hospital Name" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" required />
                                    <Building size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                                <div className="relative">
                                    <input type="text" id="licenseNumber" placeholder="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" required />
                                    <FileText size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="relative">
                                <input type="email" id="email" placeholder="Contact Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" required />
                                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <div className="relative">
                                <input type="tel" id="phoneNumber" placeholder="Contact Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" required />
                                <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            </div>
                             <div className="relative">
                                <input type="text" id="website" placeholder="Website URL (Optional)" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" />
                                <Globe size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            </div>

                            {/* Address */}
                            <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2 mt-8">Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input type="text" id="address" placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" required />
                                    <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                                <div className="relative">
                                    <input type="text" id="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" required />
                                    <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                                <div className="relative">
                                    <input type="text" id="state" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" required />
                                    <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                                <div className="relative">
                                    <input type="text" id="zipCode" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" required />
                                    <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            {/* Additional Details */}
                            <h2 className="text-xl font-semibold text-primary mb-4 border-b pb-2 mt-8">Additional Details</h2>
                            <div className="relative">
                                <textarea id="description" placeholder="Brief Description of Hospital" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle resize-y" required></textarea>
                                <HospitalIcon size={20} className="absolute left-3 top-4 text-muted-foreground" />
                            </div>
                            <div className="relative">
                                <input type="text" id="directorName" placeholder="CEO / Director Name" value={directorName} onChange={(e) => setDirectorName(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" required />
                                <UserCircle size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            </div>
                            <div className="relative">
                                <input type="number" id="numberOfBeds" placeholder="Number of Beds" value={numberOfBeds} onChange={(e) => setNumberOfBeds(e.target.value)} className="w-full p-3 pl-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle" min="0" required />
                                <Users size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
                                <input type="checkbox" id="emergencyServices" checked={emergencyServices} onChange={(e) => setEmergencyServices(e.target.checked)} className="form-checkbox h-5 w-5 text-hs-gradient-middle rounded-md border-border bg-background focus:ring-hs-gradient-middle" />
                                <label htmlFor="emergencyServices" className="text-foreground text-base">Provides Emergency Services</label>
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300 mt-8"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                disabled={loading}
                            >
                                {loading ? 'Updating Details...' : 'Save Changes'}
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default HospitalProfilePage;
