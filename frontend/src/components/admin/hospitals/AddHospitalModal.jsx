import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Building } from 'lucide-react';

const AddHospitalModal = ({ onClose, onAddHospital }) => {
    const [formData, setFormData] = useState({ name: '', location: '', image: '' });
    const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = e => { e.preventDefault(); onAddHospital(formData); };

    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-card w-full max-w-lg rounded-xl border border-border" onClick={e=>e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-bold flex items-center gap-2"><Building size={20} className="text-primary"/> Add New Hospital</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-muted"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div><label className="text-sm font-medium">Hospital Name*</label><input type="text" name="name" onChange={handleChange} required className="mt-1 w-full bg-background border p-2 rounded-md"/></div>
                    <div><label className="text-sm font-medium">Location / Address*</label><input type="text" name="location" onChange={handleChange} required className="mt-1 w-full bg-background border p-2 rounded-md"/></div>
                    <div><label className="text-sm font-medium">Image URL</label><input type="url" name="image" onChange={handleChange} placeholder="https://images.unsplash.com/..." className="mt-1 w-full bg-background border p-2 rounded-md"/></div>
                </form>
                <div className="p-4 flex justify-end gap-3 border-t bg-muted/50 rounded-b-xl">
                    <button onClick={onClose} className="font-semibold py-2 px-4 rounded-lg border">Cancel</button>
                    <button onClick={handleSubmit} className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white">Add Hospital</button>
                </div>
            </motion.div>
        </motion.div>
    );
};
export default AddHospitalModal;