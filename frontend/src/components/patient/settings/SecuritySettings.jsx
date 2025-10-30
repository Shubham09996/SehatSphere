import React from 'react';
// Upar wale `SettingsCard` component ko yahan bhi use karenge
import ProfileSettings from './ProfileSettings'; // Dummy import to get SettingsCard

const { default: SettingsCard } = { default: ({ title, description, children, footer }) => (
    <div className="bg-card border border-border rounded-xl">
        <div className="p-6 border-b border-border"><h3 className="text-lg font-bold text-foreground">{title}</h3><p className="text-sm text-muted-foreground mt-1">{description}</p></div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="p-4 bg-muted/50 rounded-b-xl text-right">{footer}</div>
    </div>
) };


const SecuritySettings = () => {
    return (
       <SettingsCard
            title="Change Password"
            description="For your security, we recommend choosing a strong password that you don't use elsewhere."
            // === IS BUTTON PAR GRADIENT LAGAYA HAI ===
            footer={
                <button className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity">
                    Update Password
                </button>
            }
        >
            <div>
                <label className="text-sm font-medium">Current Password</label>
                <input type="password" placeholder="••••••••" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">New Password</label>
                    <input type="password" placeholder="••••••••" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                </div>
                 <div>
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                </div>
            </div>
        </SettingsCard>
    );
};

export default SecuritySettings;