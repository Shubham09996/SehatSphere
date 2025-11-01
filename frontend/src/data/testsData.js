// Mock data for patient diagnostic tests
export const bookedTests = [
    {
        id: 'bt-001',
        testName: 'Complete Blood Count (CBC)',
        labName: 'Max Labs, Sector 14',
        scheduledDate: '2025-11-05',
        scheduledTime: '10:30 AM',
        status: 'Scheduled',
        bookingRef: 'BK-CBC-7843'
    },
    {
        id: 'bt-002',
        testName: 'Fasting Blood Sugar (FBS)',
        labName: 'City Diagnostics',
        scheduledDate: '2025-11-08',
        scheduledTime: '08:00 AM',
        status: 'Pending Sample',
        bookingRef: 'BK-FBS-2289'
    },
    {
        id: 'bt-003',
        testName: 'Liver Function Test (LFT)',
        labName: 'HealthFirst Lab',
        scheduledDate: '2025-11-10',
        scheduledTime: '12:15 PM',
        status: 'Confirmed',
        bookingRef: 'BK-LFT-5521'
    }
];

export const testReports = [
    {
        id: 'tr-001',
        testName: 'Lipid Profile',
        labName: 'Max Labs, Sector 14',
        reportedOn: '2025-10-20',
        summary: 'LDL slightly elevated. Advise diet + activity.',
        fileUrl: '#',
        results: [
            { name: 'Total Cholesterol', value: '198 mg/dL', range: '< 200' },
            { name: 'LDL', value: '126 mg/dL', range: '< 100' },
            { name: 'HDL', value: '46 mg/dL', range: '> 40' }
        ]
    },
    {
        id: 'tr-002',
        testName: 'Thyroid Profile (T3, T4, TSH)',
        labName: 'City Diagnostics',
        reportedOn: '2025-10-05',
        summary: 'TSH within normal limits.',
        fileUrl: '#',
        results: [
            { name: 'TSH', value: '2.6 uIU/mL', range: '0.4 - 4.0' }
        ]
    },
    {
        id: 'tr-003',
        testName: 'Vitamin D (25-OH)',
        labName: 'HealthFirst Lab',
        reportedOn: '2025-09-18',
        summary: 'Insufficient levels; supplementation recommended.',
        fileUrl: '#',
        results: [
            { name: '25-OH Vit D', value: '22 ng/mL', range: '30 - 100' }
        ]
    }
];



