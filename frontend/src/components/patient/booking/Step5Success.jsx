import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const Step5Success = ({ details, onDone }) => (
    <div className="bg-card p-8 rounded-xl shadow-xl text-center flex flex-col items-center">
        <motion.div 
            className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <Check className="text-white" size={48} strokeWidth={3}/>
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground">Appointment Confirmed!</h1>
        <p className="text-muted-foreground mt-2 max-w-md">Your booking has been successfully made and your token has been generated. Please arrive 15 minutes early.</p>

        <div className="bg-muted my-8 p-4 rounded-lg border-2 border-dashed border-primary/50 w-full max-w-sm">
            <p className="text-muted-foreground text-xs sm:text-sm">Your Token Number</p>
            <p className="text-3xl sm:text-4xl font-bold text-primary tracking-widest my-2">{details.token}</p>
            <p className="text-xs text-muted-foreground">Show this at the reception of {details.hospital.name}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
             <Link to="/patient/appointments" className="text-sm font-semibold text-primary hover:underline py-2 px-4">
                View My Appointments
            </Link>
            <button onClick={onDone} className="font-bold py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                Book Another
            </button>
        </div>
    </div>
);

export default Step5Success;