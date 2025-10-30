import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ordersData as initialOrders } from '../../data/ordersData';
import { Search, X, Check, Package, Bell, FileText, CheckCircle, ZoomIn, ZoomOut, Minus, Plus } from 'lucide-react';

// --- Reusable Order Card for Kanban Board ---
const OrderKanbanCard = ({ order, onSelect }) => {
    const statusColors = {
        New: 'border-blue-500',
        Preparing: 'border-orange-500',
        Ready: 'border-green-500',
    };
    return (
        <motion.div
            layoutId={`order-card-container-${order.id}`}
            onClick={() => onSelect(order)}
            className={`bg-card p-4 rounded-xl border-l-4 ${statusColors[order.status]} shadow-md hover:shadow-lg cursor-pointer transition-shadow`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-foreground">{order.patientName}</p>
                    <p className="text-xs text-muted-foreground">{order.id}</p>
                </div>
                <img src={order.pfp} alt={order.patientName} className="w-10 h-10 rounded-full"/>
            </div>
            <div className="flex justify-between items-end mt-4">
                <p className="text-xs font-semibold text-muted-foreground">{order.medicines.length} Items</p>
                <p className="text-xs text-muted-foreground">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
        </motion.div>
    );
};

// --- Next-Level Order Detail Modal ---
const OrderDetailModal = ({ order, updateOrderStatus, onClose }) => {
    const [medicines, setMedicines] = useState(order.medicines);
    const [zoom, setZoom] = useState(1);

    const togglePacked = (index) => {
        const newMedicines = [...medicines];
        newMedicines[index].isPacked = !newMedicines[index].isPacked;
        setMedicines(newMedicines);
    };

    const actionButtons = {
        'New': <button onClick={() => updateOrderStatus(order.id, 'Preparing')} className="w-full font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white flex items-center justify-center gap-2"><Check size={18}/> Verify & Start Preparing</button>,
        'Preparing': <button onClick={() => updateOrderStatus(order.id, 'Ready')} className="w-full font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white flex items-center justify-center gap-2"><Package size={18}/> Mark as Ready</button>,
        'Ready': <button className="w-full font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white flex items-center justify-center gap-2"><Bell size={18}/> Notify Patient</button>,
    };

    return (
         <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                layoutId={`order-card-container-${order.id}`}
                className="bg-card w-full max-w-6xl h-[90vh] rounded-2xl border border-border shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3">
                         <img src={order.pfp} alt={order.patientName} className="w-10 h-10 rounded-full"/>
                         <div>
                            <h2 className="text-lg font-bold text-foreground">{order.patientName}</h2>
                            <p className="text-sm text-muted-foreground">{order.id}</p>
                         </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                </div>
                {/* Main Content */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                    {/* Left: Prescription Viewer */}
                    <div className="relative h-full flex flex-col bg-muted/50 overflow-hidden">
                        <div className="p-2 border-b border-border text-center text-sm font-semibold text-muted-foreground">Prescription Viewer</div>
                        <div className="flex-1 p-4 overflow-auto">
                            <motion.img 
                                src={order.prescriptionImage} 
                                alt="Prescription" 
                                className="w-full h-auto origin-top-left"
                                style={{ scale: zoom }}
                                drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                            />
                        </div>
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 p-1 bg-card border border-border rounded-full shadow-md">
                            <button onClick={() => setZoom(z => z + 0.2)} className="p-2 hover:bg-muted rounded-full"><Plus size={16}/></button>
                            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 hover:bg-muted rounded-full"><Minus size={16}/></button>
                        </div>
                    </div>
                    {/* Right: Verification Workspace */}
                    <div className="h-full flex flex-col">
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                            <h3 className="font-bold text-lg text-foreground">Medicines Checklist</h3>
                             <div className="space-y-3">
                                {medicines.map((med, i) => (
                                    <div key={i} onClick={() => togglePacked(i)}
                                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all border ${med.isPacked ? 'bg-green-500/10 border-green-500/30' : 'bg-muted border-border'}`}>
                                        <div className={`w-6 h-6 rounded flex-shrink-0 border-2 flex items-center justify-center ${med.isPacked ? 'bg-primary border-primary' : 'border-border'}`}>
                                            {med.isPacked && <Check size={16} className="text-white"/>}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{med.name} <span className="text-xs text-muted-foreground">({med.dosage})</span></p>
                                            <p className="text-sm text-muted-foreground">Quantity: {med.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-border bg-muted/50">
                            {actionButtons[order.status]}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Main Page Component ---
const ShopOrdersPage = () => {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setSelectedOrder(null); // Close modal after action
    };

    const columns = {
        'New': orders.filter(o => o.status === 'New'),
        'Preparing': orders.filter(o => o.status === 'Preparing'),
        'Ready': orders.filter(o => o.status === 'Ready'),
    };
    
    return (
        <div className="h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Order Fulfillment
                </h1>
                <p className="text-muted-foreground mt-1">Verify prescriptions and manage your order workflow.</p>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 overflow-x-auto lg:overflow-x-hidden">
                {Object.entries(columns).map(([status, items]) => (
                    <div key={status} className="bg-card border border-border rounded-xl flex flex-col h-full min-w-[320px]">
                        <div className="p-4 border-b border-border">
                            <h2 className="font-semibold text-foreground">{status} <span className="text-sm ml-1 px-2 py-0.5 bg-muted rounded-full">{items.length}</span></h2>
                        </div>
                        <div className="p-4 space-y-4 overflow-y-auto">
                            {items.map(order => (
                                <OrderKanbanCard key={order.id} order={order} onSelect={setSelectedOrder} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedOrder && (
                    <OrderDetailModal 
                        order={selectedOrder} 
                        onClose={() => setSelectedOrder(null)}
                        updateOrderStatus={updateOrderStatus}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShopOrdersPage;