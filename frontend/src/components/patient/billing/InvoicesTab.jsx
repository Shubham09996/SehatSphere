import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceDetailModal from './InvoiceDetailModal';

const statusStyles = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Due: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    Overdue: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const MonthlySpendChart = ({ data }) => {
    const maxAmount = Math.max(...data.map(d => d.amount), 2000); // Set a minimum max for better visualization
    return (
        <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">Monthly Spend</h3>
            <div className="flex justify-around items-end h-32">
                {data.map(item => (
                    <div key={item.month} className="flex flex-col items-center group">
                        <motion.div 
                            className="w-8 bg-primary/20 rounded-t-md group-hover:bg-primary/40"
                            initial={{ height: 0 }}
                            animate={{ height: `${(item.amount / maxAmount) * 100}%` }}
                            transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 100 }}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{item.month}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const InvoicesTab = ({ invoices, monthlySpend }) => {
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                {invoices.map(invoice => (
                    <motion.div 
                        key={invoice.id} 
                        onClick={() => setSelectedInvoice(invoice)}
                        className="bg-card p-4 border border-border rounded-xl flex justify-between items-center cursor-pointer hover:border-primary"
                        whileHover={{ scale: 1.02 }}
                        layout
                    >
                        <div>
                            <p className="font-bold text-foreground">{invoice.id}</p>
                            <p className="text-sm text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-foreground">₹{invoice.amount.toFixed(2)}</p>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[invoice.status]}`}>{invoice.status}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="lg:col-span-1">
                <MonthlySpendChart data={monthlySpend} />
            </div>

            <AnimatePresence>
                {selectedInvoice && (
                    <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default InvoicesTab;