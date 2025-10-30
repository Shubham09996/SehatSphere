// Function to generate dummy activity data for the last 90 days
const generateDailyActivity = () => {
    const data = [];
    for (let i = 90; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            actions: Math.floor(Math.random() * 20), // Random number of admin actions
        });
    }
    return data;
};

export const adminProfileData = {
    personalInfo: {
        name: 'Admin User',
        pfp: 'https://avatar.iran.liara.run/public/admin',
        role: 'Super Administrator',
        memberSince: '2024-01-01',
    },
    // Data for Sparkline Stats
    performance: {
        usersManaged: { value: '12.5k+', change: '+250', data: [5, 6, 8, 7, 9, 11, 12].map(v => ({ value: v })) },
        approvalsDone: { value: '150+', change: '+12', data: [8, 10, 9, 12, 15, 18, 14].map(v => ({ value: v })) },
        ticketsResolved: { value: '98%', change: '+2%', data: [90, 92, 91, 93, 95, 94, 98].map(v => ({ value: v })) },
    },
    // Data for Activity Heatmap
    dailyActivity: generateDailyActivity(),
    // Data for Achievements
    achievements: [
        { id: 1, name: 'Top Performer', icon: 'Award', description: 'Highest activity in a month', achieved: true },
        { id: 2, name: 'Guardian', icon: 'ShieldCheck', description: 'Resolved 50+ security alerts', achieved: true },
        { id: 3, name: 'Gatekeeper', icon: 'UserCheck', description: 'Approved 100+ new users', achieved: true },
        { id: 4, name: 'System Stabilizer', icon: 'GitBranch', description: 'Maintained 99.9% uptime', achieved: false },
    ],
    recentLog: [
        { id: 1, action: 'Approved Dr. Vikram Singh', timestamp: '5m ago', icon: 'UserCheck' },
        { id: 2, action: 'Suspended user PID-102939', timestamp: '1h ago', icon: 'UserX' },
        { id: 3, action: 'Generated monthly platform report', timestamp: '3h ago', icon: 'FileText' },
    ]
};