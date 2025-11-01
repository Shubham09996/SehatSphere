import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Removed: import { hospitalsData as initialHospitals } from '../../data/hospitalsData';
import { Plus, Search, Building, Edit, Trash2 } from 'lucide-react';
import HospitalCard from '../../components/admin/hospitals/HospitalCard';
// Removed: import AddHospitalModal from '../../components/admin/hospitals/AddHospitalModal';
import api from '../../utils/api'; // Import the API utility
import { toast } from 'react-toastify';

// New: Edit Hospital Modal Component
const EditHospitalModal = ({ hospital, onClose, onSave }) => {
    const [name, setName] = useState(hospital.name);
    const [location, setLocation] = useState(hospital.location);
    const [address, setAddress] = useState(hospital.address);
    const [image, setImage] = useState(hospital.image);
    const [contactEmail, setContactEmail] = useState(hospital.contactEmail);
    const [contactPhone, setContactPhone] = useState(hospital.contactPhone);
    const [departments, setDepartments] = useState(hospital.departments.join(', '));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const departmentArray = departments.split(',').map(d => d.trim()).filter(d => d !== '');
            const updatedHospital = {
                name, location, address, image, contactEmail, contactPhone, departments: departmentArray
            };
            const response = await api.put(`/api/hospitals/${hospital._id}`, updatedHospital);
            toast.success('Hospital updated successfully!');
            onSave(response.data); // Pass updated data back to parent
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
        >
            <motion.div
                initial={{ y: "-100vh", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                exit={{ y: "100vh", opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative"
            >
                <h2 className="text-2xl font-bold text-foreground mb-4">Edit Hospital</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Location</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-muted-foreground">Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Image URL</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Contact Email</label>
                        <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Contact Phone</label>
                        <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Departments (comma-separated)</label>
                        <input type="text" value={departments} onChange={(e) => setDepartments(e.target.value)} className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground" required />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-input text-foreground hover:bg-muted">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50" disabled={loading}> 
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const DeleteConfirmationModal = ({ hospital, onClose, onDelete }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/api/hospitals/${hospital._id}`);
            toast.success('Hospital deleted successfully!');
            onDelete(hospital._id);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
        >
            <motion.div
                initial={{ y: "-100vh", opacity: 0 }}
                animate={{ y: "0", opacity: 1 }}
                exit={{ y: "100vh", opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="bg-card rounded-lg p-6 w-full max-w-md shadow-xl relative text-center"
            >
                <h2 className="text-2xl font-bold text-foreground mb-4">Confirm Deletion</h2>
                <p className="text-muted-foreground mb-6">Are you sure you want to delete <span className="font-semibold">{hospital.name}</span>? This action cannot be undone.</p>
                {error && <p className="text-red-500 text-sm mb-4">Error: {error}</p>}
                <div className="flex justify-center gap-3 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-input text-foreground hover:bg-muted">Cancel</button>
                    <button type="button" onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50" disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const HospitalManagementPage = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingHospital, setEditingHospital] = useState(null);
    const [deletingHospital, setDeletingHospital] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All'); // NEW: State for status filter

    const fetchHospitals = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/hospitals');
            setHospitals(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (hospitalId, newStatus) => {
        try {
            setLoading(true);
            const response = await api.put(`/api/hospitals/${hospitalId}/status`, { status: newStatus });
            toast.success(`Hospital status updated to ${newStatus}`);
            setHospitals(prev => prev.map(h => (h._id === hospitalId ? response.data.hospital : h)));
        } catch (err) {
            console.error('Failed to update hospital status:', err);
            toast.error(err.response?.data?.message || 'Failed to update hospital status.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const filteredHospitals = useMemo(() => {
        return hospitals.filter(h =>
            (filterStatus === 'All' || h.status === filterStatus) &&
            (h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [hospitals, searchTerm, filterStatus]);

    const handleUpdateHospital = (updatedHospital) => {
        setHospitals(prev => prev.map(h => (h._id === updatedHospital._id ? updatedHospital : h)));
    };

    const handleDeleteHospital = (id) => {
        setHospitals(prev => prev.filter(h => h._id !== id));
    };

    if (loading) {
        return <div className="text-center text-foreground p-8">Loading hospitals...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error loading hospitals: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Hospital Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Oversee and manage all partner hospitals.</p>
                </div>
                {/* Removed Add Hospital Button as it's now a separate route */}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
                {['All', 'Pending', 'Active', 'Suspended', 'Rejected'].map(status => (
                    <motion.button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors
                            ${filterStatus === status
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-card text-muted-foreground border-border hover:bg-muted'
                            }`}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                        {status}
                    </motion.button>
                ))}
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="text" placeholder="Search by name or location..." onChange={e => setSearchTerm(e.target.value)} className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm"/>
            </div>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                animate="visible"
            >
                {filteredHospitals.length > 0 ? (
                    filteredHospitals.map(hospital => (
                        <HospitalCard 
                            key={hospital._id} 
                            hospital={hospital} 
                            onEdit={() => setEditingHospital(hospital)} 
                            onDelete={() => setDeletingHospital(hospital)} 
                            onUpdateStatus={handleUpdateStatus} // NEW: Pass status update handler
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-muted-foreground">No hospitals found. Add a new hospital to get started.</p>
                )}
            </motion.div>
            
            <AnimatePresence>
                {editingHospital && (
                    <EditHospitalModal 
                        hospital={editingHospital} 
                        onClose={() => setEditingHospital(null)} 
                        onSave={handleUpdateHospital} 
                    />
                )}
                {deletingHospital && (
                    <DeleteConfirmationModal
                        hospital={deletingHospital}
                        onClose={() => setDeletingHospital(null)}
                        onDelete={handleDeleteHospital}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
export default HospitalManagementPage;