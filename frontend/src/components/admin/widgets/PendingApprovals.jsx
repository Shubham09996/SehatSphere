import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { adminData } from '../../../data/adminData'; // Remove this import
import { Check, X, Eye } from 'lucide-react';
import ApprovalModal from './ApprovalModal'; // NEW: Import the modal
import api from '../../../utils/api'; // api.js se import karein

const PendingApprovals = ({ pendingApprovals: initialApprovals }) => {
    const [registrations, setRegistrations] = useState(initialApprovals);
    const [viewingUser, setViewingUser] = useState(null);

    // This function handles both approve and reject actions
    const handleAction = async (id, actionType) => {
        try {
            await api.put(`/admin/approvals/${id}/${actionType}`);
            setRegistrations(prev => prev.filter(reg => reg._id !== id)); // Use _id from backend
            setViewingUser(null); // Close the modal after an action is taken
        } catch (error) {
            console.error(`Error ${actionType}ing user:`, error);
            // Handle error (e.g., show a toast notification)
        }
    };

    return (
        <>
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <h3 className="font-bold text-lg text-foreground mb-4">Pending Registrations ({registrations.length})</h3>
                <div className="space-y-3">
                    {registrations.map(reg => (
                        <motion.div 
                            key={reg._id} // Use _id from backend
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-muted p-3 rounded-lg"
                        >
                            <div>
                                <p className="font-semibold text-foreground">{reg.name}</p>
                                <p className="text-xs text-muted-foreground">{reg.role} • {new Date(reg.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
                                {/* NEW: "View Info" button to open the modal */}
                                <button onClick={() => setViewingUser(reg)} className="flex items-center gap-1.5 text-sm font-semibold py-2 px-3 rounded-md border border-border hover:bg-border">
                                    <Eye size={14}/> View Info
                                </button>
                                <button onClick={() => handleAction(reg._id, 'approve')} className="p-2 rounded-md bg-green-500/10 text-green-500 hover:bg-green-500/20"><Check size={16}/></button>
                                <button onClick={() => handleAction(reg._id, 'reject')} className="p-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20"><X size={16}/></button>
                            </div>
                        </motion.div>
                    ))}
                    {registrations.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No pending approvals.</p>}
                </div>
            </div>
            
            {/* Modal for viewing details */}
            <AnimatePresence>
                {viewingUser && <ApprovalModal user={viewingUser} onClose={() => setViewingUser(null)} onAction={handleAction} />}
            </AnimatePresence>
        </>
    );
};

export default PendingApprovals;