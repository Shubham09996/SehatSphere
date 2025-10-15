import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, CheckCircle, Briefcase, Star, Clock, Brain, Users, BarChart2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
// import { doctorProfileData as data } from '../../data/doctorProfileData'; // Remove this import
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
// Removed: import axios from 'axios'; // Import axios
import api from '../../utils/api'; // api.js se import karein

const InfoCard = ({ title, icon, children }) => (
    <div className="bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
            {/* 1. InfoCard ke icon par gradient lagaya hai */}
            <div className="p-2 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white">
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <h3 className="font-bold text-lg text-foreground">{title}</h3>
        </div>
        {children}
    </div>
);

const DoctorProfilePage = () => {
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            const medicalRegistrationNumber = localStorage.getItem('doctorId'); // Retrieve doctorId from localStorage as medicalRegistrationNumber
            if (!medicalRegistrationNumber) {
                setError(new Error('Doctor ID (Medical Registration Number) not found in local storage.'));
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await api.get(`/api/doctors/profile/${medicalRegistrationNumber}`); // Corrected API route
                setDoctorProfile(response.data); // Corrected: getDoctorById returns the doctor object directly
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorProfile();
    }, []); // Removed doctorId from dependency array as it's fetched inside

    if (loading) {
        return <div className="text-center text-foreground">Loading doctor profile...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading profile: {error.message}</div>;
    }

    if (!doctorProfile) {
        return <div className="text-center text-muted-foreground">No doctor profile data found.</div>;
    }

    const data = doctorProfile; // Use fetched data as 'data' to maintain existing JSX structure

    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md flex flex-col sm:flex-row items-center gap-6">
                {/* 2. Profile picture ke border ka color change kiya hai */}
                <img src={data.personalInfo.pfp || "https://via.placeholder.com/100"} alt={data.personalInfo.name} className="w-28 h-28 rounded-full border-4 border-cyan-400/50"/>
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                        {/* Doctor ka naam plain rakha hai, as requested */}
                        <h1 className="text-3xl font-bold text-foreground">{data.personalInfo.name}</h1>
                        {data.personalInfo.isVerified && <CheckCircle className="text-green-500" />}
                    </div>
                    {/* 3. Specialty text par gradient lagaya hai */}
                    <p className="font-semibold bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text">{data.specialty}</p>
                    <p className="text-sm text-muted-foreground mt-1">{data.qualifications} • {data.experience} years experience</p>
                    <p className="text-sm text-muted-foreground">Reg. No: <span className="font-semibold text-foreground">{data.medicalRegistrationNumber}</span></p>
                </div>
                <Link to="/doctor/settings/profile" className="flex items-center gap-2 font-semibold py-2 px-4 rounded-lg bg-muted text-foreground hover:bg-border">
                    <Edit size={16}/> Edit Profile
                </Link>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <InfoCard title="About Me" icon={<User />}>
                        <p className="text-muted-foreground leading-relaxed">{data.bio}</p>
                    </InfoCard>

                    <InfoCard title="Performance" icon={<BarChart2 />}>
                        <div className="grid grid-cols-3 gap-4 text-center mb-6">
                            <div><p className="text-3xl font-bold">{data.performance.totalPatients}+</p><p className="text-sm text-muted-foreground">Total Patients</p></div>
                            <div><p className="text-3xl font-bold">{data.performance.consultationsThisMonth}</p><p className="text-sm text-muted-foreground">This Month</p></div>
                            <div><p className="text-3xl font-bold flex items-center justify-center gap-1">{data.performance.avgRating}<Star size={18} className="text-yellow-400"/></p><p className="text-sm text-muted-foreground">Avg. Rating</p></div>
                        </div>
                        <div className="h-48 w-full">
                            {/* 4. Chart ki line ka color change kiya hai */}
                            <ResponsiveContainer><LineChart data={data.performance.monthlyConsultations}><XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false}/><YAxis fontSize={12} tickLine={false} axisLine={false}/><Tooltip/><Line type="monotone" dataKey="count" stroke="#0891b2" strokeWidth={2} /></LineChart></ResponsiveContainer>
                        </div>
                    </InfoCard>
                    
                    <InfoCard title="Patient Reviews" icon={<Users />}>
                        <div className="space-y-4">
                            {data.reviews.map((review, i) => (
                                <div key={i} className="border-b border-border pb-2 last:border-b-0 last:pb-0">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{review.patientName}</p>
                                        <div className="flex items-center gap-1 text-sm font-bold">{review.rating} <Star size={14} className="text-yellow-400"/></div>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                    <InfoCard title="Expertise" icon={<Brain />}>
                         <div className="flex flex-wrap gap-2">
                            {/* 5. Expertise tags ka color change kiya hai */}
                            {(data.expertise || []).map(skill => <span key={skill} className="text-xs px-2 py-1 bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 rounded-full font-medium">{skill}</span>)}
                        </div>
                    </InfoCard>
                    
                    <InfoCard title="Work Schedule" icon={<Clock />}>
                        <div className="space-y-2 text-sm">
                            {Object.entries(data.workSchedule || {}).map(([day, schedule]) => (
                                <div key={day} className="flex justify-between">
                                    <span className="font-semibold text-foreground">{day}</span>
                                    <span className={!schedule.enabled ? 'text-red-500 font-semibold' : 'text-muted-foreground'}>
                                        {!schedule.enabled ? 'Off' : `${schedule.from} - ${schedule.to}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePage;