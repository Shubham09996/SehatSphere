import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Upar wale `SettingsCard` component ko yahan bhi use karenge
import ProfileSettings from './ProfileSettings';

const { default: SettingsCard } = { default: ({ title, description, children, footer }) => (
    <div className="bg-card border border-border rounded-xl">
        <div className="p-6 border-b border-border"><h3 className="text-lg font-bold text-foreground">{title}</h3><p className="text-sm text-muted-foreground mt-1">{description}</p></div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="p-4 bg-muted/50 rounded-b-xl text-right">{footer}</div>
    </div>
) };


const SwitchToggle = ({ enabled, setEnabled }) => {
    return (
        // === SWITCH PAR GRADIENT LAGAYA HAI ===
        <div 
            onClick={() => setEnabled(!enabled)} 
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                enabled 
                ? 'bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end justify-end' 
                : 'bg-muted justify-start'
            }`}
        >
            <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-md" />
        </div>
    );
};

const NotificationSettings = () => {
    const [apptReminders, setApptReminders] = useState(true);
    const [prescriptionUpdates, setPrescriptionUpdates] = useState(true);
    const [healthTips, setHealthTips] = useState(false);

    return (
        <SettingsCard
            title="Notification Preferences"
            description="Choose how you want to be notified."
            // === SAVE PREFERENCES BUTTON PAR GRADIENT LAGAYA HAI ===
            footer={
                <button className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity">
                    Save Preferences
                </button>
            }
        >
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                <div>
                    <p className="font-semibold text-foreground">Appointment Reminders</p>
                    <p className="text-sm text-muted-foreground">Get notified before your scheduled appointments.</p>
                </div>
                <SwitchToggle enabled={apptReminders} setEnabled={setApptReminders}/>
            </div>
             <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                <div>
                    <p className="font-semibold text-foreground">Prescription Updates</p>
                    <p className="text-sm text-muted-foreground">Receive alerts for prescription renewals.</p>
                </div>
                <SwitchToggle enabled={prescriptionUpdates} setEnabled={setPrescriptionUpdates}/>
            </div>
             <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                <div>
                    <p className="font-semibold text-foreground">Health Tips & Newsletter</p>
                    <p className="text-sm text-muted-foreground">Occasional health tips and updates from us.</p>
                </div>
                <SwitchToggle enabled={healthTips} setEnabled={setHealthTips}/>
            </div>
        </SettingsCard>
    );
};

export default NotificationSettings;