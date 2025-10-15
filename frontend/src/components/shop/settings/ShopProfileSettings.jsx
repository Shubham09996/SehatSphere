import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { shopSettingsData as data } from '../../../data/shopSettingsData'; // Remove this import
import axios from 'axios'; // Import axios
import api from '../../../utils/api'; // api.js se import karein
import { CheckCircle, XCircle } from 'lucide-react';

// Reusable components for this page
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

const SwitchToggle = ({ enabled, setEnabled }) => (
    <div onClick={() => setEnabled(!enabled)} className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${enabled ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end justify-end' : 'bg-muted justify-start'}`}>
        <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
    </div>
);

const DayAvailability = ({ day, schedule, onScheduleChange }) => {
    const [isOn, setIsOn] = useState(schedule?.enabled || false);
    const [fromTime, setFromTime] = useState(schedule?.from || '09:00');
    const [toTime, setToTime] = useState(schedule?.to || '17:00');

    useEffect(() => {
        onScheduleChange(day, { enabled: isOn, from: fromTime, to: toTime });
    }, [isOn, fromTime, toTime, day, onScheduleChange]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 py-2">
            <p className="font-semibold">{day}</p>
            {isOn ? (
                <div className="col-span-2 flex items-center gap-2">
                    <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} className="bg-background border border-border rounded-md p-2 w-full text-sm"/>
                     <span className="text-muted-foreground">to</span>
                    <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} className="bg-background border border-border rounded-md p-2 w-full text-sm"/>
                    <SwitchToggle enabled={isOn} setEnabled={setIsOn}/>
                </div>
            ) : (
                 <div className="col-span-2 flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Day Off</p>
                    <SwitchToggle enabled={isOn} setEnabled={setIsOn}/>
                 </div>
            )}
        </div>
    );
};

const ShopProfileSettings = () => {
    const [shopName, setShopName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [address, setAddress] = useState('');
    const [openingHours, setOpeningHours] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const shopId = '60d0fe4f5311236168a109cc'; // Temporarily using a dummy shopId. This should come from auth context.

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const fetchShopProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/shops/${shopId}/profile`);
                const data = response.data.shopProfile;
                setShopName(data.shopName || '');
                setContactPhone(data.contactPhone || '');
                setContactEmail(data.contactEmail || '');
                setAddress(data.address || '');
                setOpeningHours(data.openingHours || {});
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShopProfile();
    }, [shopId]);

    const handleOpeningHoursChange = (day, schedule) => {
        setOpeningHours(prevHours => ({ 
            ...prevHours, 
            [day]: schedule 
        }));
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const updatedProfile = {
                shopName,
                contactPhone,
                contactEmail,
                address,
                openingHours
            };
            await api.put(`/shops/${shopId}/profile`, updatedProfile);
            setSaveSuccess(true);
        } catch (err) {
            console.error('Error saving shop profile:', err);
            setError(err);
        } finally {
            setSaving(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    if (loading) {
        return <div className="text-center text-foreground p-6">Loading shop settings...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-6">Error loading shop settings: {error.message}</div>;
    }

    return (
        <div className="space-y-8">
            <SettingsCard
                title="Shop Profile"
                description="Update your pharmacy's public details."
                footer={
                    <div className="flex items-center justify-end gap-3">
                        {saveSuccess && <span className="text-sm text-green-500">Profile saved successfully!</span>}
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
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label htmlFor="shopName" className="text-sm font-medium">Shop Name</label>
                            <input 
                                type="text" 
                                id="shopName"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)} 
                                className="mt-1 w-full bg-background border border-border rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="contactPhone" className="text-sm font-medium">Contact Phone</label>
                            <input 
                                type="tel" 
                                id="contactPhone"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)} 
                                className="mt-1 w-full bg-background border border-border rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</label>
                            <input 
                                type="email" 
                                id="contactEmail"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)} 
                                className="mt-1 w-full bg-background border border-border rounded-md p-2"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="address" className="text-sm font-medium">Address</label>
                            <input 
                                type="text" 
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)} 
                                className="mt-1 w-full bg-background border border-border rounded-md p-2"
                            />
                        </div>
                    </div>
                </div>
            </SettingsCard>

            {/* NEW: Opening Hours Section */}
            <SettingsCard
                title="Opening Hours"
                description="Set your weekly schedule. This will be visible to patients."
                footer={
                    <div className="flex items-center justify-end gap-3">
                        {saveSuccess && <span className="text-sm text-green-500">Schedule saved successfully!</span>}
                        <button 
                            onClick={handleSaveChanges} 
                            className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                }
            >
                <div className="space-y-2">
                    {days.map(day => (
                        <DayAvailability 
                            key={day} 
                            day={day} 
                            schedule={openingHours[day]} 
                            onScheduleChange={handleOpeningHoursChange}
                        />
                    ))}
                </div>
            </SettingsCard>
        </div>
    );
};
export default ShopProfileSettings;