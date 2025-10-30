import React from 'react';
import { Download, Share2, ShoppingCart, User, Stethoscope, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const PrescriptionDetailView = ({ prescription }) => {
    if (!prescription) {
        return (
            <div className="hidden lg:flex flex-col items-center justify-center h-full bg-muted rounded-xl border-2 border-dashed border-border">
                <FileText size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Select a Prescription</h3>
                <p className="text-sm text-muted-foreground">Choose a prescription from the list to see its details.</p>
            </div>
        );
    }
    
    const isExpired = new Date(prescription.expiryDate) < new Date();

    return (
        <motion.div 
            key={prescription.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card p-4 sm:p-6 rounded-xl border border-border flex flex-col"
        >
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-border">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Prescription Details</h2>
                    <p className="text-sm text-muted-foreground">ID: {prescription.id}</p>
                </div>
                {!isExpired ? (
                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Active</span>
                ) : (
                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Expired</span>
                )}
            </div>

            {/* Doctor & Patient Info */}
            <div className="grid grid-cols-2 gap-6 my-6 text-sm">
                <div className="flex items-start gap-3">
                    <Stethoscope className="text-primary mt-1 flex-shrink-0"/>
                    <div>
                        <p className="text-muted-foreground">Prescribed by</p>
                        <p className="font-bold text-foreground">{prescription.doctor.name}</p>
                        <p className="text-muted-foreground">{prescription.doctor.specialty}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <User className="text-primary mt-1 flex-shrink-0"/>
                    <div>
                        <p className="text-muted-foreground">For Patient</p>
                        <p className="font-bold text-foreground">{prescription.patient.name}, {prescription.patient.age}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 col-span-2">
                    <Calendar className="text-primary mt-1 flex-shrink-0"/>
                     <div>
                        <p className="text-muted-foreground">Date of Issue</p>
                        <p className="font-bold text-foreground">{new Date(prescription.issueDate).toDateString()}</p>
                    </div>
                </div>
            </div>
            
            {/* Medicines Table */}
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted">
                        <tr>
                            <th className="p-3">Medicine</th>
                            <th className="p-3">Dosage</th>
                            <th className="p-3">Frequency</th>
                            <th className="p-3">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescription.medicines.map((med, index) => (
                             <tr key={index} className="border-b border-border">
                                 <td className="p-3 font-semibold text-foreground">{med.name}</td>
                                 <td className="p-3 text-muted-foreground">{med.dosage}</td>
                                 <td className="p-3 text-muted-foreground">{med.frequency}</td>
                                 <td className="p-3 text-muted-foreground">{med.duration}</td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {/* Doctor's Notes */}
             <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Doctor's Notes</h4>
                <p className="text-sm text-muted-foreground">{prescription.notes}</p>
             </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                 {/* === IS BUTTON MEIN GRADIENT LAGAYA HAI === */}
                 <button className="flex-1 flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90">
                    <ShoppingCart size={18}/> Order Medicines
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg border border-border text-foreground hover:bg-muted">
                    <Download size={18}/> Download PDF
                </button>
                 <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg border border-border text-foreground hover:bg-muted">
                    <Share2 size={18}/> Share
                </button>
            </div>
        </motion.div>
    );
};

export default PrescriptionDetailView;