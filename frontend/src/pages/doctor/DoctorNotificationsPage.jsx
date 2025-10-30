import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doctorNotificationsData as initialNotifications } from '../../data/doctorNotificationsData';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

// Helper function to format time
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `just now`;
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// Notification Item Component
const NotificationItem = ({ notification, onMarkRead }) => {
    const navigate = useNavigate();
    const Icon = LucideIcons[notification.icon] || LucideIcons['Bell'];

    const handleClick = () => {
        onMarkRead(notification.id);
        if (notification.link && notification.link !== '#') {
             navigate(notification.link);
        }
    };

    return (
        <motion.div
            layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: 'spring' }}
            onClick={handleClick}
            // 1. Unread background changed
            className={`flex items-start gap-4 p-4 border-b border-border cursor-pointer transition-colors ${notification.isRead ? 'hover:bg-muted' : 'bg-hs-gradient-start/5 hover:bg-hs-gradient-start/10'}`}
        >
            {/* 2. Unread dot changed to gradient */}
            {!notification.isRead && <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end flex-shrink-0" />}
            
            {/* 3. Icon changed to have gradient background */}
            <div className={`mt-1 flex-shrink-0 ${notification.isRead && 'ml-[14px]'}`}>
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end">
                    <Icon size={18} className="text-white" />
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <p className="font-bold text-foreground truncate">{notification.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                {/* 4. Time ago text changed to gradient */}
                <p className="text-xs font-semibold mt-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">{timeAgo(notification.timestamp)}</p>
            </div>
        </motion.div>
    );
};

// Main Notifications Page
const DoctorNotificationsPage = () => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Patient', 'Report', 'System', 'Appointment'];

    const filteredNotifications = useMemo(() => {
        if (activeTab === 'All') return notifications;
        return notifications.filter(n => n.category === activeTab);
    }, [activeTab, notifications]);

    const handleMarkRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    const handleMarkAllRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    const handleClearAll = () => setNotifications([]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    {/* 5. Heading changed to gradient */}
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Notifications</h1>
                    <p className="text-muted-foreground mt-1">Recent alerts and updates for your practice.</p>
                </div>
                <div className="flex gap-2">
                    {/* 6. Mark all as read hover changed to gradient */}
                    <button onClick={handleMarkAllRead} className="text-sm font-semibold text-muted-foreground hover:bg-gradient-to-r hover:from-hs-gradient-start hover:to-hs-gradient-end hover:text-transparent hover:bg-clip-text">Mark all as read</button>
                    <button onClick={handleClearAll} className="text-sm font-semibold text-red-500 hover:text-red-700">Clear all</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mb-4 overflow-x-auto pb-px [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        // 7. Active tab changed to gradient
                        className={`relative px-4 py-2 text-sm font-semibold flex-shrink-0 ${activeTab === tab ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {tab}
                        {/* 8. Tab underline changed to gradient */}
                        {activeTab === tab && <motion.div layoutId="doc-notif-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end" />}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="bg-card rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <AnimatePresence>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications
                            .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
                            .map(notification => (
                                <NotificationItem key={notification.id} notification={notification} onMarkRead={handleMarkRead} />
                            ))
                    ) : (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20 px-4">
                            <LucideIcons.BellOff size={40} className="mx-auto text-muted-foreground mb-4"/>
                            <h3 className="font-semibold text-foreground">No notifications yet</h3>
                            <p className="text-sm text-muted-foreground">You're all caught up in this category!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DoctorNotificationsPage;