import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, MessageSquare } from 'lucide-react';

const InvoiceDetailModal = ({ invoice, onClose }) => {
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
                className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-lg flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="p-4 flex justify-between items-center border-b border-border">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Invoice #{invoice.id}</h2>
                        <p className="text-sm text-muted-foreground">Issued on {new Date(invoice.issueDate).toDateString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                </div>
                
                {/* Modal Body */}
                <div className="p-6 flex-1 overflow-y-auto">
                     <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div>
                            <p className="text-muted-foreground">BILLED TO</p>
                            <p className="font-semibold text-foreground">{invoice.patient}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-muted-foreground">FROM</p>
                            <p className="font-semibold text-foreground">{invoice.hospital}</p>
                        </div>
                    </div>
                    
                    <table className="w-full text-left">
                        <thead className="text-xs text-muted-foreground bg-muted">
                            <tr><th className="p-2">Description</th><th className="p-2 text-right">Cost</th></tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index} className="border-b border-border"><td className="p-2">{item.description}</td><td className="p-2 text-right">₹{item.cost.toFixed(2)}</td></tr>
                            ))}
                        </tbody>
                        <tfoot className="font-bold">
                             <tr><td className="p-2 text-right">Subtotal</td><td className="p-2 text-right">₹{invoice.amount.toFixed(2)}</td></tr>
                             <tr><td className="p-2 text-right">Tax (0%)</td><td className="p-2 text-right">₹0.00</td></tr>
                             <tr><td className="p-2 text-right text-lg text-primary">Total</td><td className="p-2 text-right text-lg text-primary">₹{invoice.amount.toFixed(2)}</td></tr>
                        </tfoot>
                    </table>
                </div>

                {/* Modal Footer */}
                <div className="p-4 flex flex-col sm:flex-row gap-3 border-t border-border bg-muted/50 rounded-b-xl">
                    <button className="flex-1 flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg border border-border text-foreground hover:bg-muted">
                        <MessageSquare size={16}/> Raise a Query
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                        <Download size={16}/> Download PDF
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default InvoiceDetailModal;