import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, User } from 'lucide-react';

const AddStaffModal = ({ isOpen, onClose, onAddStaff, onUpdateStaff, editingStaff }) => {
    const [formData, setFormData] = useState({ name: '', role: 'Pharmacist', email: '', phone: '', pfp: '' });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const avatarInputRef = useRef(null);

    useEffect(() => {
        if (editingStaff) {
            setFormData({ 
                name: editingStaff.name || '',
                role: editingStaff.role || 'Pharmacist',
                email: editingStaff.email || '',
                phone: editingStaff.phone || '',
                pfp: editingStaff.pfp || '',
            });
            setAvatarPreview(editingStaff.pfp || null);
        } else {
            setFormData({ name: '', role: 'Pharmacist', email: '', phone: '', pfp: '' });
            setAvatarPreview(null);
            setAvatarFile(null);
        }
    }, [editingStaff, isOpen]); // Reset form when modal opens or editingStaff changes

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatarFile(null);
            setAvatarPreview(editingStaff?.pfp || null); // Revert to existing pfp if no new file selected
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.role) return;

        const staffData = new FormData();
        staffData.append('name', formData.name);
        staffData.append('role', formData.role);
        staffData.append('email', formData.email);
        staffData.append('phone', formData.phone);
        if (avatarFile) {
            staffData.append('profilePicture', avatarFile);
        } else if (formData.pfp) {
            staffData.append('pfp', formData.pfp); // Keep existing pfp if no new file is uploaded
        }

        if (editingStaff) {
            onUpdateStaff(editingStaff._id, staffData); // Pass staffData for update
        } else {
            onAddStaff(staffData); // Pass staffData for add
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group w-24 h-24">
                            <img src={avatarPreview || 'https://via.placeholder.com/96'} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-border"/>
                            <button type="button" onClick={() => avatarInputRef.current.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload size={24} className="text-white"/>
                            </button>
                            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="text-sm font-medium">Full Name*</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div>
                            <label htmlFor="role" className="text-sm font-medium">Role*</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2">
                                <option value="Pharmacist">Pharmacist</option>
                                <option value="Cashier">Cashier</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div>
                            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                    </div>
                </form>

                <div className="p-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-border bg-muted/50 rounded-b-xl">
                    <button type="submit" onClick={handleSubmit} className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white">
                        {editingStaff ? 'Save Changes' : 'Add Staff Member'}
                    </button>
                    <button type="button" onClick={onClose} className="font-semibold py-2 px-5 rounded-lg border border-border hover:bg-border">
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddStaffModal;