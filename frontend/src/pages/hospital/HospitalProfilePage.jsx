import React from 'react';
import { UserCircle, Mail, Phone, MapPin, Building, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const hospitalProfileData = {
    name: 'HealthSphere Hospital',
    email: 'hospital@healthsphere.com',
    phone: '+91 98765 43210',
    address: '123 Hospital Road, Health City, State - 123456',
    established: '2005-01-15',
    specialties: ['Cardiology', 'Pediatrics', 'Orthopedics', 'Emergency Care'],
    description: 'A leading multi-specialty hospital committed to providing excellent healthcare services with state-of-the-art facilities.',
    profilePicture: 'https://res.cloudinary.com/diqraojkd/image/upload/v1709477028/HealthSphere/Users/avatar-placeholder.png',
};

const HospitalProfilePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-green-500 text-transparent bg-clip-text mb-6">Hospital Profile</h1>
            <p className="text-muted-foreground mb-8">Manage and view your hospital's information.</p>

            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <img src={hospitalProfileData.profilePicture} alt="Hospital Profile" className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md" />
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-foreground mb-2">{hospitalProfileData.name}</h2>
                    <p className="text-muted-foreground text-lg mb-4">{hospitalProfileData.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-foreground">
                        <p className="flex items-center gap-2"><Mail size={16} className="text-primary" /> {hospitalProfileData.email}</p>
                        <p className="flex items-center gap-2"><Phone size={16} className="text-primary" /> {hospitalProfileData.phone}</p>
                        <p className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> {hospitalProfileData.address}</p>
                        <p className="flex items-center gap-2"><CalendarDays size={16} className="text-primary" /> Established: {new Date(hospitalProfileData.established).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold text-foreground">Specialties:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {hospitalProfileData.specialties.map((specialty, index) => (
                                <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional: Add a section for editing profile or other details */}
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm mt-4">
                <h3 className="font-bold text-lg text-foreground mb-4">Edit Profile Information</h3>
                {/* Placeholder for an edit form */}
                <p className="text-muted-foreground">This section will contain a form to update hospital details.</p>
            </div>
        </motion.div>
    );
};

export default HospitalProfilePage;
