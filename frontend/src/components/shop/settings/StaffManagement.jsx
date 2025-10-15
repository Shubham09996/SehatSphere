import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
// import { shopSettingsData } from '../../../data/shopSettingsData'; // Remove this import
import AddStaffModal from './AddStaffModal'; // NEW: Import the modal
import api from '../../../utils/api'; // api.js se import karein

const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingStaff, setEditingStaff] = useState(null); // State to hold staff member being edited
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const menuRef = useRef(null);

    const shopId = '60d0fe4f5311236168a109cc'; // Temporarily using a dummy shopId. This should come from auth context.

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/shops/${shopId}/staff`);
            setStaff(response.data.staff);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [shopId]);

    const handleAddStaff = async (newStaffData) => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const response = await api.post(`/shops/${shopId}/staff`, newStaffData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            setStaff(prevStaff => [...prevStaff, response.data.staff]);
            setIsModalOpen(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Error adding staff:', err);
            setError(err); // Handle error appropriately
        }
    };

    const handleUpdateStaff = async (updatedStaffData) => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const response = await api.put(`/shops/${shopId}/staff/${updatedStaffData.get('_id')}`, updatedStaffData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            setStaff(prevStaff => prevStaff.map(s => s._id === response.data.staff._id ? response.data.staff : s));
            setEditingStaff(null);
            setIsModalOpen(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Error updating staff:', err);
            setError(err);
        }
    };

    const handleRemoveStaff = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this staff member?')) return;
        setSaving(true);
        setSaveSuccess(false);
        try {
            await api.delete(`/shops/${shopId}/staff/${userId}`);
            setStaff(prevStaff => prevStaff.filter(s => s._id !== userId));
            setOpenMenuId(null);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Error removing staff:', err);
            setError(err);
        }
    };

    const openEditModal = (member) => {
        setEditingStaff(member);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    // Logic to close the dropdown menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return <div className="text-center text-foreground p-6">Loading staff...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-6">Error loading staff: {error.message}</div>;
    }

    return (
        <>
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <h3 className="font-bold text-lg text-foreground">Staff Management</h3>
                    <div className="flex items-center gap-3">
                        {saveSuccess && <span className="text-sm text-green-500">Action successful!</span>}
                        <button 
                            onClick={() => { setIsModalOpen(true); setEditingStaff(null); }} // Clear editing state when adding new
                            className="flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white text-sm"
                        >
                            <Plus size={16}/> Add Staff Member
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    {staff.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No staff members found.</p>
                    ) : (
                        staff.map(member => (
                            <div key={member._id} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img src={member.pfp || "https://via.placeholder.com/40"} alt={member.name} className="w-10 h-10 rounded-full"/>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{member.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                    </div>
                                </div>
                                <div className="relative" ref={menuRef}>
                                    <button onClick={() => setOpenMenuId(openMenuId === member._id ? null : member._id)} className="p-1 hover:bg-border rounded-full text-muted-foreground">
                                        <MoreHorizontal size={18}/>
                                    </button>
                                    <AnimatePresence>
                                    {openMenuId === member._id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-md shadow-lg z-20"
                                        >
                                            <div className="p-1">
                                                <button onClick={() => openEditModal(member)} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"><Edit size={14}/> Edit</button>
                                                <button onClick={() => handleRemoveStaff(member._id)} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded text-red-500 hover:bg-muted"><Trash2 size={14}/> Remove</button>
                                            </div>
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <AnimatePresence>
                {isModalOpen && (
                    <AddStaffModal 
                        isOpen={isModalOpen}
                        onClose={() => { setIsModalOpen(false); setEditingStaff(null); }}
                        onAddStaff={handleAddStaff}
                        onUpdateStaff={handleUpdateStaff}
                        editingStaff={editingStaff}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
export default StaffManagement;