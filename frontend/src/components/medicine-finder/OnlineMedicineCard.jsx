import React from 'react';
import { motion } from 'framer-motion';

const OnlineMedicineCard = ({ result }) => {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-card p-4 border border-border rounded-xl flex flex-col sm:flex-row items-center gap-4 group"
        >
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                 <img src={result.image} alt={result.brandName} className="max-h-full object-contain"/>
            </div>
            <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg text-foreground">{result.brandName} <span className="text-sm font-normal text-muted-foreground">{result.strength}</span></h3>
                <p className="text-xs text-muted-foreground">{result.genericName}</p>
                 <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                     <img src={result.platformLogo} alt={result.platform} className="h-4"/>
                     {result.discount && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">{result.discount} OFF</span>}
                 </div>
            </div>
             <div className="flex sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto mt-4 sm:mt-0">
                <p className="text-xl font-bold text-primary">₹{result.price.toFixed(2)}</p>
                <a 
                    href={result.buyNowUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    // === IS BUTTON MEIN GRADIENT LAGAYA HAI ===
                    className="font-bold py-2 px-6 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                >
                    Buy Now
                </a>
            </div>
        </motion.div>
    );
};

export default OnlineMedicineCard;