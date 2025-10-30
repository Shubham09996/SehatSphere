import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Building, MapPin, Mail, Phone, Tag } from 'lucide-react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const AddHospitalPage = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [departments, setDepartments] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const departmentArray = departments.split(',').map(d => d.trim()).filter(d => d !== '');
            await api.post('/api/hospitals', {
                name,
                location,
                address,
                image: image || '/uploads/default_hospital.jpg',
                contactEmail,
                contactPhone,
                departments: departmentArray,
            });
            toast.success('Hospital added successfully!');
            // Clear form
            setName('');
            setLocation('');
            setAddress('');
            setImage('');
            setContactEmail('');
            setContactPhone('');
            setDepartments('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
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
                <PlusCircle size={28} className="text-primary" /> Add New Hospital
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Hospital Name</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="name"
                                className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                                placeholder="MediCare Hospital"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-muted-foreground">Location (City, Country)</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="location"
                                className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                                placeholder="Mumbai, India"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-muted-foreground">Full Address</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="address"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                            placeholder="123 Health St, Bandra, Mumbai"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-muted-foreground">Image URL (Optional)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="image"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                            placeholder="/uploads/hospital_image.jpg"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-muted-foreground">Contact Email</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="contactEmail"
                                className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                                placeholder="email@example.com"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="contactPhone" className="block text-sm font-medium text-muted-foreground">Contact Phone</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                id="contactPhone"
                                className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                                placeholder="+1234567890"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="departments" className="block text-sm font-medium text-muted-foreground">Departments (comma-separated)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="departments"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                            placeholder="Cardiology, Neurology, Pediatrics"
                            value={departments}
                            onChange={(e) => setDepartments(e.target.value)}
                            required
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
                    {loading ? 'Adding Hospital...' : 'Add Hospital'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default AddHospitalPage;
