export const adminData = {
    kpis: {
        totalUsers: { value: '12,580', change: '+250 this week' },
        activeHospitals: { value: 15, change: '+2 this month' },
        platformRevenue: { value: '₹5,80,000', change: '+12% this month' },
        pendingApprovals: { value: 4, change: '' },
    },
    userGrowth: [
        { month: 'May', Patients: 1200, Doctors: 20 },
        { month: 'Jun', Patients: 1800, Doctors: 25 },
        { month: 'Jul', Patients: 2500, Doctors: 30 },
        { month: 'Aug', Patients: 3200, Doctors: 38 },
        { month: 'Sep', Patients: 4100, Doctors: 45 },
        { month: 'Oct', Patients: 5200, Doctors: 55 },
    ],
    userDistribution: [
        { name: 'Patients', value: 10500 },
        { name: 'Doctors', value: 55 },
        { name: 'Shops', value: 45 },
        { name: 'Donors', value: 1980 },
    ],
    hospitalPerformance: [
        { name: 'City General Hospital', patientLoad: 'High', avgWaitTime: '25 min', rating: 4.8 },
        { name: 'Apollo Spectra', patientLoad: 'Medium', avgWaitTime: '15 min', rating: 4.9 },
        { name: 'Max Healthcare', patientLoad: 'High', avgWaitTime: '35 min', rating: 4.6 },
    ],
    // NEW: Detailed pending registrations with doctor-specific info
    pendingRegistrations: [
        { 
            id: 'doc-reg-01', 
            name: 'Dr. Vikram Singh', 
            role: 'Doctor', 
            timestamp: '5m ago',
            details: {
                specialty: 'Orthopedics',
                qualifications: 'MBBS, MS (Orthopedics)',
                registrationNumber: 'MCI-54321',
                email: 'vikram.singh@example.com'
            }
        },
        { 
            id: 'shp-reg-02', 
            name: 'Wellness Forever', 
            role: 'Pharmacy', 
            timestamp: '1h ago',
            details: {
                address: 'Gurugram, Sector 29',
                licenseNumber: 'PH-GUR-9876',
                contact: 'contact@wellness.com'
            }
        },
    ],
    systemAlerts: [
        { id: 'al-01', type: 'Fraud', message: 'Multiple logins detected for user PID-102938.', severity: 'High' },
        { id: 'al-02', type: 'System', message: 'Database CPU usage reached 90%.', severity: 'Medium' },
    ]
};