export const notificationsData = [
    {
        id: 1,
        category: 'Appointment',
        icon: 'CalendarCheck',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Anjali Sharma is confirmed for Oct 15, 2025 at 10:30 AM.',
        timestamp: new Date(new Date().getTime() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        link: '/patient/appointments',
    },
    {
        id: 2,
        category: 'Lab Report',
        icon: 'TestTube2',
        title: 'New Lab Report Available',
        message: 'Your Lipid Profile test results are now available to view.',
        timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        link: '/patient/health-records',
    },
    {
        id: 3,
        category: 'Prescription',
        icon: 'Pill',
        title: 'New Prescription Added',
        message: 'Dr. Anjali Sharma has added a new prescription to your records.',
        timestamp: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        link: '/patient/prescriptions',
    },
    {
        id: 4,
        category: 'Alert',
        icon: 'ShieldAlert',
        title: 'System Update',
        message: 'Our privacy policy has been updated. Please review the changes.',
        timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isRead: true,
        link: '#',
    },
];