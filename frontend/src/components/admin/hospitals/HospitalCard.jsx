import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Users, Clock, BarChart2, Edit, Trash2 } from 'lucide-react';

const HospitalCard = ({ hospital, onEdit, onDelete, onUpdateStatus }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={cardVariants}
            className="bg-card rounded-xl border border-border/70 shadow-md flex flex-col group overflow-hidden"
        >
            <div className="h-40 overflow-hidden">
                <img src={hospital.image || "https://via.placeholder.com/100"} alt={hospital.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-foreground">{hospital.name}</h3>
                <p className="text-sm text-muted-foreground">{hospital.location}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold">Status:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full 
                        ${hospital.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                          hospital.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100' :
                          hospital.status === 'Suspended' ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}`}>
                        {hospital.status}
                    </span>
                </div>
                <div className="my-4 border-t border-border"></div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div><Stethoscope className="mx-auto text-primary mb-1"/><p className="font-bold">{hospital.stats?.totalDoctors || 0}</p><p className="text-xs text-muted-foreground">Doctors</p></div>
                    <div><Users className="mx-auto text-primary mb-1"/><p className="font-bold">{hospital.stats?.patientsToday || 0}</p><p className="text-xs text-muted-foreground">Patients Today</p></div>
                    <div><Clock className="mx-auto text-primary mb-1"/><p className="font-bold">{hospital.stats?.avgWaitTime || 'N/A'}</p><p className="text-xs text-muted-foreground">Avg. Wait</p></div>
                </div>
                <div className="mt-auto pt-5 flex gap-3">
                    <button onClick={onEdit} className="flex-1 font-semibold py-2 px-3 text-sm rounded-lg border border-border hover:bg-muted flex items-center justify-center">
                        <Edit size={14} className="inline mr-1.5"/> Edit
                    </button>
                    <button onClick={onDelete} className="flex-1 font-semibold py-2 px-3 text-sm rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center">
                        <Trash2 size={14} className="inline mr-1.5"/> Delete
                    </button>
                </div>
                {hospital.status === 'Pending' && ( // Show status actions only for pending hospitals
                    <div className="mt-auto pt-3 flex gap-3 border-t border-border/70">
                        <button onClick={() => onUpdateStatus(hospital._id, 'Active')} className="flex-1 font-semibold py-2 px-3 text-sm rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 flex items-center justify-center">
                            Activate
                        </button>
                        <button onClick={() => onUpdateStatus(hospital._id, 'Rejected')} className="flex-1 font-semibold py-2 px-3 text-sm rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center">
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
export default HospitalCard;