import React from 'react';
import { Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const LockedFeatureCard = ({ title, children }) => (
    <div className="relative bg-card p-6 rounded-xl border border-border/70 shadow-sm h-full">
        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            {title}
        </h3>
        {/* Blurred content */}
        <div className="blur-sm select-none">
            {children}
        </div>
        {/* Upgrade Overlay */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 rounded-xl"
        >
            <Lock size={24} className="text-yellow-500 mb-2" />
            <p className="font-semibold text-foreground">This is a Premium Feature</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">Upgrade your plan to unlock.</p>
            <button className="font-semibold py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2">
                <Zap size={14}/> Upgrade Now
            </button>
        </motion.div>
    </div>
);

export default LockedFeatureCard;