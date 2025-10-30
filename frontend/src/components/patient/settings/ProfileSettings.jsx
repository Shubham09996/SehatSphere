import React from 'react';
import { motion } from 'framer-motion';

const SettingsCard = ({ title, description, children, footer }) => (
    <motion.div 
        className="bg-card border border-border rounded-xl"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-6 space-y-4">
            {children}
        </div>
        <div className="p-4 bg-muted/50 rounded-b-xl text-right">
            {footer}
        </div>
    </motion.div>
);

const ProfileSettings = () => {
    return (
        <div className="space-y-8">
            <SettingsCard
                title="Personal Information"
                description="Update your personal details here."
                // === IS BUTTON PAR GRADIENT LAGAYA HAI ===
                footer={
                    <button className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity">
                        Save Changes
                    </button>
                }
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <input type="text" defaultValue="Ravi Kumar" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email Address</label>
                        <input type="email" defaultValue="ravi.kumar@example.com" disabled className="mt-1 w-full bg-muted border border-border rounded-md p-2 cursor-not-allowed"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Phone Number</label>
                        <input type="tel" defaultValue="+91 98765 43210" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Date of Birth</label>
                        <input type="date" defaultValue="1990-05-15" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
};

export default ProfileSettings;