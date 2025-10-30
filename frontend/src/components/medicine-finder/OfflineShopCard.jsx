import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Hospital, Pill } from 'lucide-react';

const OfflineShopCard = ({ result }) => {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-card border border-border rounded-xl flex flex-col overflow-hidden group"
        >
            {/* --- NEW: Image Section --- */}
            <div className="h-40 overflow-hidden">
                <img 
                    src={result.image} 
                    alt={result.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-xl text-foreground">{result.name}</h3>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2"><MapPin size={14}/> {result.location}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Clock size={14}/> {result.timings}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1"><Hospital size={14}/> Affiliated with {result.affiliatedHospital}</div>
                
                <div className="my-4 border-t border-border"></div>

                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Pill size={16} className="text-primary"/> Found Medicines:</p>
                <div className="space-y-2">
                    {result.foundMedicines.map(med => (
                        <div key={med.id} className="flex justify-between items-center bg-muted p-2 rounded-md">
                            <p className="text-sm font-semibold text-foreground">{med.brandName} <span className="text-xs font-normal">({med.strength})</span></p>
                            <p className="text-sm font-bold text-primary">₹{med.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-6 flex gap-3">
                     {/* === IS BUTTON MEIN GRADIENT LAGAYA HAI === */}
                      <a href={`tel:${result.phone}`} className="flex-1 flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity">
                          <Phone size={16}/> Call Now
                      </a>
                    <button className="flex-1 font-semibold py-2 px-4 rounded-lg border border-border text-foreground hover:bg-muted">
                        Reserve
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default OfflineShopCard;