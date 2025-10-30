export const securityData = {
    securityScore: 85, // out of 100
    auditLog: [
        { id: 1, event: 'Successful Login', user: 'Dr. A. Sharma', ip: '103.22.201.15', timestamp: '2m ago', status: 'Success' },
        { id: 2, event: 'Failed Login Attempt', user: 'admin@health.com', ip: '192.168.1.10', timestamp: '15m ago', status: 'Failed' },
        { id: 3, event: 'Password Changed', user: 'PID-102938', ip: '115.98.2.14', timestamp: '1h ago', status: 'Success' },
        { id: 4, event: 'New Device Login', user: 'shop@apollo.com', ip: '223.178.12.9', timestamp: '3h ago', status: 'Info' },
    ],
    activeSessions: [
        { id: 'sess-1', user: 'Dr. A. Sharma', device: 'Chrome on Windows', ip: '103.22.201.15', location: 'New Delhi, IN' },
        { id: 'sess-2', user: 'PID-102938', device: 'Safari on iPhone', ip: '115.98.2.14', location: 'Mumbai, IN' },
    ]
};