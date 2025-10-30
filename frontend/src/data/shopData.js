// Data for all shop-related features
export const shopData = {
    shopInfo: {
        name: 'Apollo Pharmacy',
        isPremium: true, // Set to true to see Premium view by default
    },
    dashboardStats: {
        revenueToday: { value: 15750, change: '+12%' },
        pendingOrders: { value: 8, change: '+2' },
        lowStockItems: { value: 5, change: '-1' },
        newCustomers: { value: 12, change: '+3%' },
    },
    newOrders: [
        { id: 'RX-PAT-001', patientName: 'Ravi Kumar', items: 3, timestamp: '5m ago', pfp: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?&w=80&h=80&fit=crop' },
        { id: 'RX-PAT-002', patientName: 'Sunita Sharma', items: 2, timestamp: '15m ago', pfp: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?&w=80&h=80&fit=crop' },
        { id: 'RX-PAT-003', patientName: 'Amit Singh', items: 1, timestamp: '45m ago', pfp: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?&w=80&h=80&fit=crop' },
    ],
    // Data for Premium Features (Analytics Page)
    salesLast7Days: [
        { day: 'Mon', sales: 12000 }, { day: 'Tue', sales: 18000 },
        { day: 'Wed', sales: 15000 }, { day: 'Thu', sales: 22000 },
        { day: 'Fri', sales: 19000 }, { day: 'Sat', sales: 25000 },
        { day: 'Sun', sales: 23000 },
    ],
    inventoryAlerts: [
        { name: 'Calpol 650', stock: 8, threshold: 10 },
        { name: 'Aspirin', stock: 15, threshold: 20 },
        { name: 'Atorvastatin', stock: 5, threshold: 10 },
    ],
    bestSellers: [
        { name: 'Dolo 650', unitsSold: 150 },
        { name: 'Meftal-Spas', unitsSold: 98 },
        { name: 'Azithromycin 500', unitsSold: 75 },
    ],
    aiStockForecast: [
        { medicineName: 'Paracetamol 500mg', trend: 'High Demand', runOutEstimate: '5 days' },
        { medicineName: 'Vitamin C Tabs', trend: 'Increasing', runOutEstimate: '7 days' },
    ],
    topCustomers: [
        { name: 'Ravi Kumar', spend: '₹2,500' },
        { name: 'Sunita Sharma', spend: '₹1,800' },
    ],
    profitability: {
        mostProfitableItem: 'Health-OK Multivitamins',
        margin: '+45%',
    }
};