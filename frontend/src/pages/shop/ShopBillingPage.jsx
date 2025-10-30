import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Clock, FilePlus, Search, MoreHorizontal, Eye, Send, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { shopBillingData } from '../../data/shopBillingData';

// FIXED: Complete definition for StatCard
const StatCard = ({ icon, title, value, period, color }) => (
    <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>{icon}</div>
            <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        </div>
        <p className="text-3xl font-bold text-foreground mt-4">{value}</p>
        <p className="text-xs text-muted-foreground">{period}</p>
    </div>
);

// FIXED: Complete definition for StatusBadge
const StatusBadge = ({ status }) => {
    const styles = {
        Paid: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        Pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        Overdue: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status]}`}>{status}</span>;
};


const ShopBillingPage = () => {
    const [invoices, setInvoices] = useState(shopBillingData.invoices);
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Billing & Invoicing
                </h1>
                <p className="text-muted-foreground mt-1">Create, manage, and track all your invoices.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Revenue vs. Profit</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer>
                            <AreaChart data={shopBillingData.revenueProfitData} margin={{ left: -20, top: 10, right: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/></linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="profit" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <StatCard icon={<IndianRupee size={20}/>} title="Total Revenue" value={`₹${shopBillingData.stats.totalRevenue.value.toLocaleString('en-IN')}`} period={shopBillingData.stats.totalRevenue.period} color="green"/>
                    <StatCard icon={<Clock size={20}/>} title="Pending Payments" value={`₹${shopBillingData.stats.pendingPayments.value.toLocaleString('en-IN')}`} period={`${shopBillingData.stats.pendingPayments.count} Invoices`} color="orange"/>
                    <StatCard icon={<FilePlus size={20}/>} title="New Invoices" value={shopBillingData.stats.newInvoices.value} period={shopBillingData.stats.newInvoices.period} color="blue"/>
                </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                     <h3 className="font-bold text-lg text-foreground">All Invoices</h3>
                    <div className="flex gap-2">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input type="text" placeholder="Search by name or ID..." onChange={e => setSearchTerm(e.target.value)} className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm"/>
                        </div>
                        <button className="flex items-center gap-2 font-semibold py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm"><FilePlus size={16}/> Create Invoice</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="text-xs text-muted-foreground bg-muted/50">
                            <tr>
                                <th className="p-3">Invoice ID</th><th className="p-3">Patient</th>
                                <th className="p-3">Date</th><th className="p-3">Amount</th>
                                <th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.filter(inv => inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || inv.id.toLowerCase().includes(searchTerm.toLowerCase())).map(invoice => (
                                <tr key={invoice.id} className="border-b border-border">
                                    <td className="p-3 font-mono text-primary text-sm">{invoice.id}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <img src={invoice.pfp} alt={invoice.patientName} className="w-8 h-8 rounded-full"/>
                                            <span className="font-semibold text-foreground text-sm">{invoice.patientName}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-muted-foreground text-sm">{invoice.issueDate}</td>
                                    <td className="p-3 font-semibold text-foreground">₹{invoice.amount.toFixed(2)}</td>
                                    <td className="p-3"><StatusBadge status={invoice.status} /></td>
                                    <td className="p-3 text-right">
                                        <div className="relative inline-block" ref={menuRef}>
                                            <button onClick={() => setOpenMenuId(openMenuId === invoice.id ? null : invoice.id)} className="p-1 hover:bg-muted rounded-full text-muted-foreground">
                                                <MoreHorizontal size={18}/>
                                            </button>
                                            <AnimatePresence>
                                            {openMenuId === invoice.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-md shadow-lg z-20"
                                                >
                                                    <div className="p-1">
                                                        <button onClick={() => {setSelectedInvoice(invoice); setOpenMenuId(null);}} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"><Eye size={14}/> View Details</button>
                                                        <button className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"><Send size={14}/> Send Reminder</button>
                                                        <button className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"><Download size={14}/> Download PDF</button>
                                                    </div>
                                                </motion.div>
                                            )}
                                            </AnimatePresence>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {selectedInvoice && (
                    <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShopBillingPage;