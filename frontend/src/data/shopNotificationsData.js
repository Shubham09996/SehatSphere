export const shopNotificationsData = [
    {
        id: 1,
        category: 'Order',
        icon: 'ShoppingCart',
        title: 'New Prescription Order Received',
        message: 'Order #RX-PAT-004 from Priya Jain is awaiting verification.',
        timestamp: new Date(), // Just now
        isRead: false,
        link: '/shop/orders',
    },
    {
        id: 2,
        category: 'Inventory',
        icon: 'PackageMinus',
        title: 'Low Stock Alert',
        message: 'Stock for "Calpol 650" is running low. Only 8 units left.',
        timestamp: new Date(new Date().getTime() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        link: '/shop/inventory',
    },
    {
        id: 3,
        category: 'System',
        icon: 'BarChart2',
        title: 'Weekly Sales Summary',
        message: 'Your weekly sales report is ready to view in the Analytics tab.',
        timestamp: new Date(new Date().getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        isRead: true,
        link: '/shop/analytics',
    },
    {
        id: 4,
        category: 'Order',
        icon: 'PackageCheck',
        title: 'Order Completed',
        message: 'Order #RX-PAT-001 for Ravi Kumar has been marked as completed.',
        timestamp: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        link: '/shop/orders',
    },
];