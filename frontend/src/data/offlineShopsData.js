// Simulates affiliated offline pharmacies and their inventory
export const offlineShopsData = [
    {
        id: 'shop-01',
        name: 'Apollo Pharmacy',
        location: 'Connaught Place, New Delhi',
        affiliatedHospital: 'City General Hospital',
        phone: '+919876543210',
        timings: 'Open 24 Hours',
        inventory: ['med-001', 'med-002'], // Medicine IDs they stock
        // NEW: Image added for the shop
        image: 'https://www.cityairnews.com/uploads/images/image-750x-2022-09-19-05:59:27pm-632860a7c7706.jpg',
    },
    {
        id: 'shop-02',
        name: 'Wellness Forever',
        location: 'Gurugram, Sector 29',
        affiliatedHospital: 'Apollo Spectra',
        phone: '+919123456789',
        timings: '8:00 AM - 11:00 PM',
        inventory: ['med-003', 'med-001'],
        // NEW: Image added for the shop
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi1Wcxa8Br3rf_yE0II0l3HiO-eY4OKzHc3w&s',
    },
    {
        id: 'shop-03',
        name: 'Garg Dawa Bazaar',
        location: 'Karol Bagh, New Delhi',
        affiliatedHospital: 'City General Hospital',
        phone: '+919988776655',
        timings: '9:00 AM - 10:00 PM',
        inventory: ['med-002'],
        // NEW: Image added for the shop
        image: 'https://content.jdmagicbox.com/v2/comp/delhi/u9/011pxx11.xx11.220322123211.s4u9/catalogue/-045oaaj168.jpg',
    },
];