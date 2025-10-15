import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api'; // api.js se import karein
import { Heart, Search, MapPin, Calendar, Users, Droplets, FlaskConical, Stethoscope, Award, ClipboardList, BookOpen, Clock } from 'lucide-react';
// Removed: import axios from 'axios'; // For API calls

const DonatePage = () => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [donationCenters, setDonationCenters] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    // Dummy patient data for demonstration. In a real app, this would come from authenticated user context.
    const currentPatientId = '65239a24687d603a11cf8743'; // Replace with actual patient ID from context/store
    const patientBloodGroup = 'A+'; // Replace with actual patient blood group from context/store

    const mockDonationCenters = [
        {
            _id: '1',
            name: 'City Blood Bank',
            address: '123 Main St, Cityville',
            location: 'Cityville',
            contactPhone: '123-456-7890',
            contactEmail: 'info@citybloodbank.com',
            operatingHours: 'Mon-Fri: 9 AM - 5 PM',
            image: '/uploads/city_blood_bank.jpg',
        },
        {
            _id: '2',
            name: 'Community Donation Center',
            address: '456 Oak Ave, Townsville',
            location: 'Townsville',
            contactPhone: '987-654-3210',
            contactEmail: 'contact@communitydonate.org',
            operatingHours: 'Mon-Sat: 10 AM - 4 PM',
            image: '/uploads/community_donation_center.jpg',
        },
        {
            _id: '3',
            name: 'Red Cross Donation Hub',
            address: '789 Pine Ln, Villageton',
            location: 'Villageton',
            contactPhone: '555-123-4567',
            contactEmail: 'donate@redcross.org',
            operatingHours: 'Tue-Sun: 11 AM - 6 PM',
            image: '/uploads/red_cross_hub.jpg',
        },
    ];

    useEffect(() => {
        // const fetchDonationCenters = async () => {
        //     try {
        //         const { data } = await api.get('/api/donationcenters');
        //         setDonationCenters(data);
        //     } catch (err) {
        //         setError(err);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchDonationCenters();
        setDonationCenters(mockDonationCenters);
        // setLoading(false); // Manually set loading to false for mock data
    }, []);

    const handleScheduleDonation = async (centerId, centerName) => {
        try {
            // In a real application, this would trigger an API call or navigation to a scheduling form.
            // For now, let's simulate a successful API call.
            const scheduleData = {
                patient: currentPatientId,
                donationCenterId: centerId,
                scheduledDate: new Date().toISOString().split('T')[0], // Today's date for demo
                scheduledTime: '10:00', // Fixed time for demo
                notes: `Blood donation scheduled at ${centerName}.`,
                bloodGroup: patientBloodGroup,
            };
            
            // Make API call to backend to create a donation request
            // await api.post('/donations', scheduleData);

            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 5000); // Hide confirmation after 5 seconds
        } catch (err) {
            // setError(err.response?.data?.message || err.message);
            console.error("Error scheduling donation:", err);
            alert("Failed to schedule donation.");
        }
    };

    // if (loading) return <p className="text-center">Loading donation centers...</p>;
    // if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="text-foreground min-h-screen">
            {/* FIX: Correctly aligned the heading and applied gradient only to the text */}
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Droplets size={32} className="text-hs-gradient-start" />
                <span className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Blood Donation
                </span>
            </h1>

            <div className="bg-card p-6 rounded-lg shadow-lg mb-8 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Why Donate Blood?</h2>
                <p className="text-lg text-muted-foreground mb-4">
                    Blood donations save millions of lives each year. Your single donation can help up to three people in need.
                    It's a simple, safe, and powerful way to make a difference.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><FlaskConical size={18} className="text-hs-gradient-middle" /> Helps accident victims, surgical patients, and those battling illnesses.</li>
                    <li className="flex items-center gap-2"><Users size={18} className="text-hs-gradient-middle" /> Contributes to community health and well-being.</li>
                    <li className="flex items-center gap-2"><Heart size={18} className="text-hs-gradient-middle" /> A selfless act that shows compassion and support.</li>
                </ul>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg mb-8 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Find a Donation Center</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donationCenters.map(center => (
                        <div key={center._id} className="border border-border p-4 rounded-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{center.name}</h3>
                                <p className="text-muted-foreground flex items-center gap-1 mb-1"><MapPin size={16} /> {center.address}</p>
                                <p className="text-muted-foreground flex items-center gap-1">{center.location} </p>
                            </div>
                            <button 
                                onClick={() => handleScheduleDonation(center._id, center.name)}
                                className="mt-4 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground rounded-md hover:opacity-90 transition-opacity self-start"
                            >
                                Schedule Donation
                            </button>
                        </div>
                    ))}
                </div>
                {showConfirmation && (
                    <p className="text-center mt-6 text-green-500 dark:text-green-400 font-semibold">
                        Thank you for your interest! Your donation request has been sent. A representative will contact you shortly to schedule your donation.
                    </p>
                )}
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-4">Eligibility & Preparation</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Be at least 17 years old (16 with parental consent in some areas).</li>
                    <li>Weigh at least 110 pounds (50 kg).</li>
                    <li>Be in good general health.</li>
                    <li>Drink plenty of water and eat a healthy meal before donating.</li>
                    <li>Bring a valid ID.</li>
                </ul>
            </div>
        </div>
    );
};

export default DonatePage;

