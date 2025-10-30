import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { offlineShopsData } from '../../data/offlineShopsData';
import { medicinesData } from '../../data/medicinesData';
import OfflineShopCard from './OfflineShopCard';

const OfflineResults = ({ searchTerm }) => {
     const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];

        const matchingMedicineIds = medicinesData
            .filter(med => 
                med.brandName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(med => med.id);
        
        if (matchingMedicineIds.length === 0) return [];

        return offlineShopsData
            .map(shop => {
                const foundMedicines = shop.inventory
                    .filter(medId => matchingMedicineIds.includes(medId))
                    .map(medId => medicinesData.find(m => m.id === medId));

                return { ...shop, foundMedicines };
            })
            .filter(shop => shop.foundMedicines.length > 0);

    }, [searchTerm]);

    if (!searchTerm.trim()) {
         return <div className="text-center py-12 text-muted-foreground">Start typing to find medicines in affiliated shops.</div>;
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
            {searchResults.length > 0 ? (
                searchResults.map(result => <OfflineShopCard key={result.id} result={result} />)
            ) : (
                <div className="md:col-span-2 text-center py-12 bg-card rounded-lg text-muted-foreground">No affiliated shops found with "{searchTerm}".</div>
            )}
        </motion.div>
    );
};

export default OfflineResults;