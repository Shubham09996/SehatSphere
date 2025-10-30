import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DoctorStatusToggle = () => {
    const [isAvailable, setIsAvailable] = useState(true);

    return (
        // UPDATED: Border and shadow for better visibility
        <div className="bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            <h3 className="font-bold text-lg text-foreground mb-4">Your Status</h3>
            <div 
                onClick={() => setIsAvailable(!isAvailable)} 
                className="relative w-full p-1 flex rounded-full cursor-pointer bg-muted"
            >
                {/* Sliding indicator */}
                <motion.div 
                    layoutId="status-indicator" 
                    className="absolute h-8 w-1/2 bg-card rounded-full shadow-md border border-border"
                    animate={{ x: isAvailable ? '0%' : '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                
                {/* Text labels container */}
                <div className="relative z-10 w-1/2 text-center py-1">
                    <span className={`font-semibold transition-colors ${isAvailable ? 'text-primary' : 'text-muted-foreground'}`}>
                        Available
                    </span>
                </div>
                <div className="relative z-10 w-1/2 text-center py-1">
                     <span className={`font-semibold transition-colors ${!isAvailable ? 'text-primary' : 'text-muted-foreground'}`}>
                        On a Break
                    </span>
                </div>
            </div>
         </div>
    );
};

export default DoctorStatusToggle;