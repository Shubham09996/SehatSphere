export const ordersData = [
    {
        id: 'RX-PAT-001',
        patientName: 'Ravi Kumar',
        pfp: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?&w=80&h=80&fit=crop',
        timestamp: new Date(new Date().getTime() - 5 * 60 * 1000), // 5 minutes ago
        status: 'New', // New, Preparing, Ready, Completed, Cancelled
        medicines: [
            { name: 'Aspirin', dosage: '81mg', quantity: 30, isPacked: false },
            { name: 'Atorvastatin', dosage: '20mg', quantity: 30, isPacked: false },
            { name: 'Metoprolol', dosage: '25mg', quantity: 60, isPacked: false },
        ],
        prescriptionImage: 'https://i.ibb.co/Yj2qf2b/prescription-mock.png',
    },
    {
        id: 'RX-PAT-002',
        patientName: 'Sunita Sharma',
        pfp: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?&w=80&h=80&fit=crop',
        timestamp: new Date(new Date().getTime() - 25 * 60 * 1000),
        status: 'Preparing',
        medicines: [
            { name: 'Isotretinoin', dosage: '10mg', quantity: 30, isPacked: true },
            { name: 'Clindamycin Gel', dosage: '1%', quantity: 1, isPacked: false },
        ],
        prescriptionImage: 'https://i.ibb.co/Yj2qf2b/prescription-mock.png',
    },
     {
        id: 'RX-PAT-003',
        patientName: 'Amit Singh',
        pfp: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?&w=80&h=80&fit=crop',
        timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
        status: 'Ready',
        medicines: [
            { name: 'Azithromycin', dosage: '500mg', quantity: 5, isPacked: true },
        ],
        prescriptionImage: 'https://i.ibb.co/Yj2qf2b/prescription-mock.png',
    },
];