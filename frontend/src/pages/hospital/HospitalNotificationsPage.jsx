import React, { useState, useEffect } from 'react';
import { Bell, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const HospitalNotificationsPage = () => {
    const [notificationsData, setNotificationsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/api/hospitals/notifications');
                setNotificationsData(data);
                toast.success('Notifications loaded successfully!');
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || err.message);
                setNotificationsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground p-8">Loading notifications...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-500 to-green-500 text-transparent bg-clip-text mb-6">Notifications</h1>
            <p className="text-muted-foreground mb-8">Stay updated with the latest alerts and activities.</p>

            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <h3 className="font-bold text-lg text-foreground mb-4">Recent Notifications</h3>
                <div className="space-y-4">
                    {notificationsData.map(notification => (
                        <div key={notification.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted transition-colors">
                            <div className="p-2 bg-primary/10 text-primary rounded-full flex-shrink-0">
                                <Bell size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">{notification.type}</p>
                                <p className="text-muted-foreground text-sm">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <Clock size={14} /> {notification.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default HospitalNotificationsPage;
