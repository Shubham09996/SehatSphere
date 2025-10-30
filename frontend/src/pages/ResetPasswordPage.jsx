import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../utils/api';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { token } = useParams();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            toast.error('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const res = await api.put(`/api/users/reset-password/${token}`, { password });
            toast.success(res.data.message);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Something went wrong");
            toast.error(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-8 font-sans"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="w-full max-w-md p-6 md:p-8 bg-card rounded-2xl shadow-xl border border-border flex flex-col items-center space-y-6"
                variants={itemVariants}
            >
                <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end p-2 rounded-md">
                        <span className="text-primary-foreground font-bold text-lg">H</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">HealthSphere</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">Reset Password</h2>
                <p className="text-muted-foreground text-center text-sm sm:text-base">Enter your new password.</p>

                <form onSubmit={submitHandler} className="w-full space-y-5">
                    {/* New Password Input */}
                    <div className="relative group">
                        <label htmlFor="password" className="sr-only">New Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter new password"
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

                    {/* Confirm New Password Input */}
                    <div className="relative group">
                        <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            className="w-full p-3 pl-10 pr-10 border border-border rounded-md bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle text-sm sm:text-base"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                        <motion.button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                            whileHover={{ scale: 1.1 }}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </motion.button>
                    </div>

                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                    <motion.button
                        type="submit"
                        className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </motion.button>
                </form>

                <p className="text-center text-muted-foreground text-xs sm:text-sm">
                    <Link to="/login" className="font-medium bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text hover:underline ml-1">
                        Back to Sign In
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default ResetPasswordPage;
