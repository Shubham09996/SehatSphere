export const billingData = {
    overview: {
        outstandingBalance: 1570.00,
        nextDueDate: '2025-10-25',
    },
    invoices: [
        {
            id: 'INV-2025-001', amount: 1500.00, issueDate: '2025-10-05', dueDate: '2025-10-20', status: 'Due',
            items: [
                { description: 'Cardiology Consultation - Dr. A. Sharma', cost: 800.00 },
                { description: 'Lipid Profile Test', cost: 700.00 },
            ],
            hospital: 'City General Hospital', patient: 'Ravi Kumar',
        },
        {
            id: 'INV-2025-002', amount: 850.00, issueDate: '2025-09-15', dueDate: '2025-09-30', status: 'Paid',
            items: [
                { description: 'Dermatology Consultation - Dr. R. Verma', cost: 600.00 },
                { description: 'Prescribed Ointment', cost: 250.00 },
            ],
             hospital: 'Apollo Spectra', patient: 'Ravi Kumar',
        },
        {
            id: 'INV-2025-003', amount: 70.00, issueDate: '2025-09-12', dueDate: '2025-09-27', status: 'Paid',
            items: [
                { description: 'Pharmacy Purchase - Calpol 650 x2', cost: 70.00 },
            ],
             hospital: 'Apollo Pharmacy', patient: 'Ravi Kumar',
        },
    ],
    paymentHistory: [
        { id: 'TRN-001', date: '2025-09-18', amount: 850.00, method: 'Credit Card **** 1234', status: 'Successful' },
        { id: 'TRN-002', date: '2025-09-12', amount: 70.00, method: 'UPI', status: 'Successful' },
    ],
    savedMethods: [
        { id: 'card-01', type: 'Visa', last4: '1234', expiry: '12/28' },
        { id: 'card-02', type: 'Mastercard', last4: '5678', expiry: '08/26' },
    ],
    insurance: {
        provider: 'Max Bupa Health Insurance',
        policyNumber: 'MB-123456789',
        validTill: '2026-12-31',
        coverage: '80% for hospitalizations, 50% for OPD',
    },
    monthlySpend: [
        { month: 'Jul', amount: 500 },
        { month: 'Aug', amount: 1200 },
        { month: 'Sep', amount: 920 },
        { month: 'Oct', amount: 1500 },
    ]
};