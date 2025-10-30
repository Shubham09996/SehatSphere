import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const AddPatientModal = ({ isOpen, onClose, onAddPatient }) => {
    // State to hold the form data for the new patient.
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: 'Male',
        bloodGroup: 'O+',
        address: '',
        status: 'New', // Default status is 'New'.
    });

    // Generic change handler for all form inputs.
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handles form submission.
    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation.
        if (!formData.name || !formData.dob || !formData.phone) {
            alert('Please fill in Name, Date of Birth, and Phone Number.');
            return;
        }
        // Calls the onAddPatient function from the parent component.
        onAddPatient(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                // Fix for scrolling: Added flex layout and max-height to the modal container.
                className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-lg flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="p-4 flex justify-between items-center border-b border-border flex-shrink-0">
                    <h2 className="text-lg font-bold text-foreground">Add New Patient</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                </div>
                
                {/* Form Body - Fix for scrolling: This form area is now scrollable. */}
                <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Full Name*</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Date of Birth*</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                         <div>
                            <label className="text-sm font-medium">Phone Number*</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                         <div>
                            <label className="text-sm font-medium">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                         <div>
                            <label className="text-sm font-medium">Blood Group</label>
                             <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2">
                                <option>O+</option><option>O-</option>
                                <option>A+</option><option>A-</option>
                                <option>B+</option><option>B-</option>
                                <option>AB+</option><option>AB-</option>
                            </select>
                        </div>
                        {/* New field for Patient Status */}
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium">Patient Status</label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="status" value="New" checked={formData.status === 'New'} onChange={handleChange} className="form-radio text-primary focus:ring-primary"/>
                                    New Patient
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="radio" name="status" value="Needs Follow-up" checked={formData.status === 'Needs Follow-up'} onChange={handleChange} className="form-radio text-primary focus:ring-primary"/>
                                    Follow-up
                                </label>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium">Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="mt-1 w-full bg-background border border-border rounded-md p-2"></textarea>
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="p-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-border bg-muted/50 rounded-b-xl flex-shrink-0">
                    <button type="submit" onClick={handleSubmit} className="flex-1 sm:flex-none font-bold py-2 px-5 rounded-lg bg-primary text-primary-foreground">
                        Save Patient
                    </button>
                    <button type="button" onClick={onClose} className="flex-1 sm:flex-none font-semibold py-2 px-5 rounded-lg border border-border hover:bg-border">
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddPatientModal;