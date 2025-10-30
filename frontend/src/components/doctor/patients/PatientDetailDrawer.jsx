import React from 'react';
import { motion } from 'framer-motion';
import { X, Phone, Mail, FileText, ShieldAlert, Heart, Droplets } from 'lucide-react';

const PatientDetailDrawer = ({ patient, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-border">
                    <div className="flex items-center gap-4">
                        <img src={patient.pfp} alt={patient.name} className="w-12 h-12 rounded-full"/>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
                            <p className="text-sm text-muted-foreground">{patient.id} • {patient.age}, {patient.gender}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                </div>
                
                {/* Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    {/* Contact Info */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm"><Phone size={14} className="text-primary"/><span>{patient.contact.phone}</span></div>
                        <div className="flex items-center gap-3 text-sm"><Mail size={14} className="text-primary"/><span>{patient.contact.email}</span></div>
                    </div>

                     {/* Critical Info */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><ShieldAlert size={16} className="text-red-500"/> Critical Info</h4>
                        <div className="bg-muted p-3 rounded-lg text-sm space-y-2">
                            <p><b>Allergies:</b> {patient.criticalInfo.allergies.join(', ')}</p>
                            <p><b>Chronic Conditions:</b> {patient.criticalInfo.chronicConditions.join(', ')}</p>
                        </div>
                    </div>

                    {/* Vitals */}
                     <div>
                        <h4 className="font-semibold text-foreground mb-2">Recent Vitals</h4>
                        <div className="flex gap-4">
                            <div className="flex-1 bg-muted p-3 rounded-lg text-sm"><p className="flex items-center gap-1"><Heart size={14}/> Blood Pressure</p><p className="font-bold">{patient.recentVitals.bloodPressure}</p></div>
                            <div className="flex-1 bg-muted p-3 rounded-lg text-sm"><p className="flex items-center gap-1"><Droplets size={14}/> Blood Sugar</p><p className="font-bold">{patient.recentVitals.bloodSugar}</p></div>
                        </div>
                    </div>
                    
                     {/* Recent Activity */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-2">Recent Activity</h4>
                        <div className="space-y-3">
                            {patient.recentActivity.map((act, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="text-xs text-muted-foreground w-20">{new Date(act.date).toLocaleDateString()}</div>
                                    <div className="text-sm font-semibold">{act.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/50">
                    <button className="w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-lg bg-primary text-primary-foreground">
                        <FileText size={18}/> View Full Health Record
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PatientDetailDrawer;