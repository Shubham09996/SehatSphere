import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ onConfirm, onClose, action, count }) => {
    const isDelete = action === 'delete';
    return (
         <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-card w-full max-w-md rounded-xl border" onClick={e=>e.stopPropagation()}>
                <div className="p-6 text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${isDelete ? 'bg-red-100' : 'bg-orange-100'}`}><AlertTriangle size={24} className={isDelete ? 'text-red-600' : 'text-orange-600'}/></div>
                    <h3 className="text-lg font-bold mt-4">Are you sure?</h3>
                    <p className="text-sm text-muted-foreground mt-2">You are about to {action} <strong>{count}</strong> user(s). This action cannot be undone.</p>
                </div>
                <div className="p-4 flex gap-3 border-t bg-muted/50 rounded-b-xl">
                    <button onClick={onClose} className="flex-1 font-semibold py-2 px-4 rounded-lg border">Cancel</button>
                    <button onClick={onConfirm} className={`flex-1 font-bold py-2 px-4 rounded-lg text-white ${isDelete ? 'bg-red-600' : 'bg-orange-500'}`}>{action.charAt(0).toUpperCase() + action.slice(1)}</button>
                </div>
            </motion.div>
        </motion.div>
    );
};
export default ConfirmationModal;