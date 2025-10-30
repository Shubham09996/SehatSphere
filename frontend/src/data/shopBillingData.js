export const shopBillingData = {
    stats: {
        totalRevenue: { value: 245600, period: 'This Month' },
        pendingPayments: { value: 1570, count: 1 },
        newInvoices: { value: 8, period: 'Today' },
    },
    revenueProfitData: [
        { date: 'Oct 01', revenue: 4500, profit: 1200 },
        { date: 'Oct 02', revenue: 6200, profit: 1800 },
        { date: 'Oct 03', revenue: 5500, profit: 1500 },
        { date: 'Oct 04', revenue: 8900, profit: 2500 },
        { date: 'Oct 05', revenue: 7200, profit: 2100 },
        { date: 'Oct 06', revenue: 9500, profit: 2800 },
        { date: 'Oct 07', revenue: 11000, profit: 3200 },
    ],
    invoices: [
        { id: 'INV-2025-001', patientName: 'Ravi Kumar', pfp: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?&w=80&h=80&fit=crop', issueDate: '2025-10-05', amount: 1500.00, status: 'Pending' },
        { id: 'INV-2025-002', patientName: 'Sunita Sharma', pfp: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?&w=80&h=80&fit=crop', issueDate: '2025-09-15', amount: 850.00, status: 'Paid' },
        { id: 'INV-2025-003', patientName: 'Amit Singh', pfp: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?&w=80&h=80&fit=crop', issueDate: '2025-08-10', amount: 2500.00, status: 'Overdue' },
    ],
};