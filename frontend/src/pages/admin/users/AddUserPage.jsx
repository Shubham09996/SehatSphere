import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Phone, User, Image } from 'lucide-react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const AddUserPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('Patient'); // Default role
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userRoles = ['Patient', 'Doctor', 'Shop', 'Admin'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phoneNumber', phoneNumber);
            formData.append('role', role);
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            await api.post('/api/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('User added successfully!');
            // Clear form
            setFullName('');
            setEmail('');
            setPassword('');
            setPhoneNumber('');
            setRole('Patient');
            setProfilePicture(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto p-6 bg-card rounded-xl shadow-lg border border-border"
        >
            <h1 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <UserPlus size={28} className="text-primary" /> Add New User
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-muted-foreground">Full Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="fullName"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                            placeholder="john.doe@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            id="password"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-muted-foreground">Phone Number (Optional)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            id="phoneNumber"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                            placeholder="+1234567890"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-muted-foreground">Role</label>
                    <select
                        id="role"
                        className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        {userRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-muted-foreground">Profile Picture (Optional)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            className="focus:ring-primary focus:border-primary block w-full pr-3 py-2 border border-input rounded-md bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">Error: {error}</p>}

                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Adding User...' : 'Add User'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default AddUserPage;
