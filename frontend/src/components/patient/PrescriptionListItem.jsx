import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion'; // Animation ke liye zaroori import

const PrescriptionListItem = ({ prescription, onSelect, isActive }) => {
    // Check if the prescription is expired
    const isExpired = new Date(prescription.expiryDate) < new Date();

    return (
        <motion.div
            onClick={() => onSelect(prescription.id)} // Parent ko selected prescription ki ID bhejta hai
            className={`p-4 border-l-4 rounded-r-lg cursor-pointer transition-colors ${
                isActive 
                    ? 'bg-primary/10 border-primary' 
                    : `bg-card border-border hover:bg-muted`
            }`}
            whileHover={{ scale: 1.02 }}
            layout // Filtering ke time smooth animation ke liye
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 overflow-hidden">
                    
                    {/* === IS ICON MEIN GRADIENT LAGAYA HAI === */}
                    <div className="p-3 rounded-full flex-shrink-0 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white">
                        <FileText size={20} />
                    </div>
                    
                    <div className="truncate">
                        <p className="font-bold text-foreground truncate">{prescription.doctor.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                            {prescription.doctor.specialty} • {new Date(prescription.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Status badge (Active/Expired) */}
                    {!isExpired ? (
                         <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Active</span>
                    ) : (
                         <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Expired</span>
                    )}
                    <ChevronRight size={20} className="text-muted-foreground" />
                </div>
            </div>
        </motion.div>
    );
};

export default PrescriptionListItem;