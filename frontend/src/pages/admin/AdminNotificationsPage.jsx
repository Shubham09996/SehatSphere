import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Removed: import { adminNotificationsData as initialNotifications } from '../../data/adminNotificationsData';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import api from '../../utils/api'; // Import API utility
import { toast } from 'react-toastify';

// --- Helper function for timestamps ---
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 5) return `just now`;
    let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60; if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

// --- Notification Item Component ---
const NotificationItem = ({ notification, onMarkRead, onAction }) => {
    const navigate = useNavigate();
    // Check if LucideIcons[notification.icon] is a valid component, otherwise default to Bell
    const Icon = LucideIcons[notification.icon] && typeof LucideIcons[notification.icon] === 'function' ? LucideIcons[notification.icon] : LucideIcons['Bell'];

    const severityStyles = {
        High: { border: 'border-red-500', bg: 'bg-red-500/5' },
        Medium: { border: 'border-orange-500', bg: 'bg-orange-500/5' },
        Low: { border: 'border-blue-500', bg: 'bg-blue-500/5' },
        // Default style if severity is not matched or is null
        default: { border: 'border-gray-500', bg: 'bg-gray-500/5' }, 
    };

    const currentSeverityStyle = severityStyles[notification.severity] || severityStyles.default;

    const handleClick = () => { onMarkRead(notification._id); if (notification.link && notification.link !== '#') navigate(notification.link); };

    return (
        <motion.div
            layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
            onClick={handleClick}
            className={`flex items-start gap-4 p-4 border-b border-border last:border-b-0 cursor-pointer transition-colors ${currentSeverityStyle.bg} ${!notification.isRead ? 'border-l-4 ' + currentSeverityStyle.border : ''}`}
        >
            {!notification.isRead && <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />}
            <div className={`mt-1 text-muted-foreground flex-shrink-0 ${notification.isRead ? 'ml-[14px]' : ''}`}> <Icon size={20} /> </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start">
                    <p className="font-bold text-foreground truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(notification.createdAt)}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                {notification.actions && notification.actions.length > 0 && (
                    <div className="flex gap-2 mt-3">
                        {notification.actions.map((action, index) => (
                            <button key={index} onClick={(e) => { e.stopPropagation(); onAction(notification._id, action.actionType); }}
                                className="text-xs font-semibold py-1 px-3 rounded-md border border-border hover:bg-muted"
                            >{action.label}</button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- Main Notifications Page ---
const AdminNotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Security', 'Registration', 'System', 'Appointment', 'Order']; // Added more categories

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/notifications');
            setNotifications(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const filteredNotifications = useMemo(() => {
        if (activeTab === 'All') return notifications;
        return notifications.filter(n => n.category === activeTab);
    }, [activeTab, notifications]);
    
    const handleMarkRead = async (id) => {
        try {
            await api.put(`/api/admin/notifications/${id}/read`);
            setNotifications(prev => prev.map(notif => notif._id === id ? { ...notif, isRead: true } : notif));
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const handleMarkAllRead = async () => {
        if (window.confirm('Are you sure you want to mark all notifications as read?')) {
            try {
                // This would ideally be a dedicated backend API, for now, iterate
                await Promise.all(notifications.filter(n => !n.isRead).map(n => api.put(`/api/admin/notifications/${n._id}/read`)));
                toast.success('All notifications marked as read!');
                fetchNotifications(); // Re-fetch to update UI
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            }
        }
    };

    const handleAction = async (id, actionType) => {
        // This needs to be implemented based on actual action types (e.g., approve user, resolve alert)
        // For now, it will just remove the notification
        console.log(`Action: ${actionType} for notification ${id}`);
        // Example: if (actionType === 'approveUser') { await api.put(`/api/admin/approve-user/${id}`, { type: 'User' }); }
        setNotifications(prev => prev.filter(n => n._id !== id));
        toast.info(`Action ${actionType} for notification ${id} performed (simulated).`);
    };

    if (loading) {
        return <div className="text-center text-foreground p-8">Loading notifications...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error loading notifications: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Platform Notifications
                    </h1>
                    <p className="text-muted-foreground mt-1">Real-time alerts, system updates, and pending actions.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleMarkAllRead} className="text-sm font-semibold text-muted-foreground hover:text-primary">
                        Mark all as read
                    </button>
                </div>
            </div>

            <div className="flex border-b border-border mb-4 overflow-x-auto pb-px">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`relative px-4 py-2 text-sm font-semibold flex-shrink-0 ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {tab}
                        {activeTab === tab && <motion.div layoutId="admin-notif-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                ))}
            </div>

            <div className="bg-card rounded-xl border border-border/70 overflow-hidden shadow-sm">
                <AnimatePresence>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications
                            .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt
                            .map(notification => (
                                <NotificationItem 
                                    key={notification._id} 
                                    notification={notification} 
                                    onMarkRead={handleMarkRead} 
                                    onAction={handleAction} 
                                />
                            ))
                    ) : (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20 px-4">
                            <LucideIcons.BellOff size={40} className="mx-auto text-muted-foreground mb-4"/>
                            <h3 className="font-semibold text-foreground">All Clear!</h3>
                            <p className="text-sm text-muted-foreground">No notifications in this category.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminNotificationsPage;