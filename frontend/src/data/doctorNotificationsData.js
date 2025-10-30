// Using the current date (October 9, 2025) to make timestamps realistic
export const doctorNotificationsData = [
    {
        id: 1,
        category: 'Report',
        icon: 'TestTube2',
        title: 'New Lab Report for Ravi Kumar',
        message: 'Lipid Profile test results are available for your review.',
        patientName: 'Ravi Kumar',
        timestamp: new Date('2025-10-09T19:35:00'), // A few minutes ago
        isRead: false,
        link: '/doctor/patients', // Link to patient page
    },
    {
        id: 2,
        category: 'Patient',
        icon: 'UserCheck',
        title: 'Patient Has Checked In',
        message: 'Sunita Sharma for the 10:45 AM appointment has arrived and is waiting.',
        patientName: 'Sunita Sharma',
        timestamp: new Date('2025-10-09T18:30:00'), // ~1 hour ago
        isRead: false,
        link: '/doctor/dashboard', // Link to dashboard queue
    },
    {
        id: 3,
        category: 'System',
        icon: 'ShieldAlert',
        title: 'System Maintenance Scheduled',
        message: 'A system-wide update is scheduled for this Sunday at 2:00 AM.',
        timestamp: new Date('2025-10-08T15:00:00'), // Yesterday
        isRead: true,
        link: '#',
    },
    {
        id: 4,
        category: 'Appointment',
        icon: 'CalendarX',
        title: 'Appointment Cancelled',
        message: 'An appointment for 4:00 PM today has been cancelled by the patient.',
        timestamp: new Date('2025-10-09T14:00:00'), // Earlier today
        isRead: true,
        link: '/doctor/schedule',
    },
];