import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shopNotificationsData as initialNotifications } from '../../data/shopNotificationsData';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

// Helper function to format time
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

const NotificationItem = ({ notification, onMarkRead }) => {
    const navigate = useNavigate();
    const Icon = LucideIcons[notification.icon] || LucideIcons['Bell'];
    const handleClick = () => { onMarkRead(notification.id); if (notification.link !== '#') navigate(notification.link); };

    return (
        <motion.div
            layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: 'spring' }}
            onClick={handleClick}
            className={`flex items-start gap-4 p-4 border-b border-border cursor-pointer transition-colors ${notification.isRead ? 'hover:bg-muted' : 'bg-primary/5 hover:bg-primary/10'}`}
        >
            {!notification.isRead && <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />}
            <div className={`mt-1 text-primary flex-shrink-0 ${notification.isRead && 'ml-[14px]'}`}> <Icon size={20} /> </div>
            <div className="flex-1 overflow-hidden">
                <p className="font-bold text-foreground truncate">{notification.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                <p className="text-xs text-primary font-semibold mt-2">{timeAgo(notification.timestamp)}</p>
            </div>
        </motion.div>
    );
};

const ShopNotificationsPage = () => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Orders', 'Inventory', 'System'];

    const filteredNotifications = useMemo(() => {
        if (activeTab === 'All') return notifications;
        return notifications.filter(n => n.category === activeTab.slice(0, -1)); // 'Orders' -> 'Order'
    }, [activeTab, notifications]);

    const handleMarkRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    const handleMarkAllRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    const handleClearAll = () => setNotifications([]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Shop Notifications
                    </h1>
                    <p className="text-muted-foreground mt-1">Recent alerts and updates for your pharmacy.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleMarkAllRead} className="text-sm font-semibold text-muted-foreground hover:text-primary">Mark all as read</button>
                    <button onClick={handleClearAll} className="text-sm font-semibold text-red-500 hover:text-red-700">Clear all</button>
                </div>
            </div>

            <div className="flex border-b border-border mb-4 overflow-x-auto pb-px [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`relative px-4 py-2 text-sm font-semibold flex-shrink-0 ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {tab}
                        {activeTab === tab && <motion.div layoutId="shop-notif-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                ))}
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
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

export default ShopNotificationsPage;