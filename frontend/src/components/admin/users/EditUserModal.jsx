import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import api from '../../../utils/api'; // Import API utility
import { toast } from 'react-toastify';

const userRoles = ['Patient', 'Doctor', 'Shop', 'Admin']; // Define possible roles
const userStatuses = ['Active', 'Suspended', 'Deactivated']; // Define possible statuses

const EditUserModal = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCheckboxChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.put(`/api/users/${user._id}`, formData);
            toast.success('User updated successfully!');
            onSave(response.data); // Pass updated user data back
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-card w-full max-w-lg rounded-xl border" onClick={e=>e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b"><h2 className="text-lg font-bold">Edit User: {user.name}</h2><button onClick={onClose} className="p-1 rounded-full hover:bg-muted"><X size={20}/></button></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium text-muted-foreground">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full bg-background border border-border p-2 rounded-md" required/></div>
                    <div><label className="block text-sm font-medium text-muted-foreground">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full bg-background border border-border p-2 rounded-md" required/></div>
                    <div><label className="block text-sm font-medium text-muted-foreground">Phone Number</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 w-full bg-background border border-border p-2 rounded-md"/></div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground">
                            {userRoles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground">
                            {userStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleCheckboxChange} className="form-checkbox rounded text-primary"/>
                        <label htmlFor="isVerified" className="text-sm font-medium text-muted-foreground">Is Verified</label>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}

                    <div className="p-4 flex justify-end gap-3 border-t bg-muted/50 rounded-b-xl -mx-6 -mb-6 mt-6">
                        <button type="button" onClick={onClose} className="font-semibold py-2 px-4 rounded-lg border border-input hover:bg-border">Cancel</button>
                        <button type="submit" className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}> 
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};
export default EditUserModal;