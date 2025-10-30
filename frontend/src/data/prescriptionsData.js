// Dummy data for prescriptions
export const prescriptionsData = [
    {
        id: 'rx-001',
        doctor: { name: 'Dr. Anjali Sharma', specialty: 'Cardiology', hospital: 'City General Hospital' },
        patient: { name: 'Ravi Kumar', age: 34 },
        issueDate: '2025-10-05',
        expiryDate: '2026-04-05', // Active
        medicines: [
            { name: 'Aspirin', dosage: '81mg', frequency: 'Once a day', duration: '90 days' },
            { name: 'Atorvastatin (Lipitor)', dosage: '20mg', frequency: 'Once at night', duration: '90 days' },
            { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice a day', duration: '60 days' },
        ],
        notes: 'Follow a low-sodium diet. Regular exercise is advised. Follow up in 3 months for a lipid profile check.'
    },
    {
        id: 'rx-002',
        doctor: { name: 'Dr. Rohan Verma', specialty: 'Dermatology', hospital: 'Apollo Spectra' },
        patient: { name: 'Ravi Kumar', age: 34 },
        issueDate: '2025-09-15',
        expiryDate: '2025-10-15', // Active
        medicines: [
            { name: 'Isotretinoin', dosage: '10mg', frequency: 'Once a day', duration: '30 days' },
            { name: 'Clindamycin Phosphate Gel', dosage: '1%', frequency: 'Apply locally at night', duration: '30 days' },
        ],
        notes: 'Avoid direct sun exposure. Use a non-comedogenic sunscreen. Stay hydrated.'
    },
    {
        id: 'rx-003',
        doctor: { name: 'Dr. Sameer Gupta', specialty: 'General Physician', hospital: 'City General Hospital' },
        patient: { name: 'Ravi Kumar', age: 34 },
        issueDate: '2024-08-20',
        expiryDate: '2024-08-27', // Expired
        medicines: [
            { name: 'Azithromycin', dosage: '500mg', frequency: 'Once a day', duration: '5 days' },
            { name: 'Paracetamol', dosage: '650mg', frequency: 'As needed for fever (SOS)', duration: '5 days' },
        ],
        notes: 'Complete the antibiotic course. Take adequate rest and fluids.'
    },
];