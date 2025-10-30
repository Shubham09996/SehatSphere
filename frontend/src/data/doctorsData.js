// Dummy data for hospitals, departments, doctors, and their detailed availability
export const hospitalData = [
    {
        id: 'hosp1',
        name: 'City General Hospital',
        location: 'New Delhi',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        departments: [
            {
                id: 'cardio', name: 'Cardiology', icon: 'Heart',
                doctors: [
                    {
                        id: 'doc1', name: 'Dr. Anjali Sharma', experience: 15, pfp: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=500&fit=crop',
                        schedule: {
                            "2025-10-20": [ { time: "09:00 AM", status: "available" }, { time: "09:30 AM", status: "booked" }, { time: "10:00 AM", status: "available" }, { time: "10:30 AM", status: "available" } ],
                            "2025-10-21": [ { time: "09:00 AM", status: "booked" }, { time: "09:30 AM", status: "available" }, { time: "10:00 AM", status: "booked" }, { time: "10:30 AM", status: "available" } ],
                            "2025-10-22": [ { time: "09:00 AM", status: "booked" }, { time: "09:30 AM", status: "booked" } ],
                            "2025-10-24": [ { time: "09:00 AM", status: "available" }, { time: "09:30 AM", status: "available" } ],
                        }
                    },
                    {
                        id: 'doc2', name: 'Dr. Vivek Mehra', experience: 12, pfp: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=500&fit=crop',
                        schedule: {
                            "2025-10-20": [ { time: "02:00 PM", status: "available" }, { time: "02:30 PM", status: "available" } ],
                            "2025-10-21": [ { time: "02:00 PM", status: "available" } ],
                            "2025-10-23": [ { time: "02:00 PM", status: "booked" }, { time: "02:30 PM", status: "available" } ],
                        }
                    }
                ]
            },
            {
                id: 'derma', name: 'Dermatology', icon: 'Sparkles',
                doctors: [
                    {
                        id: 'doc3', name: 'Dr. Rohan Verma', experience: 8, pfp: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16e?w=500&h=500&fit=crop',
                        schedule: {
                            "2025-10-20": [ { time: "11:00 AM", status: "available" }, { time: "11:30 AM", status: "available" } ],
                            "2025-10-23": [ { time: "11:00 AM", status: "available" }, { time: "11:30 AM", status: "booked" } ],
                        }
                    }
                ]
            }
        ]
    },
    {
        id: 'hosp2',
        name: 'Apollo Spectra',
        location: 'Gurugram',
        image: 'https://images.unsplash.com/photo-1616391182219-e080b4d1043a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        departments: [
            {
                id: 'neuro', name: 'Neurology', icon: 'Brain',
                doctors: [
                    {
                        id: 'doc4', name: 'Dr. Sunita Patel', experience: 20, pfp: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&h=500&fit=crop',
                        schedule: {
                            "2025-10-20": [ { time: "09:00 AM", status: "available" }, { time: "09:30 AM", status: "available" } ],
                            "2025-10-21": [ { time: "09:00 AM", status: "booked" }, { time: "09:30 AM", status: "booked" } ],
                        }
                    }
                ]
            }
        ]
    }
];