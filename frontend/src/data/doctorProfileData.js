export const doctorProfileData = {
    personalInfo: {
        name: 'Dr. Anjali Sharma',
        pfp: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
        specialty: 'Cardiology',
        qualifications: 'MBBS, MD (Cardiology)',
        experience: 15, // in years
        bio: 'Dr. Anjali Sharma is a renowned cardiologist with 15 years of experience in treating complex heart conditions. She is dedicated to providing compassionate and comprehensive care to her patients.',
        isVerified: true,
    },
    performance: {
        totalPatients: 1250,
        consultationsThisMonth: 82,
        avgRating: 4.8,
        monthlyConsultations: [
            { month: 'May', count: 65 }, { month: 'Jun', count: 70 },
            { month: 'Jul', count: 78 }, { month: 'Aug', count: 75 },
            { month: 'Sep', count: 90 }, { month: 'Oct', count: 82 },
        ]
    },
    expertise: ['Coronary Artery Disease', 'Echocardiography', 'Heart Failure Management', 'Hypertension'],
    workSchedule: {
        Monday: '09:00 AM - 05:00 PM',
        Tuesday: '09:00 AM - 05:00 PM',
        Wednesday: '09:00 AM - 01:00 PM',
        Thursday: '09:00 AM - 05:00 PM',
        Friday: '09:00 AM - 05:00 PM',
        Saturday: '10:00 AM - 02:00 PM',
        Sunday: 'Off',
    },
    reviews: [
        { patientName: 'Ravi K.', rating: 5, comment: 'Very knowledgeable and explains everything clearly.' },
        { patientName: 'Sunita S.', rating: 4.5, comment: 'Good experience, waiting time was a bit long.' },
    ],
    clinicInfo: {
        name: 'City General Hospital',
        address: '123, Main Road, New Delhi, India',
    }
};