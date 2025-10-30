import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Package, Trash2 } from 'lucide-react';

const AddMedicineModal = ({ isOpen, onClose, onAddMedicine }) => {
    const [formData, setFormData] = useState({
        name: '', category: 'Fever', price: '',
        stockQuantity: '', lowStockThreshold: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const imageInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.stockQuantity) {
            alert('Please fill all required fields.');
            return;
        }
        onAddMedicine({ ...formData, image: imagePreview });
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }}
                className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-lg flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center border-b border-border flex-shrink-0">
                    <h2 className="text-lg font-bold text-foreground">Add New Medicine</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
                    {/* --- NEW: Redesigned Image Upload Section --- */}
                    <div>
                         <label className="text-sm font-medium">Product Image</label>
                         <div className="mt-2 flex items-center gap-4">
                            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg"/>
                                ) : (
                                    <Package size={32} className="text-muted-foreground"/>
                                )}
                            </div>
                            <div className="space-y-2">
                                <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageChange}/>
                                <button type="button" onClick={() => imageInputRef.current.click()} className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg border border-border hover:bg-muted">
                                    <Upload size={14}/> {imagePreview ? 'Change Image' : 'Upload Image'}
                                </button>
                                {imagePreview && (
                                     <button type="button" onClick={() => setImagePreview(null)} className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-500/10 py-2 px-3 rounded-lg">
                                        <Trash2 size={14}/> Remove
                                    </button>
                                )}
                            </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium">Medicine Name*</label>
                            <input type="text" name="name" onChange={handleChange} required className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Category</label>
                            <select name="category" onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2">
                                <option>Fever</option><option>Painkiller</option><option>Antibiotic</option>
                                <option>Cardiac</option><option>Vitamins</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Price (per unit)*</label>
                            <input type="number" name="price" step="0.01" onChange={handleChange} required className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Stock Quantity*</label>
                            <input type="number" name="stockQuantity" onChange={handleChange} required className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Low Stock Threshold</label>
                            <input type="number" name="lowStockThreshold" onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                    </div>
                </form>

                <div className="p-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-border bg-muted/50 rounded-b-xl flex-shrink-0">
                    <button type="submit" onClick={handleSubmit} className="flex-1 sm:flex-none font-bold py-2 px-5 rounded-lg bg-primary text-primary-foreground">
                        Add to Inventory
                    </button>
                    <button type="button" onClick={onClose} className="flex-1 sm:flex-none font-semibold py-2 px-5 rounded-lg border border-border hover:bg-border">
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddMedicineModal;