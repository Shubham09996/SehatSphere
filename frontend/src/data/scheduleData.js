// Function to create a date object for today + offset
const createDate = (dayOffset, hour, minute) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d;
};

export const scheduleData = [
    {
        id: 'apt-101',
        patientName: 'Ravi Kumar',
        reason: 'Follow-up Consultation',
        type: 'Follow-up', // For color coding
        start: createDate(0, 10, 30), // Today at 10:30 AM
        end: createDate(0, 11, 0),   // Today at 11:00 AM
    },
    {
        id: 'apt-102',
        patientName: 'Sunita Sharma',
        reason: 'New Patient - General Checkup',
        type: 'New Patient',
        start: createDate(0, 11, 0),
        end: createDate(0, 11, 45),
    },
    {
        id: 'block-1',
        patientName: 'Lunch Break',
        reason: 'Personal Time',
        type: 'Blocked',
        start: createDate(0, 13, 0),
        end: createDate(0, 14, 0),
    },
    {
        id: 'apt-103',
        patientName: 'Amit Singh',
        reason: 'Blood Pressure Check',
        type: 'Follow-up',
        start: createDate(1, 9, 30), // Tomorrow
        end: createDate(1, 10, 0),
    },
     {
        id: 'apt-104',
        patientName: 'Priya Jain',
        reason: 'Routine Checkup',
        type: 'New Patient',
        start: createDate(-1, 14, 0), // Yesterday
        end: createDate(-1, 14, 30),
    },
];