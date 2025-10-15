import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Image } from 'lucide-react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const AdminProfileSettings = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [currentProfilePictureUrl, setCurrentProfilePictureUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/admin/profile');
                const { personalInfo } = response.data;
                setName(personalInfo.name);
                setEmail(personalInfo.email);
                setCurrentProfilePictureUrl(personalInfo.pfp);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('name', name);
            // Note: Email usually not editable via profile settings in many systems, 
            // or requires a separate verification flow. Assuming it's not directly editable here.
            // formData.append('email', email);
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            await api.put('/api/admin/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Profile updated successfully!');
            // Optionally, re-fetch profile to update UI if needed
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
            setCurrentProfilePictureUrl(URL.createObjectURL(e.target.files[0])); // Show preview
        }
    };

    if (loading) {
        return <div className="text-center text-foreground p-8">Loading profile settings...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error loading settings: {error}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card p-6 rounded-xl shadow-lg border border-border space-y-6"
        >
            <h2 className="text-2xl font-bold text-foreground mb-4">Profile Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col items-center gap-4">
                    <img 
                        src={currentProfilePictureUrl || "https://via.placeholder.com/100"} 
                        alt="Profile Picture" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary/50"
                    />
                    <div>
                        <label htmlFor="profilePictureInput" className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            <Image size={18} className="mr-2" /> Change Profile Picture
                        </label>
                        <input
                            id="profilePictureInput"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                            value={email}
                            readOnly
                        />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed from here.</p>
                </div>

                {error && <p className="text-red-500 text-sm">Error: {error}</p>}

                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : 'Save Changes'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default AdminProfileSettings;
