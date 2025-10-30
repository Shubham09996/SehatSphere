// Dummy data for health records
export const healthRecordsData = [
    {
        id: 'rec-001',
        type: 'Consultation',
        date: '2025-10-05',
        title: 'Consultation with Dr. Anjali Sharma',
        details: {
            doctorName: 'Dr. Anjali Sharma',
            specialty: 'Cardiology',
            hospital: 'City General Hospital',
            summary: 'Discussed recent chest pain. Advised to monitor blood pressure and prescribed new medication.',
            prescriptionId: 'rx-001', // Link to a prescription
        }
    },
    {
        id: 'rec-002',
        type: 'Lab Report',
        date: '2025-09-20',
        title: 'Lipid Profile Test',
        details: {
            reportName: 'Lipid Profile',
            labName: 'Max Labs',
            fileUrl: '#', // Placeholder for PDF link
            results: [
                { name: 'Total Cholesterol', value: '180 mg/dL', range: '< 200' },
                { name: 'Triglycerides', value: '150 mg/dL', range: '< 150' },
                { name: 'HDL Cholesterol', value: '45 mg/dL', range: '> 40' },
                { name: 'LDL Cholesterol', value: '110 mg/dL', range: '< 100' },
            ]
        }
    },
    {
        id: 'rec-003',
        type: 'Allergy',
        date: '2025-09-18',
        title: 'Added New Allergy: Penicillin',
        details: {
            allergen: 'Penicillin',
            severity: 'Moderate',
            reaction: 'Skin rash and hives.',
        }
    },
     {
        id: 'rec-004',
        type: 'Vaccination',
        date: '2024-11-10',
        title: 'Tetanus Toxoid (TT) Vaccine',
        details: {
            vaccineName: 'Tetanus Toxoid',
            dose: 'Booster',
            administeredBy: 'Nurse R. Singh',
        }
    },
];

// Dummy data for vital signs visualization
export const vitalsData = {
    bloodPressure: [
        { date: '2025-07-01', systolic: 120, diastolic: 80 },
        { date: '2025-08-05', systolic: 125, diastolic: 82 },
        { date: '2025-09-10', systolic: 122, diastolic: 78 },
        { date: '2025-10-05', systolic: 128, diastolic: 85 },
    ]
};