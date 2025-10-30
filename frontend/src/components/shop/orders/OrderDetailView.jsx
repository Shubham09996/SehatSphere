import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Package, Bell, FileText } from 'lucide-react';

const OrderDetailView = ({ order, updateOrderStatus, onBack }) => {
    const [medicines, setMedicines] = useState(order?.medicines || []);

    const togglePacked = (index) => {
        const newMedicines = [...medicines];
        newMedicines[index].isPacked = !newMedicines[index].isPacked;
        setMedicines(newMedicines);
    };

    if (!order) {
        return <div className="hidden md:flex items-center justify-center h-full bg-card border border-border rounded-xl shadow-sm"><p className="text-muted-foreground">Select an order to view details</p></div>;
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-card border border-border rounded-xl flex flex-col h-full shadow-sm"
        >
            <div className="p-4 border-b border-border flex items-center gap-4">
                <button onClick={onBack} className="md:hidden p-2 hover:bg-muted rounded-full"><ArrowLeft size={20}/></button>
                <div>
                    <h2 className="font-bold text-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">{order.patientName}</h2>
                    <p className="text-xs text-muted-foreground">{order.id}</p>
                </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
                <div className="p-6 border-b md:border-b-0 md:border-r border-border">
                    <h3 className="font-semibold mb-4">Prescription Details</h3>
                    <div className="bg-muted rounded-lg overflow-hidden"><img src={order.prescriptionImage} alt="Prescription"/></div>
                </div>

                <div className="p-6">
                    <h3 className="font-semibold mb-4">Medicines Checklist</h3>
                    <div className="space-y-3">
                        {medicines.map((med, i) => (
                             <div key={i} onClick={() => togglePacked(i)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${med.isPacked ? 'bg-green-500/10' : 'bg-muted'}`}>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${med.isPacked ? 'bg-primary border-primary' : 'border-border'}`}>
                                    {med.isPacked && <Check size={14} className="text-white"/>}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{med.name} <span className="text-xs text-muted-foreground">({med.dosage})</span></p>
                                    <p className="text-xs text-muted-foreground">Quantity: {med.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/50 flex flex-col sm:flex-row gap-3">
                {order.status === 'New' && <button onClick={() => updateOrderStatus(order.id, 'Preparing')} className="flex-1 font-bold py-2 px-4 rounded-lg bg-primary text-primary-foreground"><Check className="inline-block mr-2"/> Verify & Start Preparing</button>}
                {order.status === 'Preparing' && <button onClick={() => updateOrderStatus(order.id, 'Ready')} className="flex-1 font-bold py-2 px-4 rounded-lg bg-primary text-primary-foreground"><Package className="inline-block mr-2"/> Mark as Ready for Pickup</button>}
                {order.status === 'Ready' && (
                    <>
                        <button className="flex-1 font-semibold py-2 px-4 rounded-lg border border-border"><Bell className="inline-block mr-2"/> Notify Patient</button>
                        <button onClick={() => updateOrderStatus(order.id, 'Completed')} className="flex-1 font-bold py-2 px-4 rounded-lg bg-primary text-primary-foreground"><FileText className="inline-block mr-2"/> Generate Bill & Complete</button>
                    </>
                )}
            </div>
        </motion.div>
    );
};
export default OrderDetailView;