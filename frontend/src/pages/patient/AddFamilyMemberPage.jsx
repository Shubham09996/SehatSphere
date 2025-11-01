import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../utils/api';
import { Loader2 } from 'lucide-react';

const AddFamilyMemberPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        emergencyContact: {
            name: '',
            relation: '',
            phone: '',
        },
        allergies: '',
        chronicConditions: '',
    });
    const [profilePicture, setProfilePicture] = useState(null); // New state for profile picture
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('emergencyContact.')) {
            setFormData(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [name.split('.')[1]]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (key === 'emergencyContact') {
                    formDataToSend.append('emergencyContact.name', formData.emergencyContact.name);
                    formDataToSend.append('emergencyContact.relation', formData.emergencyContact.relation);
                    formDataToSend.append('emergencyContact.phone', formData.emergencyContact.phone);
                } else if (key === 'allergies' || key === 'chronicConditions') {
                    // Handle comma-separated strings for arrays
                    const values = formData[key] ? formData[key].split(',').map(item => item.trim()) : [];
                    values.forEach(val => formDataToSend.append(key, val));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
            if (profilePicture) {
                formDataToSend.append('profilePicture', profilePicture);
            }

            await api.post('/api/family/add', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Family member added successfully!');
            navigate('/patient/dashboard'); // Navigate back to dashboard or family list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add family member.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Add New Family Member</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-md">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-muted-foreground">Profile Picture</label>
                    <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500
                                   file:mr-4 file:py-2 file:px-4
                                   file:rounded-md file:border-0
                                   file:text-sm file:font-semibold
                                   file:bg-primary file:text-primary-foreground
                                   hover:file:bg-primary/90"
                        accept="image/*"
                    />
                </div>

                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-muted-foreground">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-muted-foreground">Blood Group</label>
                    <input
                        type="text"
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                    />
                </div>

                <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Emergency Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-muted-foreground">Name</label>
                        <input
                            type="text"
                            id="emergencyContact.name"
                            name="emergencyContact.name"
                            value={formData.emergencyContact.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="emergencyContact.relation" className="block text-sm font-medium text-muted-foreground">Relation</label>
                        <input
                            type="text"
                            id="emergencyContact.relation"
                            name="emergencyContact.relation"
                            value={formData.emergencyContact.relation}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-muted-foreground">Phone</label>
                        <input
                            type="text"
                            id="emergencyContact.phone"
                            name="emergencyContact.phone"
                            value={formData.emergencyContact.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-muted-foreground">Allergies (comma-separated)</label>
                    <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                        placeholder="e.g., Peanuts, Penicillin"
                    />
                </div>

                <div>
                    <label htmlFor="chronicConditions" className="block text-sm font-medium text-muted-foreground">Chronic Conditions (comma-separated)</label>
                    <input
                        type="text"
                        id="chronicConditions"
                        name="chronicConditions"
                        value={formData.chronicConditions}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary"
                        placeholder="e.g., Diabetes, Hypertension"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end hover:from-hs-gradient-end hover:to-hs-gradient-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-foreground"
                    disabled={loading}
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Family Member
                </button>
            </form>
        </div>
    );
};

export default AddFamilyMemberPage;
