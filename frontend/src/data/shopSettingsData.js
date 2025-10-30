export const shopSettingsData = {
    profile: {
        name: 'Apollo Pharmacy',
        address: '123, Connaught Place, New Delhi',
        phone: '+91 98765 43210',
        email: 'contact@apollopharmacy.com',
        logo: 'https://cdn.iconscout.com/icon/free/png-256/free-apollo-3442115-2878122.png',
    },
    openingHours: {
        Monday: { from: '08:00', to: '23:00', enabled: true },
        Tuesday: { from: '08:00', to: '23:00', enabled: true },
        Wednesday: { from: '08:00', to: '23:00', enabled: true },
        Thursday: { from: '08:00', to: '23:00', enabled: true },
        Friday: { from: '08:00', to: '23:00', enabled: true },
        Saturday: { from: '09:00', to: '22:00', enabled: true },
        Sunday: { from: '', to: '', enabled: false },
    },
    subscription: {
        plan: 'Premium', // or 'Free'
        price: 999, // per month
        nextBillingDate: '2025-11-01',
    },
    staff: [
        { id: 'stf-01', name: 'Ramesh Singh', role: 'Pharmacist', pfp: 'https://avatar.iran.liara.run/public/boy' },
        { id: 'stf-02', name: 'Sita Devi', role: 'Cashier', pfp: 'https://avatar.iran.liara.run/public/girl' },
    ],
};