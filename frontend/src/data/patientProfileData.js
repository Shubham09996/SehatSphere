export const patientProfileData = {
    personalInfo: {
        patientId: 'PID-102938', // NEW: Unique Patient ID
        name: 'Ravi Kumar',
        pfp: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        age: 34,
        dob: '1990-05-15',
        bloodGroup: 'O+',
        email: 'ravi.kumar@example.com',
        phone: '+91 98765 43210',
        emergencyContact: {
            name: 'Priya Kumar',
            relation: 'Wife',
            phone: '+91 98765 12345',
        },
    },
    quickStats: {
        upcomingAppointments: 2,
        activePrescriptions: 2,
        recordsCount: 4,
    },
    recentActivity: [
        { id: 'rec-001', type: 'Consultation', date: '2025-10-05', title: 'Consultation with Dr. A. Sharma' },
        { id: 'rec-002', type: 'Lab Report', date: '2025-09-20', title: 'Lipid Profile Test Results Added' },
        { id: 'rec-003', type: 'Allergy', date: '2025-09-18', title: 'New Allergy Added: Penicillin' },
    ],
    vitals: {
        bloodPressure: { value: '128/85', unit: 'mmHg', status: 'Slightly High' },
        bloodSugar: { value: '95', unit: 'mg/dL', status: 'Normal' },
        bmi: { value: '22.5', unit: '', status: 'Healthy Weight' },
        lastChecked: '2025-10-05',
    },
    criticalInfo: {
        allergies: ['Penicillin', 'Dust Mites'],
        chronicConditions: ['Hypertension (Stage 1)'],
    },
    insurance: {
        provider: 'Max Bupa Health Insurance',
        policyNumber: 'MB-123456789',
    }
};