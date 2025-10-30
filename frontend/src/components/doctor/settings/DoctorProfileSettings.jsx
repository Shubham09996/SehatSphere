import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../utils/api'; // api.js se import karein
import { CheckCircle, XCircle } from 'lucide-react';

const SettingsCard = ({ title, description, children, footer }) => (
    <motion.div 
        className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="p-4 bg-muted/50 rounded-b-xl text-right">
            {footer}
        </div>
    </motion.div>
);

const DoctorProfileSettings = () => {
    const [fullName, setFullName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [medicalRegistrationNumber, setMedicalRegistrationNumber] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const doctorId = '60d0fe4f5311236168a109cb'; // Temporarily using a dummy doctorId. This should come from auth context.

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/doctors/${doctorId}/profile`);
                const data = response.data.doctorProfile;
                setFullName(data.name || '');
                setSpecialty(data.specialty || '');
                setQualifications(data.qualifications || '');
                setMedicalRegistrationNumber(data.medicalRegistrationNumber || '');
                setYearsOfExperience(data.experience ? String(data.experience) : '');
                setBio(data.bio || '');
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorProfile();
    }, [doctorId]);

    const handleSaveChanges = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const updatedProfile = {
                name: fullName,
                specialty,
                qualifications,
                medicalRegistrationNumber,
                yearsOfExperience: parseInt(yearsOfExperience),
                bio,
            };
            await api.put(`/doctors/${doctorId}/profile`, updatedProfile);
            setSaveSuccess(true);
        } catch (err) {
            console.error('Error saving profile:', err);
            setError(err); // Consider a more user-friendly error display
        } finally {
            setSaving(false);
            setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
        }
    };

    if (loading) {
        return <div className="text-center text-foreground p-6">Loading profile settings...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-6">Error loading profile settings: {error.message}</div>;
    }

    return (
        <SettingsCard
            title="Professional Profile"
            description="This information will be visible to patients."
            footer={
                <div className="flex items-center justify-end gap-3">
                    {saveSuccess && <span className="text-sm text-green-500">Profile saved successfully!</span>}
                    <button 
                        onClick={handleSaveChanges} 
                        className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                    <input 
                        type="text" 
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)} 
                        className="mt-1 w-full bg-background border border-border rounded-md p-2"
                    />
                </div>
                <div>
                    <label htmlFor="specialty" className="text-sm font-medium">Specialty</label>
                    <input 
                        type="text" 
                        id="specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)} 
                        className="mt-1 w-full bg-background border border-border rounded-md p-2"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="qualifications" className="text-sm font-medium">Qualifications</label>
                    <input 
                        type="text" 
                        id="qualifications"
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)} 
                        className="mt-1 w-full bg-background border border-border rounded-md p-2"
                    />
                </div>
                 <div>
                    <label htmlFor="medicalRegistrationNumber" className="text-sm font-medium">Medical Registration Number</label>
                    <input 
                        type="text" 
                        id="medicalRegistrationNumber"
                        value={medicalRegistrationNumber}
                        onChange={(e) => setMedicalRegistrationNumber(e.target.value)} 
                        className="mt-1 w-full bg-background border border-border rounded-md p-2"
                    />
                </div>
                 <div>
                    <label htmlFor="yearsOfExperience" className="text-sm font-medium">Years of Experience</label>
                    <input 
                        type="number" 
                        id="yearsOfExperience"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)} 
                        className="mt-1 w-full bg-background border border-border rounded-md p-2"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="bio" className="text-sm font-medium">Biography</label>
                    <textarea 
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)} 
                        rows="4" 
                        className="mt-1 w-full bg-background border border-border rounded-md p-2"
                    ></textarea>
                </div>
            </div>
        </SettingsCard>
    );
};

export default DoctorProfileSettings;