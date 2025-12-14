import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../utils/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const res = await api.post('/api/users/forgot-password', { email });
            setMessage(res.data.message);
            toast.success(res.data.message);
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
                    <span className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">SehatSphere</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">Forgot Password</h2>
                <p className="text-muted-foreground text-center text-sm sm:text-base">Enter your email address to receive a password reset link.</p>

                <form onSubmit={submitHandler} className="w-full space-y-5">
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

                    <motion.button
                        type="submit"
                        className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </motion.button>
                </form>

                {message && <p className="text-green-500 text-center text-sm">{message}</p>}
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                <p className="text-center text-muted-foreground text-xs sm:text-sm">
                    Remember your password?
                    <Link to="/login" className="font-medium bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text hover:underline ml-1">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default ForgotPasswordPage;
