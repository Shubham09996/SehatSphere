import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ShoppingBag, TrendingUp, Users, Package, Wallet, BellRing } from 'lucide-react';
import api from '../../utils/api'; // api.js se import karein
import { Link, useOutletContext } from 'react-router-dom';
import SalesAnalyticsChart from '../../components/shop/widgets/SalesAnalyticsChart';
import PremiumInsights from '../../components/shop/widgets/PremiumInsights';

// Reusable StatCard component (no changes)
const StatCard = ({ icon, title, value, change, colorClass }) => (
    <motion.div 
        className="bg-card p-5 rounded-xl border border-border/70 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-muted-foreground">{title}</p>
            <div className={`p-2 rounded-lg ${colorClass}`}>{icon}</div>
        </div>
        <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        {change && <p className={`text-xs font-semibold mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change} vs yesterday</p>}
    </motion.div>
);

const ShopDashboardPage = () => {
    const { isPremium } = useOutletContext();
    const [shopInfo, setShopInfo] = useState(null);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [newOrders, setNewOrders] = useState([]);
    const [salesAnalyticsData, setSalesAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShopDashboardData = async () => {
            try {
                setLoading(true);
                const [dashboardRes, newOrdersRes, salesAnalyticsRes] = await Promise.all([
                    api.get(`/shops/${shopId}/dashboard`),
                    api.get(`/shops/${shopId}/orders/new`),
                    api.get(`/shops/${shopId}/analytics/sales`),
                ]);

                setDashboardStats(dashboardRes.data);
                setNewOrders(newOrdersRes.data.newOrders);
                setSalesAnalyticsData(salesAnalyticsRes.data.salesAnalytics);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchShopDashboardData();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground">Loading shop dashboard...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading dashboard: {error.message}</div>;
    }

    if (!shopInfo || !dashboardStats || !newOrders || !salesAnalyticsData) {
        return <div className="text-center text-muted-foreground">No shop dashboard data found.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="pt-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Welcome back, {shopInfo.name}!</h1>
                <p className="text-muted-foreground mt-1">Here is your shop's performance overview for today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<IndianRupee size={20}/>} title="Today's Revenue" value={`₹${dashboardStats.revenueToday.value.toLocaleString('en-IN')}`} change={dashboardStats.revenueToday.change} colorClass="bg-green-500/20 text-green-500"/>
                <StatCard icon={<ShoppingCart size={20}/>} title="Pending Orders" value={dashboardStats.pendingOrders.value} change={`+${dashboardStats.pendingOrders.change}`} colorClass="bg-orange-500/20 text-orange-500"/>
                <StatCard icon={<PackageMinus size={20}/>} title="Low Stock Items" value={dashboardStats.lowStockItems.value} change={dashboardStats.lowStockItems.change} colorClass="bg-red-500/20 text-red-500"/>
                <StatCard icon={<Users size={20}/>} title="New Customers" value={dashboardStats.newCustomers.value} change={dashboardStats.newCustomers.change} colorClass="bg-blue-500/20 text-blue-500"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column: Core Operations & Analytics --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* UPDATED: New Orders list is now on top */}
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4">New Orders for Verification</h3>
                        <div className="space-y-4">
                            {newOrders.map(order => (
                                <motion.div whileHover={{ scale: 1.01 }} key={order._id} className="flex items-center justify-between gap-4 bg-muted p-3 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <img src={order.patientPfp || "https://via.placeholder.com/36"} alt={order.patientName} className="w-9 h-9 rounded-full"/>
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">{order.patientName}</p>
                                            <p className="text-xs text-muted-foreground">{order._id} • {order.items.length} items</p>
                                        </div>
                                    </div>
                                    <button className="font-semibold py-2 px-3 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90">Verify</button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* UPDATED: Analytics chart is now below */}
                    {salesAnalyticsData && (
                        <SalesAnalyticsChart 
                            isPremium={isPremium} 
                            salesData={salesAnalyticsData.salesLast7Days}
                            totalRevenue={salesAnalyticsData.totalRevenue}
                            percentageChange={salesAnalyticsData.percentageChange}
                        />
                    )}

                </div>

                {/* --- Right Column: Premium Insights --- */}
                <div className="lg:col-span-1 space-y-8">
                    <PremiumInsights isPremium={isPremium} />
                </div>
            </div>
        </div>
    );
};

export default ShopDashboardPage;