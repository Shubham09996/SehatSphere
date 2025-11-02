import React, { useState, useMemo, useEffect } from 'react'; // useEffect import kiya
// import { prescriptionsData } from '../../data/prescriptionsData.js';
import PrescriptionListItem from '../../components/patient/PrescriptionListItem.jsx';
import PrescriptionDetailView from '../../components/patient/PrescriptionDetailView.jsx';
import { Search, ListFilter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api'; // Import api for fetching data

const PrescriptionsPage = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All'); // All, Active, Expired
    const [prescriptions, setPrescriptions] = useState([]); // State for dynamic prescriptions
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/prescriptions/patient');
                setPrescriptions(response.data);
                if (window.matchMedia('(min-width: 768px)').matches && response.data.length > 0) {
                    setSelectedId(response.data[0]._id); // Select first prescription for desktop
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    const filteredPrescriptions = useMemo(() => {
        return prescriptions
            .filter(p => {
                const now = new Date();
                const expiry = new Date(p.expiryDate);
                if (filter === 'Active') return expiry >= now;
                if (filter === 'Expired') return expiry < now;
                return true;
            })
            .filter(p => {
                const doctorName = p.doctor?.user?.name || '';
                const medicineNames = p.medicines.map(med => med.medicine?.brandName || med.medicine?.genericName || '').join(' ');
                return doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       medicineNames.toLowerCase().includes(searchTerm.toLowerCase());
            });
    }, [searchTerm, filter, prescriptions]);
    
    const selectedPrescription = useMemo(() => {
        return prescriptions.find(p => p._id === selectedId);
    }, [selectedId, prescriptions]);

    if (loading) {
        return <div className="text-center py-12 text-foreground">Loading prescriptions...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">Error loading prescriptions: {error.message}</div>;
    }

    return (
        <div className="flex flex-col xl:grid xl:grid-cols-3 xl:gap-8 gap-6 flex-grow min-h-0 xl:h-[calc(100vh-100px)]">
            {/* Left Column: List & Filters */}
            <div className="flex flex-col xl:col-span-1">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Prescriptions</h1>
                    <p className="text-muted-foreground mt-1">View and manage all your e-prescriptions.</p>
                </div>
                
                {/* Search & Filter Controls */}
                <div className="flex gap-2 my-4">
                    <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                         <input
                            type="text"
                            placeholder="Search by doctor or medicine..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm"
                        />
                    </div>
                    {/* Simple filter buttons */}
                    <div className="flex border border-border rounded-lg p-1 bg-muted">
                        {['All', 'Active', 'Expired'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} 
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Prescriptions List */}
                <div className="flex-1 pr-2 space-y-3">
                    <AnimatePresence>
                         {filteredPrescriptions.length > 0 ? (
                            filteredPrescriptions.map(p => (
                                <motion.div
                                    key={p._id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    <PrescriptionListItem 
                                        prescription={p}
                                        onSelect={setSelectedId}
                                        isActive={selectedId === p._id}
                                    />
                                </motion.div>
                            ))
                         ) : (
                             <div className="text-center py-12 text-muted-foreground">
                                 <p>No prescriptions found.</p>
                             </div>
                         )}
                    </AnimatePresence>
                </div>
            </div>

            {selectedPrescription && (
                <motion.div 
                    key={selectedPrescription._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="hidden md:hidden xl:block xl:col-span-2"
                >
                    <PrescriptionDetailView prescription={selectedPrescription} />
                </motion.div>
            )}

            {/* Tablet Stack-wise Detail View (newly added) */}
            {selectedPrescription && (
                <motion.div
                    key={selectedPrescription._id + '-tablet'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="hidden md:block xl:hidden"
                >
                    <PrescriptionDetailView prescription={selectedPrescription} />
                </motion.div>
            )}

            {/* Mobile Modal (re-introduced) */}
            {selectedPrescription && (
                <div className="md:hidden fixed inset-0 bg-background z-50 p-4 overflow-y-auto">
                    <button onClick={() => setSelectedId(null)} className="font-bold mb-4 px-4">← Back to list</button>
                    <div className="max-w-md mx-auto">
                        <PrescriptionDetailView prescription={selectedPrescription} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionsPage;