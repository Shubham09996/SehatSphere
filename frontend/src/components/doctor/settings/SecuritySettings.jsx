import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { SettingsCard } from '../../ui/SettingsCard';
import api from '../../../utils/api'; // api.js se import karein
import SwitchToggle from '../../ui/SwitchToggle';
import { ShieldCheck, Lock, CheckCircle, XCircle } from 'lucide-react';

// Reusable components (from ConsultationSettings or similar)
const SettingsCard = ({ title, description, children, footer }) => (
    <motion.div 
        className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    >
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="p-6 space-y-4">{children}</div>
        {footer && <div className="p-4 bg-muted/50 rounded-b-xl text-right">{footer}</div>}
    </motion.div>
);

const SwitchToggle = ({ enabled, setEnabled }) => (
    <div 
        onClick={() => setEnabled(!enabled)} 
        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
            enabled ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end justify-end' : 'bg-muted justify-start'
        }`}
    >
        <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
    </div>
);

const SecuritySettings = () => {
    const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const doctorId = '60d0fe4f5311236168a109cb'; // Temporarily using a dummy doctorId. This should come from auth context.

    useEffect(() => {
        const fetchSecuritySettings = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/users/${userId}/settings/security`);
                const settings = response.data.settings;
                setTwoFactorAuthEnabled(settings.twoFactorAuthEnabled);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSecuritySettings();
    }, [doctorId]);

    const handleSaveChanges = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            await api.put(`/users/${userId}/settings/security`, { twoFactorAuthEnabled });
            setSaveSuccess(true);
        } catch (err) {
            console.error('Error saving security settings:', err);
            setError(err);
        } finally {
            setSaving(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    if (loading) {
        return <div className="text-center text-foreground p-6">Loading security settings...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-6">Error loading security settings: {error.message}</div>;
    }

    return (
        <SettingsCard
            title="Security Settings"
            description="Manage your account security features."
            footer={
                <div className="flex items-center justify-end gap-3">
                    {saveSuccess && <span className="text-sm text-green-500">Settings saved successfully!</span>}
                    <button 
                        onClick={handleSaveChanges} 
                        className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            }
        >
            <div className="flex items-center justify-between">
                <label htmlFor="twoFactorAuth" className="text-sm font-medium">Two-Factor Authentication</label>
                <SwitchToggle enabled={twoFactorAuthEnabled} setEnabled={setTwoFactorAuthEnabled} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account.</p>
        </SettingsCard>
    );
};

export default SecuritySettings;