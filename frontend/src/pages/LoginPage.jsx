import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Stethoscope, Pill, Bot, User, Briefcase, Heart, Shield, Eye, EyeOff, Mail, Lock, Ambulance, Building, CheckCircle, Hospital, Syringe, ClipboardList 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// Removed Redux imports as slices/usersApiSlice and slices/authSlice are not found
// import { useDispatch, useSelector } from 'react-redux';
// import { useLoginMutation } from '../slices/usersApiSlice';
// import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
// import Loader from '../components/Loader'; // Removed as it was for Redux isLoading state
import api from '../utils/api'; // Import the configured axios instance
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

// Self-contained Google Icon to remove dependency errors (copied from SignupPage.jsx)
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
        <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
        <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
        <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
    </svg>
);

// Data for dynamic content based on selected role
const roleData = {
    patient: {
        icon: User,
        welcome: "Access your Health Profile",
        subtext: "Book appointments, view prescriptions, and track your health journey.",
        features: [
            { icon: Stethoscope, title: "Smart Token System", desc: "Real-time queue tracking with wait time estimates." },
            { icon: Pill, title: "E-Prescriptions", desc: "Digital prescriptions with automatic verification." },
            { icon: Bot, title: "AI Assistant", desc: "24/7 health support and appointment booking." }
        ]
    },
    doctor: {
        icon: Stethoscope,
        welcome: "Manage your Practice",
        subtext: "Streamline patient consultations, manage schedules, and issue e-prescriptions.",
        features: [
            { icon: ClipboardList, title: "Appointment Dashboard", desc: "View and manage all your patient appointments in one place." },
            { icon: CheckCircle, title: "Digital Verification", desc: "Securely sign and verify prescriptions and reports digitally." },
            { icon: Hospital, title: "Patient Records", desc: "Access comprehensive and secure patient health records." }
        ]
    },
    shop: {
        icon: Building,
        welcome: "Pharmacy Portal",
        subtext: "Verify prescriptions, manage inventory, and fulfill patient orders.",
        features: [
            { icon: Pill, title: "Prescription Verification", desc: "Instantly verify the authenticity of e-prescriptions." },
            { icon: Briefcase, title: "Order Management", desc: "Receive and manage orders from patients seamlessly." },
            { icon: CheckCircle, title: "Inventory Sync", desc: "Keep your stock updated with our smart inventory system." }
        ]
    },
    hospital: {
        icon: Hospital,
        welcome: "Hospital Management",
        subtext: "Manage operations, staff, and patient care with ease.",
        features: [
            { icon: ClipboardList, title: "Integrated Patient Care", desc: "Streamline patient journeys from admission to discharge." },
            { icon: Syringe, title: "Staff & Doctor Roster", desc: "Efficiently manage medical staff and their schedules." },
            { icon: Ambulance, title: "Resource Optimization", desc: "Optimize hospital resources, beds, and equipment." }
        ]
    },
    admin: {
        icon: Shield,
        welcome: "Administrator Control",
        subtext: "Oversee the entire platform, manage users, and view analytics.",
        features: [
            { icon: Briefcase, title: "User Management", desc: "Onboard, manage, and monitor all user roles." },
            { icon: CheckCircle, title: "Verification Pipeline", desc: "Approve or reject doctor and pharmacy applications." },
            { icon: Bot, title: "System Analytics", desc: "View platform usage statistics and generate reports." }
        ]
    }
};

const LoginPage = () => {
    const [role, setRole] = useState('patient');
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const selectedRoleData = roleData[role];
    const navigate = useNavigate();
    const { login } = useAuth(); // Use the login function from AuthContext

    // Removed Redux-related state and hooks
    // const dispatch = useDispatch();
    // const [login, { isLoading }] = useLoginMutation();
    // const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        // Check for JWT in localStorage for authentication status
        if (localStorage.getItem('jwt')) { // Check for JWT in localStorage
            const userRole = localStorage.getItem('userRole'); // Assuming userRole is stored
            if (userRole) {
                navigate(`/${userRole.toLowerCase()}/dashboard`);
            } else {
                navigate('/'); // Default to home if role not found
            }
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        try {
            const res = await api.post('/api/users/auth', { email, password });
            if (res.data) {
                console.log("Normal Login Successful:", res.data);
                localStorage.setItem('profilePicture', res.data.profilePicture);
                localStorage.setItem('userName', res.data.name);
                localStorage.setItem('userRole', res.data.role);
                localStorage.setItem('jwt', res.data.token); // Store JWT token

                // Prepare user data for AuthContext
                const userData = {
                    ...res.data,
                    specificProfileId: res.data.specificProfileId
                };
                
                // Call login from AuthContext
                login(userData);

                const userRole = res.data.role.toLowerCase();
                if (res.data.isNewUser && userRole === 'patient') {
                    navigate(`/patient-onboarding/${res.data._id}`);
                } else {
                    navigate(`/${userRole}/dashboard`);
                }
                toast.success('Login successful!');
            }
        } catch (err) {
            console.error("Normal Login Failed:", err);
            toast.error(err.response?.data?.message || err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false); // Set loading to false in finally block
        }
    };

    const handleGoogleLoginClick = () => {
        window.location.href = 'http://localhost:5000/api/users/auth/google'; // Directly navigate to backend Google OAuth
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.1, duration: 0.5 } 
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <motion.div
            // FIX: Adjusted padding to remove gap below navbar
            className="min-h-screen flex flex-col items-center justify-start bg-background px-4 pt-24 pb-10 sm:px-6 lg:px-8 font-sans overflow-y-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* FIX: Removed flex-grow to stop vertical centering */}
            <div className="flex flex-col xl:flex-row items-stretch justify-center max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl w-full gap-4 sm:gap-8">
                {/* Left Promotional Panel - Dynamic */}
                <motion.div
                    className="w-full xl:w-1/2 p-6 md:p-8 bg-card rounded-2xl shadow-xl border border-border flex flex-col justify-center flex-shrink-0"
                    variants={itemVariants}
                >
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end p-2 rounded-md">
                            <span className="text-primary-foreground font-bold text-lg">H</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">HealthSphere</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={role}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{selectedRoleData.welcome}</h2>
                            <p className="text-base sm:text-lg text-muted-foreground mb-6">{selectedRoleData.subtext}</p>
                            <div className="space-y-5">
                                {selectedRoleData.features.map((feature, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <feature.icon size={24} className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-foreground">{feature.title}</h3>
                                            <p className="text-muted-foreground text-sm">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Right Login Form */}
                <motion.div
                    className="w-full xl:w-1/2 p-6 md:p-8 bg-card rounded-2xl shadow-xl border border-border flex flex-col justify-start space-y-5 flex-shrink-0"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Sign In</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">Choose your role and sign in to continue</p>

                    {/* Role Selection */}
                    <div className="relative flex flex-wrap justify-center sm:justify-start gap-x-3 sm:gap-x-4 gap-y-2 border-b border-border pb-2">
                        {Object.keys(roleData).map((r) => {
                            const RoleIcon = roleData[r].icon;
                            return (
                                <motion.button
                                    key={r}
                                    className={`relative px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${role === r ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    onClick={() => setRole(r)}
                                >
                                    <RoleIcon size={16} />
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                    {role === r && (
                                        <motion.div
                                            className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end"
                                            layoutId="underline"
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                </motion.button>
                            )
                        })}
                    </div>
                    
                    {/* Form Inputs */}
                    <form onSubmit={submitHandler} className="space-y-5">
                        <div className="relative group">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="your.email@example.com"
                                className="w-full p-3 pl-10 pr-10 border border-border rounded-md bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle text-sm sm:text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                        </div>
                        <div className="relative group">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Enter your password"
                                className="w-full p-3 pl-10 pr-10 border border-border rounded-md bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle text-sm sm:text-base"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                            <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                                whileHover={{ scale: 1.1 }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </motion.button>
                        </div>

                        <div className="flex justify-between items-center text-xs sm:text-sm">
                            <label className="flex items-center space-x-2 text-muted-foreground cursor-pointer">
                                <input type="checkbox" className="form-checkbox rounded text-hs-gradient-middle focus:ring-hs-gradient-middle border-border" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="font-medium bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? 'Signing In...' : 'Sign In'} {/* Change button text/add spinner */}
                        </motion.button>
                    </form>

                    <div className="flex items-center gap-2">
                        <div className="flex-grow border-t border-border"></div>
                        <span className="text-muted-foreground text-xs">OR CONTINUE WITH</span>
                        <div className="flex-grow border-t border-border"></div>
                    </div>
                    <motion.button 
                        className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-lg bg-background hover:bg-muted transition-colors dark:bg-muted/30 dark:hover:bg-muted/50"
                        whileHover={{ y: -2 }} 
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLoginClick}
                    >
                        <GoogleIcon />
                        <span className="font-semibold text-foreground">Login with Google</span>
                    </motion.button>
                    
                    <p className="text-center text-muted-foreground text-xs sm:text-sm">
                        Don't have an account? 
                        <Link to="/signup" className="font-medium bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text hover:underline ml-1">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LoginPage;

