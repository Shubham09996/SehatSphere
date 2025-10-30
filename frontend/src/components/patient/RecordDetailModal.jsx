import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Stethoscope, TestTube2, ShieldAlert, Syringe, Download } from 'lucide-react';

const icons = {
    Consultation: <Stethoscope />,
    LabReport: <TestTube2 />,
    Allergy: <ShieldAlert />,
    Vaccination: <Syringe />,
    Document: <FileText />,
};

const RecordDetailModal = ({ record, onClose }) => {
    if (!record) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-lg flex flex-col max-h-[90vh]"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="p-4 flex justify-between items-center border-b border-border">
                        <div className="flex items-center gap-3">
                             <div className="bg-primary/20 text-primary p-2 rounded-full">
                                {icons[record.type] || <FileText />}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground">{record.title}</h2>
                                <p className="text-sm text-muted-foreground">{new Date(record.date).toDateString()}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 flex-1 overflow-y-auto">
                        {record.type === 'Consultation' && (
                            <div className="space-y-4 text-sm">
                                <div><p className="text-muted-foreground">Doctor</p><p className="font-semibold">{record.details.doctorName}</p></div>
                                <div><p className="text-muted-foreground">Specialty</p><p className="font-semibold">{record.details.specialty}</p></div>
                                <div><p className="text-muted-foreground">Summary</p><p>{record.details.summary}</p></div>
                            </div>
                        )}
                        {record.type === 'LabReport' && (
                            <div>
                                <h3 className="font-semibold mb-2">Results from {record.details.labName}</h3>
                                <div className="space-y-2">
                                    {record.details.results.map(r => (
                                        <div key={r.name} className="flex justify-between p-2 bg-muted rounded-md text-sm">
                                            <span className="text-muted-foreground">{r.name}</span>
                                            <div className="text-right">
                                                <span className="font-bold text-foreground">{r.value}</span>
                                                <span className="text-xs ml-2"> (Ref: {r.range})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                         {record.type === 'Allergy' && (
                            <div className="space-y-4 text-sm">
                                <div><p className="text-muted-foreground">Allergen</p><p className="font-semibold">{record.details.allergen}</p></div>
                                <div><p className="text-muted-foreground">Severity</p><p className="font-semibold">{record.details.severity}</p></div>
                                <div><p className="text-muted-foreground">Typical Reaction</p><p>{record.details.reaction}</p></div>
                            </div>
                        )}
                    </div>
                    
                    {/* Modal Footer */}
                    {record.details.fileUrl && (
                        <div className="p-4 border-t border-border bg-muted/50">
                            <a href={record.details.fileUrl} download className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                                <Download size={16}/> Download Report
                            </a>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RecordDetailModal;