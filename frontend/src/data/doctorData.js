export const doctorData = {
    doctorInfo: {
        name: 'Dr. Anjali Sharma',
        specialty: 'Cardiology',
    },
    dashboardStats: {
        totalPatients: { value: 24, change: '+5%' },
        avgConsultationTime: { value: '12 mins', change: '-8%' },
        pendingReports: { value: 4, change: '+2' },
    },
    appointmentQueue: [
        { 
            id: 'apt-01', 
            patient: { 
                name: 'Ravi Kumar', age: 34, pfp: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?&w=80&h=80&fit=crop',
                vitals: { bloodPressure: '128/85 mmHg', bloodSugar: '95 mg/dL' },
                allergies: ['Penicillin'],
            }, 
            time: '10:30 AM', token: 'T-05', reason: 'Follow-up Consultation', status: 'Now Serving' 
        },
        { 
            id: 'apt-02', 
            patient: { 
                name: 'Sunita Sharma', age: 45, pfp: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?&w=80&h=80&fit=crop',
                vitals: { bloodPressure: '135/88 mmHg', bloodSugar: '110 mg/dL' },
                allergies: ['None'],
            }, 
            time: '10:45 AM', token: 'T-06', reason: 'New Patient - Chest Pain', status: 'Up Next' 
        },
        { 
            id: 'apt-03', 
            patient: { 
                name: 'Amit Singh', age: 52, pfp: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?&w=80&h=80&fit=crop',
                vitals: { bloodPressure: '130/80 mmHg', bloodSugar: '102 mg/dL' },
                allergies: ['Dust Mites'],
            }, 
            time: '11:00 AM', token: 'T-07', reason: 'Blood Pressure Check', status: 'Waiting' 
        },
    ],
    hourlyActivity: [ // Data for the chart has been expanded
        { hour: '9AM', patients: 3 }, { hour: '10AM', patients: 5 },
        { hour: '11AM', patients: 4 }, { hour: '12PM', patients: 6 },
        { hour: '1PM', patients: 1 }, // Lunch Break
        { hour: '2PM', patients: 5 }, { hour: '3PM', patients: 7 },
        { hour: '4PM', patients: 4 },
    ]
};