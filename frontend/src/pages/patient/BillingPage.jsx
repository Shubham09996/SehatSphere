import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, CreditCard, FileText, History, Shield } from 'lucide-react';
import { billingData } from '../../data/billingData';

// Import Tab Components
import InvoicesTab from '../../components/patient/billing/InvoicesTab';
import PaymentHistoryTab from '../../components/patient/billing/PaymentHistoryTab';
import PaymentMethodsTab from '../../components/patient/billing/PaymentMethodsTab';
import InsuranceTab from '../../components/patient/billing/InsuranceTab';

const tabs = [
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'history', label: 'Payment History', icon: History },
    { id: 'methods', label: 'Payment Methods', icon: CreditCard },
    { id: 'insurance', label: 'My Insurance', icon: Shield },
];

const BillingPage = () => {
    const [activeTab, setActiveTab] = useState('invoices');

    return (
        <div className="space-y-8 overflow-x-hidden">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Billing & Payments</h1>
                <p className="text-muted-foreground mt-1">Manage your invoices, payments, and insurance.</p>
            </div>

            {/* Overview Section */}
            <motion.div 
                className="flex flex-col md:flex-row items-center gap-6" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex-grow w-full bg-card p-6 rounded-xl border border-border">
                    <p className="text-muted-foreground">Outstanding Balance</p>
                    <p className="text-4xl font-bold text-foreground mt-2">₹{billingData.overview.outstandingBalance.toFixed(2)}</p>
                    <p className="text-sm text-red-500 mt-1">Next payment due on {new Date(billingData.overview.nextDueDate).toDateString()}</p>
                </div>
                <button className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-semibold rounded-lg flex items-center justify-center gap-2 px-6 py-2 whitespace-nowrap">
                    <IndianRupee size={16}/> Pay Now
                </button>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex flex-col md:flex-row border-b border-border">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        // === IS BUTTON KA STRUCTURE CHANGE KIYA HAI ===
                        className="relative px-4 py-3 text-sm font-semibold flex items-center gap-2 transition-colors text-muted-foreground hover:text-foreground"
                    >
                        {/* Icon (active state par solid color) */}
                        <span className={activeTab === tab.id ? 'text-primary' : ''}>
                            <tab.icon size={16}/>
                        </span>
                        {/* Label (active state par gradient) */}
                        <span className={activeTab === tab.id ? 'bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text' : ''}>
                            {tab.label}
                        </span>
                        
                        {activeTab === tab.id && <motion.div layoutId="billing-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end" />}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'invoices' && <InvoicesTab invoices={billingData.invoices} monthlySpend={billingData.monthlySpend} />}
                        {activeTab === 'history' && <PaymentHistoryTab history={billingData.paymentHistory} />}
                        {activeTab === 'methods' && <PaymentMethodsTab methods={billingData.savedMethods} />}
                        {activeTab === 'insurance' && <InsuranceTab insurance={billingData.insurance} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BillingPage;