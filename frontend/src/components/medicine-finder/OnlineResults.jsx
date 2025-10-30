import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { onlineMedicinesData } from '../../data/onlineMedicinesData';
import { medicinesData } from '../../data/medicinesData';
import OnlineMedicineCard from './OnlineMedicineCard';

const OnlineResults = ({ searchTerm }) => {
    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];

        // Find medicine IDs that match the search
        const matchingMedicineIds = medicinesData
            .filter(med => 
                med.brandName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(med => med.id);

        // Find online listings for those medicine IDs
        return onlineMedicinesData
            .filter(listing => matchingMedicineIds.includes(listing.medicineId))
            .map(listing => {
                const medicineDetails = medicinesData.find(m => m.id === listing.medicineId);
                return { ...listing, ...medicineDetails }; // Combine listing and medicine details
            });
    }, [searchTerm]);

    if (!searchTerm.trim()) {
         return <div className="text-center py-12 text-muted-foreground">Start typing to search for medicines online.</div>;
    }

    return (
        <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
            {searchResults.length > 0 ? (
                searchResults.map(result => <OnlineMedicineCard key={result.id} result={result} />)
            ) : (
                 <div className="text-center py-12 bg-card rounded-lg text-muted-foreground">No online results found for "{searchTerm}".</div>
            )}
        </motion.div>
    );
};

export default OnlineResults;