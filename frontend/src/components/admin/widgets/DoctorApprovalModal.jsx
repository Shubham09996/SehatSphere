import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Shield } from 'lucide-react';

const DetailRow = ({ label, value }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
    </div>
);

const DoctorApprovalModal = ({ user, onClose, onAction }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 flex justify-between items-center border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Verification Details</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
                <DetailRow label="Name" value={user.name} />
                <DetailRow label="Role to be Approved" value={user.role} />
                <div className="border-t border-border my-2"></div>
                {user.role === 'Doctor' && (
                    <>
                        <DetailRow label="Specialty" value={user.details.specialty} />
                        <DetailRow label="Qualifications" value={user.details.qualifications} />
                        <DetailRow label="Medical Registration No." value={user.details.registrationNumber} />
                        <DetailRow label="Contact Email" value={user.details.email} />
                    </>
                )}
                 {user.role === 'Pharmacy' && (
                    <>
                        <DetailRow label="Address" value={user.details.address} />
                        <DetailRow label="License Number" value={user.details.licenseNumber} />
                        <DetailRow label="Contact Email" value={user.details.contact} />
                    </>
                )}
            </div>
            <div className="p-4 flex gap-3 border-t border-border bg-muted/50 rounded-b-xl">
                 <button onClick={() => onAction(user.id)} className="flex-1 font-bold py-2 px-4 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30">Reject</button>
                 <button onClick={() => onAction(user.id)} className="flex-1 font-bold py-2 px-4 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30">Approve</button>
            </div>
        </motion.div>
    </motion.div>
);
export default DoctorApprovalModal;