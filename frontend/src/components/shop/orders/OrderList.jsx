import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const timeAgo = (date) => { /* ... same timeAgo function from previous examples ... */ };

const OrderListItem = ({ order, isActive, onSelect }) => (
    <motion.div
        onClick={() => onSelect(order.id)}
        className={`p-3 rounded-lg cursor-pointer border-l-4 transition-colors ${isActive ? 'bg-primary/10 border-primary' : 'bg-muted border-transparent hover:bg-muted/80'}`}
        layout
    >
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <img src={order.pfp} alt={order.patientName} className="w-9 h-9 rounded-full"/>
                <div>
                    <p className="font-semibold text-sm text-foreground">{order.patientName}</p>
                    <p className="text-xs text-muted-foreground">{order.id}</p>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">{timeAgo(order.timestamp)}</p>
        </div>
    </motion.div>
);

const OrderList = ({ tabs, activeTab, setActiveTab, orders, selectedOrderId, setSelectedOrderId }) => {
    return (
        <div className="bg-card border border-border rounded-xl flex flex-col h-full shadow-sm">
            <div className="p-4 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" placeholder="Search by name or ID..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm"/>
                </div>
            </div>
            <div className="flex border-b border-border px-2">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className="relative px-3 py-2 text-sm font-semibold flex-shrink-0 text-muted-foreground hover:text-foreground">
                        {tab}
                        {activeTab === tab && <motion.div layoutId="order-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                ))}
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {orders.map(order => (
                    <OrderListItem key={order.id} order={order} isActive={order.id === selectedOrderId} onSelect={setSelectedOrderId} />
                ))}
            </div>
        </div>
    );
};
export default OrderList;