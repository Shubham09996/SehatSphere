import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search } from 'lucide-react';
// import { patientsData as initialPatients } from '../../data/patientsData'; // Commented out hardcoded data import
import PatientListTable from '../../components/doctor/patients/PatientListTable';
import PatientDetailDrawer from '../../components/doctor/patients/PatientDetailDrawer';
import AddPatientModal from '../../components/doctor/patients/AddPatientModal';
import { useLocation } from 'react-router-dom';
import api from '../../utils/api'; // Import api for backend calls

const filterOptions = ['All', 'New', 'Active', 'Needs Follow-up'];

const MyPatientsPage = () => {
    const [patients, setPatients] = useState([]); // Initialize with empty array
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    // Hardcoded patients data
    const hardcodedPatientsData = [
        {
            id: 'PID-102938',
            name: 'Ravi Kumar',
            pfp: 'https://avatar.iran.liara.run/public/boy?username=Ravi',
            age: 34,
            gender: 'Male',
            lastVisit: '10/5/2025',
            status: 'Active',
            contact: { phone: '9650843194', email: 'bittu123@gmail.com' },
            criticalInfo: { allergies: ['Penicillin'], chronicConditions: ['Asthma'] },
            recentVitals: { bloodPressure: '120/80', bloodSugar: '90 mg/dL' },
            recentActivity: [
                { date: '10/5/2025', title: 'Consultation with Dr. Sharma' },
                { date: '9/15/2025', title: 'Lab Report - Blood Test' },
            ],
        },
        {
            id: 'PID-102939',
            name: 'Sunita Sharma',
            pfp: 'https://avatar.iran.liara.run/public/girl?username=Sunita',
            age: 28,
            gender: 'Female',
            lastVisit: '10/2/2025',
            status: 'Needs Follow-up',
            contact: { phone: '8877665544', email: 'sunita.sharma@example.com' },
            criticalInfo: { allergies: ['None'], chronicConditions: ['Hypothyroidism'] },
            recentVitals: { bloodPressure: '110/70', bloodSugar: '100 mg/dL' },
            recentActivity: [
                { date: '10/2/2025', title: 'Follow-up with Dr. Gupta' },
            ],
        },
        {
            id: 'PID-102940',
            name: 'Amit Singh',
            pfp: 'https://avatar.iran.liara.run/public/boy?username=Amit',
            age: 45,
            gender: 'Male',
            lastVisit: '9/28/2025',
            status: 'Active',
            contact: { phone: '7788990011', email: 'amit.singh@example.com' },
            criticalInfo: { allergies: ['Dust'], chronicConditions: ['Diabetes'] },
            recentVitals: { bloodPressure: '130/85', bloodSugar: '140 mg/dL' },
            recentActivity: [
                { date: '9/28/2025', title: 'Consultation with Dr. Khan' },
            ],
        },
    ];

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const medicalRegistrationNumber = localStorage.getItem('doctorId');
                if (!medicalRegistrationNumber) {
                    setError(new Error('Doctor ID not found.'));
                    setLoading(false);
                    return;
                }
                const response = await api.get(`/api/patients`);
                
                const formattedDynamicPatients = response.data.map(p => ({
                    id: p.patientId, // Use patientId as id
                    name: p.user.name,
                    pfp: p.user.profilePicture || 'https://avatar.iran.liara.run/public/boy?username=Default', // Fallback for profile picture
                    age: new Date().getFullYear() - new Date(p.dob).getFullYear(),
                    gender: p.gender,
                    lastVisit: p.recentActivity && p.recentActivity.length > 0 ? new Date(p.recentActivity[0].date).toLocaleDateString() : 'N/A',
                    status: p.status || 'Active', // Assuming patient has a status or default to Active
                    contact: { phone: p.user.phoneNumber, email: p.user.email },
                    criticalInfo: { 
                        allergies: p.allergies && p.allergies.length > 0 ? p.allergies : ['None'], 
                        chronicConditions: p.chronicConditions && p.chronicConditions.length > 0 ? p.chronicConditions : ['None'],
                    },
                    recentVitals: { 
                        bloodPressure: p.recentVitals?.bloodPressure?.value || 'N/A',
                        bloodSugar: p.recentVitals?.bloodSugar?.value || 'N/A',
                    },
                    recentActivity: p.recentActivity || [],
                }));

                // Merge dynamic patients with hardcoded patients, prioritizing hardcoded if IDs conflict
                const mergedPatients = hardcodedPatientsData.map(hp => {
                    const dynamicMatch = formattedDynamicPatients.find(dp => dp.id === hp.id);
                    return dynamicMatch ? { ...dynamicMatch, ...hp } : hp; // Prioritize hardcoded for specific fields
                }).concat(formattedDynamicPatients.filter(dp => !hardcodedPatientsData.some(hp => hp.id === dp.id)));

                setPatients(mergedPatients);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromUrl = queryParams.get('patientId');
        if (idFromUrl) {
            setSelectedPatientId(idFromUrl);
        }
    }, [location.search]);

    const filteredPatients = useMemo(() => {
        return patients
            .filter(p => {
                if (activeFilter === 'All') return true;
                return p.status === activeFilter;
            })
            .filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    }, [searchTerm, patients, activeFilter]);

    const selectedPatient = useMemo(() => {
        return patients.find(p => p.id === selectedPatientId);
    }, [selectedPatientId, patients]);

    const handleAddPatient = (newPatientData) => {
        // For now, only add to frontend state
        const newPatient = {
            id: `PID-${Math.floor(100000 + Math.random() * 900000)}`,
            name: newPatientData.name,
            pfp: `https://avatar.iran.liara.run/public/${newPatientData.gender === 'Male' ? 'boy' : 'girl'}?username=${newPatientData.name.split(' ')[0]}`,
            age: new Date().getFullYear() - new Date(newPatientData.dob).getFullYear(),
            gender: newPatientData.gender,
            lastVisit: new Date().toISOString().split('T')[0],
            status: newPatientData.status,
            contact: { phone: newPatientData.phone, email: newPatientData.email },
            criticalInfo: { 
                allergies: newPatientData.allergies ? newPatientData.allergies.split(',').map(a => a.trim()) : ['None'], 
                chronicConditions: newPatientData.chronicConditions ? newPatientData.chronicConditions.split(',').map(c => c.trim()) : ['None'],
            },
            recentVitals: { 
                bloodPressure: newPatientData.bloodPressure || 'N/A',
                bloodSugar: newPatientData.bloodSugar || 'N/A',
            },
            recentActivity: [
                { date: new Date().toISOString().split('T')[0], title: 'Patient Registered' }
            ]
        };
        setPatients(prevPatients => [newPatient, ...prevPatients]);
        setIsModalOpen(false);
    };

    if (loading) return <p className="text-center text-foreground mt-8">Loading patients...</p>;
    if (error) return <p className="text-center text-red-500 mt-8">Error: {error}</p>;

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Patients</h1>
                    <p className="text-muted-foreground mt-1">Search, view, and manage your patient records.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                >
                    <UserPlus size={18}/> Add New Patient
                </button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search by patient name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {filterOptions.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`relative px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                activeFilter !== filter && 'text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            {activeFilter === filter && (
                                <motion.div layoutId="patient-filter-indicator" className="absolute inset-0 bg-hs-gradient-start/10 rounded-full" />
                            )}
                            {/* === GRADIENT KO DIRECT TEXT WALE SPAN PAR LAGAYA HAI === */}
                            <span className={`relative z-10 ${
                                activeFilter === filter ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text' : ''
                            }`}>
                                {filter}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Patient List */}
            <div className="flex-1 overflow-hidden">
                <PatientListTable patients={filteredPatients} onPatientSelect={setSelectedPatientId} />
            </div>
            
            <AnimatePresence>
                {selectedPatient && (
                    <PatientDetailDrawer patient={selectedPatient} onClose={() => setSelectedPatientId(null)} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && (
                    <AddPatientModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onAddPatient={handleAddPatient} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyPatientsPage;