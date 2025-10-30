export const patientsData = [
    {
        id: 'PID-102938',
        name: 'Ravi Kumar',
        pfp: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?&w=100&h=100&fit=crop',
        age: 34,
        gender: 'Male',
        lastVisit: '2025-10-05',
        status: 'Active',
        contact: { phone: '+91 98765 43210', email: 'ravi.k@example.com' },
        criticalInfo: { allergies: ['Penicillin'], chronicConditions: ['Hypertension'] },
        recentVitals: { bloodPressure: '128/85 mmHg', bloodSugar: '95 mg/dL' },
        recentActivity: [
            { date: '2025-10-05', title: 'Consultation for Chest Pain' },
            { date: '2025-09-20', title: 'Lipid Profile Report Added' },
        ]
    },
    {
        id: 'PID-102939',
        name: 'Sunita Sharma',
        pfp: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?&w=100&h=100&fit=crop',
        age: 45,
        gender: 'Female',
        lastVisit: '2025-10-02',
        status: 'Needs Follow-up',
        contact: { phone: '+91 91234 56789', email: 'sunita.s@example.com' },
        criticalInfo: { allergies: ['None'], chronicConditions: ['Diabetes Type 2'] },
        recentVitals: { bloodPressure: '135/88 mmHg', bloodSugar: '140 mg/dL' },
        recentActivity: [
            { date: '2025-10-02', title: 'Consultation for Diabetes Management' },
            { date: '2025-09-15', title: 'HbA1c Test Report Added' },
        ]
    },
    {
        id: 'PID-102940',
        name: 'Amit Singh',
        pfp: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?&w=100&h=100&fit=crop',
        age: 52,
        gender: 'Male',
        lastVisit: '2025-09-28',
        status: 'Active',
        contact: { phone: '+91 99887 76655', email: 'amit.singh@example.com' },
        criticalInfo: { allergies: ['Dust Mites'], chronicConditions: ['None'] },
        recentVitals: { bloodPressure: '130/80 mmHg', bloodSugar: '102 mg/dL' },
        recentActivity: [
            { date: '2025-09-28', title: 'Consultation for Seasonal Allergy' },
        ]
    },
];