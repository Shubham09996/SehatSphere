import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Stethoscope, User, Heart, Shield, Eye, EyeOff, Mail, Lock, Building, ShieldCheck, HeartHandshake, Sparkles, TestTube2, BriefcaseMedical, FileText, Phone
} from 'lucide-react';
import api from '../utils/api'; // Import the configured axios instance
import { useNavigate } from 'react-router-dom';
import PatientOnboardingModal from '../components/patient/PatientOnboardingModal';
import DoctorOnboardingModal from '../components/doctor/DoctorOnboardingModal';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

// Self-contained Google Icon to remove dependency errors
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
        <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
        <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
        <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
    </svg>
);

// Data for role selection
const roleData = {
    Patient: { icon: User, label: 'Patient' },
    Doctor: { icon: Stethoscope, label: 'Doctor' },
    Shop: { icon: Building, label: 'Shop' },
    Hospital: { icon: BriefcaseMedical, label: 'Hospital' }, // NEW: Hospital role
    Admin: { icon: ShieldCheck, label: 'Admin' }, // NEW: Admin role
};

// Mock data for the left promotional panel based on role
const roleInfo = {
    Patient: {
        title: 'Access your Health Profile',
        description: 'Book appointments, view prescriptions, and track your health journey.',
        features: [
            { icon: Sparkles, title: 'Smart Token System', text: 'Real-time queue tracking with wait time estimates.' },
            { icon: FileText, title: 'E-Prescriptions', text: 'Digital prescriptions with automatic verification.' },
            { icon: ShieldCheck, title: 'Secure Health Records', text: 'Your health data is encrypted and secure with us.' }
        ]
    },
    Doctor: {
        title: 'Manage Your Practice',
        description: 'Streamline patient management, consultations, and prescriptions.',
        features: [
            { icon: BriefcaseMedical, title: 'Efficient Patient Queue', text: 'Manage appointments and reduce patient wait times.' },
            { icon: FileText, title: 'Digital Prescriptions', text: 'Create and share e-prescriptions effortlessly.' },
            { icon: User, title: 'Patient Record Access', text: 'Securely access and update patient health records.' }
        ]
    },
    Shop: {
        title: 'Pharmacy & Lab Portal',
        description: 'Manage inventory, process orders, and connect with customers.',
        features: [
            { icon: TestTube2, title: 'Prescription Verification', text: 'Verify digital prescriptions instantly and securely.' },
            { icon: Building, title: 'Inventory Management', text: 'Track your stock and manage orders seamlessly.' },
            { icon: Sparkles, title: 'Wider Customer Reach', text: 'Connect with a larger network of patients.' }
        ]
    },
    Hospital: { // NEW: Hospital role info
        title: 'Hospital Management System',
        description: 'Manage operations, staff, and patient care with ease.',
        features: [
            { icon: BriefcaseMedical, title: 'Integrated Patient Care', text: 'Streamline patient journeys from admission to discharge.' },
            { icon: Stethoscope, title: 'Staff & Doctor Roster', text: 'Efficiently manage medical staff and their schedules.' },
            { icon: Building, title: 'Resource Optimization', text: 'Optimize hospital resources, beds, and equipment.' }
        ]
    },
    Admin: {
        title: 'Administrator Dashboard',
        description: 'Oversee the platform, manage users, and ensure smooth operations.',
        features: [
            { icon: Shield, title: 'User Management', text: 'Manage roles and permissions for all users.' },
            { icon: Stethoscope, title: 'Platform Health', text: 'Monitor the system analytics and performance.' },
            { icon: Sparkles, title: 'Content Moderation', text: 'Ensure the quality and safety of platform content.' }
        ]
    }
};


const PasswordStrengthMeter = ({ password }) => {
    const [strength, setStrength] = useState({ score: 0, label: 'Weak', color: 'bg-red-500' });

    useEffect(() => {
        let score = 0;
        if (password.length > 7) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        let label = 'Weak';
        let color = 'bg-red-500';

        switch(score) {
            case 1: label = 'Weak'; color = 'bg-red-500'; break;
            case 2: label = 'Fair'; color = 'bg-orange-500'; break;
            case 3: label = 'Good'; color = 'bg-yellow-500'; break;
            case 4: label = 'Strong'; color = 'bg-green-500'; break;
            default: label = 'Weak'; color = 'bg-red-500';
        }

        if (password.length === 0) {
            setStrength({ score: 0, label: 'Weak', color: 'bg-gray-300 dark:bg-gray-700' });
        } else {
            setStrength({ score, label, color });
        }
    }, [password]);

    return (
        <div className="flex items-center gap-2 mt-1">
            <div className="w-full bg-gray-200 dark:bg-muted/30 rounded-full h-2">
                <motion.div 
                    className={`h-2 rounded-full ${strength.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(strength.score / 4) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <span className="text-xs text-muted-foreground w-16 text-right">{strength.label}</span>
        </div>
    );
};

const SignupPage = () => {
    const [fullName, setFullName] = useState(''); // State for full name input
    const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number input
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Patient'); // Default role
    const [avatar, setAvatar] = useState(null); // State for selected avatar file
    const [avatarPreview, setAvatarPreview] = useState(''); // State for avatar preview URL
    const [showOnboardingModal, setShowOnboardingModal] = useState(false);
    const [newlySignedUpPatientId, setNewlySignedUpPatientId] = useState(null);
    const [newlySignedUpUserId, setNewlySignedUpUserId] = useState(null);
    const [showDoctorOnboardingModal, setShowDoctorOnboardingModal] = useState(false);
    const [newlySignedUpDoctorId, setNewlySignedUpDoctorId] = useState(null);
    const [hospitals, setHospitals] = useState([]); // New state for hospitals
    const [selectedHospital, setSelectedHospital] = useState(''); // New state for selected hospital ID
    const [loading, setLoading] = useState(false); // Add loading state

    const navigate = useNavigate();
    const { login } = useAuth(); // Use the login function from AuthContext

    // Fetch hospitals on component mount for the dropdown
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await api.get('/api/hospitals');
                setHospitals(res.data);
            } catch (err) {
                console.error('Failed to fetch hospitals:', err);
            }
        };
        fetchHospitals();
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        // Check for JWT in localStorage for authentication status
        if (localStorage.getItem('jwt')) {
            const userRole = localStorage.getItem('userRole');
            if (userRole) {
                navigate(`/${userRole.toLowerCase()}/dashboard`);
            }
        }
    }, [navigate]);

    // NEW: Handle Google OAuth redirect parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        const userInfo = queryParams.get('userInfo');

        if (token && userInfo) {
            console.log("Google OAuth Redirect - Token:", token);
            console.log("Google OAuth Redirect - UserInfo:", userInfo);
            const userDataForLogin = { ...JSON.parse(userInfo), token: token }; // Merge token into userInfo
            login(userDataForLogin); // Use the login function to set user and token
            // Clear the query parameters from the URL to avoid re-processing on refresh
            navigate(window.location.pathname, { replace: true });
        }
    }, [login, navigate]);

    const handleCredentialResponse = async (response) => {
        if (response.credential) {
            try {
                const res = await api.post('/users/google-auth', { idToken: response.credential });
                if (res.data) {
                    console.log("Google Signup Successful:", res.data);
                    const userRole = res.data.role.toLowerCase();
                    login(res.data);
                    navigate(`/${userRole}/dashboard`);
                }
            } catch (error) {
                console.error("Google Signup Failed:", error);
                alert("Google signup failed. Please try again.");
            }
        }
    };

    const handleGoogleSignupClick = () => {
        window.location.href = 'http://localhost:5000/api/users/auth/google'; // Directly navigate to backend Google OAuth
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatar(null);
            setAvatarPreview('');
        }
    };

    const submitHandler = async (e) => { // Renamed from handleNormalSignup for consistency
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!'); // Using toast for consistency
            return;
        }

        if (selectedRole === 'Doctor' && !selectedHospital) {
            toast.error('Please select a hospital for the doctor.'); // Using toast for consistency
            return;
        }
        setLoading(true); // Set loading to true

        // Removed the hardcoded frontend-only Hospital registration bypass
        // All registrations will now go through the backend endpoint.

        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('phoneNumber', phoneNumber);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', selectedRole);
            if (avatar) {
                formData.append('profilePicture', avatar);
            }
            if (selectedRole === 'Doctor' && selectedHospital) {
                formData.append('hospital', selectedHospital);
            }

            const res = await api.post('/api/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data) {
                console.log("Normal Signup Successful:", res.data);
                localStorage.setItem('profilePicture', res.data.profilePicture);
                localStorage.setItem('userName', res.data.name);
                localStorage.setItem('userRole', res.data.role);
                localStorage.setItem('jwt', res.data.token); // Store JWT token
                
                const userRole = res.data.role.toLowerCase();
                
                // Prepare data for login context
                const userDataForLogin = {
                    ...res.data, // Contains _id, name, email, role, profilePicture, phoneNumber, isVerified, status
                    doctorProfileId: res.data.specificProfileId, // For doctor onboarding
                    patientId: res.data.specificProfileId, // For patient onboarding
                };
                login(userDataForLogin); // Use login from AuthContext

                // Check for isNewUser (which would only be relevant for Google OAuth, but let's keep it for future-proofing)
                // For normal signup, we assume a new user is created and direct to onboarding or dashboard.
                if (userRole === 'patient') {
                    setNewlySignedUpPatientId(res.data.specificProfileId); // Use specificProfileId for patient
                    setNewlySignedUpUserId(res.data._id); // Use the newly created user's _id
                    setShowOnboardingModal(true);
                } else if (userRole === 'doctor') {
                    setNewlySignedUpDoctorId(res.data.specificProfileId); // Use specificProfileId for doctor
                    setNewlySignedUpUserId(res.data._id); // Use the newly created user's _id
                    setShowDoctorOnboardingModal(true);
                } else if (userRole === 'hospital') { // NEW: Hospital redirection to onboarding
                    navigate(`/hospital-onboarding/${res.data._id}`); // Redirect to hospital onboarding page
                } else {
                    // For other roles, just navigate to their dashboard
                    navigate(`/${userRole}/dashboard`);
                }

                toast.success('Registration successful!');
                window.dispatchEvent(new Event('localStorageUpdated'));
            }
        } catch (err) {
            console.error("Normal Signup Failed:", err);
            toast.error(err.response?.data?.message || err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false); // Set loading to false in finally block
        }
    };

    const currentRoleInfo = roleInfo[selectedRole];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.1, delayChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    };
    
    const featureItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    };

    return (
        <motion.div
            className="min-h-screen relative flex items-start justify-center p-4 pt-20 pb-8 overflow-x-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-hs-gradient-start rounded-full mix-blend-multiply filter blur-2xl opacity-30 dark:opacity-20 animate-blob" />
                <motion.div className="absolute top-1/2 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-hs-gradient-middle rounded-full mix-blend-multiply filter blur-2xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000" />
                <motion.div className="absolute bottom-1/4 left-1/3 w-56 h-56 sm:w-72 sm:h-72 bg-hs-gradient-end rounded-full mix-blend-multiply filter blur-2xl opacity-30 dark:opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 flex flex-col xl:flex-row items-stretch justify-center w-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl gap-4 lg:gap-8">
                {/* Left Promotional Panel (Now Dynamic) */}
                <motion.div
                    className="xl:w-1/2 p-6 bg-card rounded-2xl shadow-2xl border border-border flex flex-col justify-center space-y-3 backdrop-blur-md dark:bg-card/70"
                    variants={itemVariants}
                >
                     <div className="flex items-center space-x-2">
                         <div className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end p-2 rounded-md">
                             <span className="text-primary-foreground font-bold text-lg">H</span>
                         </div>
                         <span className="text-2xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">HealthSphere</span>
                     </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">{currentRoleInfo.title}</h2>
                    <p className="text-muted-foreground text-base sm:text-lg">{currentRoleInfo.description}</p>

                    <motion.div className="space-y-5" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                        {currentRoleInfo.features.map((feature, index) => (
                            <motion.div key={index} className="flex items-start space-x-4" variants={featureItemVariants}>
                                <feature.icon size={24} className="text-hs-gradient-middle flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm">{feature.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Signup Form */}
                <motion.div
                    className="xl:w-1/2 p-6 bg-card rounded-2xl shadow-2xl border border-border flex flex-col justify-center space-y-3 backdrop-blur-md dark:bg-card/70"
                    variants={itemVariants}
                >
                    <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text text-center">Create Account</h2>
                    
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-row xl:justify-center border-b border-border pb-2">
                        {Object.entries(roleData).map(([key, { icon: Icon, label }]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedRole(key)}
                                className={`relative flex items-center justify-center gap-2 py-3 px-2 text-sm font-semibold transition-colors ${selectedRole === key ? 'text-primary' : 'text-muted-foreground hover:text-foreground'} ${key === 'admin' ? 'col-span-2 mx-auto' : ''}`}
                            >
                                <Icon size={16} />
                                <span>{label}</span>
                                {selectedRole === key && <motion.div layoutId="role-indicator" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                        ))}
                    </div>

                    {/* Form Inputs */}
                    {/* Avatar Upload */}
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-20 h-20 rounded-full border-2 border-border flex flex-col items-center justify-center bg-background relative overflow-hidden">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <span className="text-sm font-semibold text-muted-foreground">Avatar</span>
                                    <User size={30} className="text-muted-foreground mt-1" />
                                </>
                            )}
                            {/* Hidden input for file selection */}
                            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </div>
                        <div className="flex flex-col justify-center">
                            <label htmlFor="avatar-upload" className="cursor-pointer bg-muted hover:bg-muted/70 text-foreground text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                                Upload new avatar
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Max 2MB. JPG, PNG, GIF.</p>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <input type="text" placeholder="Full Name" className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30" 
                            value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                    </div>
                    <div className="relative group">
                        <input type="tel" placeholder="Phone Number" className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30" 
                            value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                    </div>
                     <div className="relative group">
                        <input type="email" placeholder="your.email@example.com" className="w-full p-3 pl-10 pr-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30" 
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                    </div>
                    {/* Hospital Selection for Doctor Role */}
                    {selectedRole === 'Doctor' && (
                        <div className="relative group">
                            <select
                                id="hospital-signup"
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
                                htmlFor="hospital-signup"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors pointer-events-none"
                            >
                                <Building size={20} />
                            </label>
                        </div>
                    )}

                    <div className="relative group">
                        <input onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full p-3 pl-10 pr-10 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle dark:bg-muted/30" />
                        <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                        <motion.button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </motion.button>
                    </div>
                    <PasswordStrengthMeter password={password} />

                     <div className="relative group">
                        <input onChange={(e) => setConfirmPassword(e.target.value)} type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" className={`w-full p-3 pl-10 pr-10 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all duration-300 dark:bg-muted/30 ${password && confirmPassword && password !== confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-hs-gradient-middle'}`} />
                        <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                        <motion.button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </motion.button>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center space-x-2 text-muted-foreground cursor-pointer group">
                            <input type="checkbox" className="form-checkbox h-4 w-4 rounded-sm text-hs-gradient-middle focus:ring-hs-gradient-middle border-border bg-background transition-colors duration-300 dark:bg-muted/30 dark:border-muted/50" />
                            <span>I agree to the <a href="#" className="text-hs-gradient-middle hover:underline">Terms & Conditions</a></span>
                        </label>
                    </div>

                    <motion.button
                        className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={submitHandler} // Changed to submitHandler
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? 'Creating Account...' : 'Create Account'} {/* Change button text/add spinner */}
                    </motion.button>

                    <div className="flex items-center gap-2">
                        <div className="flex-grow border-t border-border"></div>
                        <span className="text-muted-foreground text-xs">OR CONTINUE WITH</span>
                        <div className="flex-grow border-t border-border"></div>
                    </div>
                    <motion.button 
                        className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-lg bg-background hover:bg-muted transition-colors dark:bg-muted/30 dark:hover:bg-muted/50"
                        whileHover={{ y: -2 }} 
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleSignupClick}
                    >
                        <GoogleIcon />
                        <span className="font-semibold text-foreground">Sign up with Google</span>
                    </motion.button>

                    <p className="text-center text-muted-foreground text-sm sm:text-base">
                        Already have an account? 
                        <a href="#" className="font-medium bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text hover:underline ml-1">
                            Sign In
                        </a>
                    </p>

                </motion.div>
            </div>
            <PatientOnboardingModal
                isOpen={showOnboardingModal}
                onClose={() => setShowOnboardingModal(false)}
                patientId={newlySignedUpPatientId}
                userId={newlySignedUpUserId}
            />

            <DoctorOnboardingModal
                isOpen={showDoctorOnboardingModal}
                onClose={() => setShowDoctorOnboardingModal(false)}
                doctorId={newlySignedUpDoctorId}
                userId={newlySignedUpUserId}
            />
        </motion.div>
    );
};

export default SignupPage;