import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Shield, User, GraduationCap, Building } from 'lucide-react';

const DetailRow = ({ label, value }) => (
    <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-foreground mt-1">{value}</p>
    </div>
);

const ApprovalModal = ({ user, onClose, onAction }) => (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" 
        onClick={onClose}
    >
        <motion.div 
            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} 
            className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl flex flex-col" 
            onClick={e => e.stopPropagation()}
        >
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Verification Details</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary"><User size={24}/></div>
                    <div>
                        <DetailRow label="Name" value={user.name} />
                    </div>
                </div>
                <DetailRow label="Role to be Approved" value={user.role} />
                
                <div className="border-t border-border my-2"></div>
                
                {/* Conditional details based on role */}
                {user.role === 'Doctor' && (
                    <div className="space-y-4">
                        <DetailRow label="Specialty" value={user.details.specialty} />
                        <DetailRow label="Qualifications" value={user.details.qualifications} />
                        <DetailRow label="Medical Registration No." value={user.details.registrationNumber} />
                        <DetailRow label="Contact Email" value={user.details.email} />
                    </div>
                )}
                 {user.role === 'Pharmacy' && (
                    <div className="space-y-4">
                        <DetailRow label="Address" value={user.details.address} />
                        <DetailRow label="License Number" value={user.details.licenseNumber} />
                        <DetailRow label="Contact Email" value={user.details.contact} />
                    </div>
                )}
            </div>

            {/* Footer with Actions */}
            <div className="p-4 flex gap-3 border-t border-border bg-muted/50 rounded-b-2xl">
                 <button onClick={() => onAction(user.id)} className="flex-1 font-bold py-2.5 px-4 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                    Reject
                 </button>
                 <button onClick={() => onAction(user.id)} className="flex-1 font-bold py-2.5 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white hover:opacity-90 transition-opacity">
                    Approve
                 </button>
            </div>
        </motion.div>
    </motion.div>
);

export default ApprovalModal;