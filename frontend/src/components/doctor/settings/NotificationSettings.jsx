import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios'; // Import axios
import api from '../../../utils/api'; // api.js se import karein
import SwitchToggle from '../../ui/SwitchToggle';
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext'; // Import useAuth

// Reusable Components
const SettingsCard = ({ title, description, children, footer }) => (
    <motion.div 
        className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    >
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-4 bg-muted/50 rounded-b-xl text-right">{footer}</div>}
    </motion.div>
);

const NotificationSettings = () => {
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
    const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);
    const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const { user } = useAuth(); // Get logged-in user
    const userId = user?.id; // Assuming user ID is available directly on the user object

    useEffect(() => {
        const fetchNotificationPreferences = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/users/${userId}/notification-preferences`);
                const preferences = response.data.preferences;
                setEmailNotificationsEnabled(preferences.emailNotificationsEnabled);
                setSmsNotificationsEnabled(preferences.smsNotificationsEnabled);
                setInAppNotificationsEnabled(preferences.inAppNotificationsEnabled);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationPreferences();
    }, []);

    const handleSaveChanges = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const updatedPreferences = {
                emailNotificationsEnabled,
                smsNotificationsEnabled,
                inAppNotificationsEnabled,
            };
            await api.put(`/api/users/${userId}/notification-preferences`, updatedPreferences);
            setSaveSuccess(true);
        } catch (err) {
            console.error('Error saving notification preferences:', err);
            setError(err);
        } finally {
            setSaving(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    if (loading) {
        return <div className="text-center text-foreground p-6">Loading notification settings...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-6">Error loading notification settings: {error.message}</div>;
    }

    return (
        <SettingsCard
            title="Notification Preferences"
            description="Choose how you receive alerts related to your practice."
            footer={
                <div className="flex items-center justify-end gap-3">
                    {saveSuccess && <span className="text-sm text-green-500">Preferences saved successfully!</span>}
                    <button 
                        onClick={handleSaveChanges} 
                        className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <div>
                        <p className="font-semibold text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates and summaries via email.</p>
                    </div>
                    <SwitchToggle enabled={emailNotificationsEnabled} setEnabled={setEmailNotificationsEnabled}/>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <div>
                        <p className="font-semibold text-foreground">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Get critical alerts and reminders on your phone.</p>
                    </div>
                    <SwitchToggle enabled={smsNotificationsEnabled} setEnabled={setSmsNotificationsEnabled}/>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <div>
                        <p className="font-semibold text-foreground">In-App Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive instant notifications within the SehatSphere app.</p>
                    </div>
                    <SwitchToggle enabled={inAppNotificationsEnabled} setEnabled={setInAppNotificationsEnabled}/>
                </div>
            </div>
        </SettingsCard>
    );
};

export default NotificationSettings;