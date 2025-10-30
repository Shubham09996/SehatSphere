import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MedicineCard = ({ medicine }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div variants={cardVariants}>
            <Link to={`/patient/medicine-finder/${medicine.id}`} className="block bg-card rounded-xl border border-border overflow-hidden h-full group transition-all hover:border-primary hover:shadow-lg">
                <div className="h-40 bg-muted flex items-center justify-center p-4">
                    <img src={medicine.image} alt={medicine.brandName} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-lg text-foreground truncate">{medicine.brandName}</h3>
                    <p className="text-sm text-muted-foreground">{medicine.strength} • {medicine.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">Contains: {medicine.genericName}</p>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-bold text-primary">₹{medicine.price.toFixed(2)}</p>
                        <span className="text-xs font-semibold text-primary group-hover:underline">View Details →</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default MedicineCard;