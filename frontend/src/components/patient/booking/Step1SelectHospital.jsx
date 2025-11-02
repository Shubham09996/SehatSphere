import React from 'react';
import { Hospital, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Step1SelectHospital = ({ onNext, data }) => (
    <div>
        <h2 className="text-2xl font-bold text-foreground">Select a Hospital</h2>
        <p className="text-muted-foreground mt-1 mb-6">Begin by choosing a hospital from the list below.</p>
        <div className="space-y-4 mb-6">
            {data.map((hosp, index) => (
                <motion.div
                    key={hosp._id}
                    onClick={() => onNext({ hospital: hosp })}
                    className="group flex items-center justify-between gap-4 p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <div className="flex items-center gap-4">
                        {console.log('Hospital image path:', hosp.image)}
                        <img src={hosp.image || "https://via.placeholder.com/100"} alt={hosp.name} className="w-24 h-16 object-cover rounded-md"/>
                        <div>
                            <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">{hosp.name}</h3>
                            <p className="text-sm text-muted-foreground">{hosp.location}</p>
                        </div>
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" size={20}/>
                </motion.div>
            ))}
        </div>
    </div>
);

export default Step1SelectHospital;