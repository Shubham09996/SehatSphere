import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Clock, IndianRupee, BriefcaseMedical, UserPlus, ClipboardList, FlaskConical, Droplet, ShieldCheck, TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'react-toastify';
import api from '../../utils/api';

// Reusable KPI Card Component (No gradient needed here as per image and previous instructions)
const KpiCard = ({ title, value, change, icon, color }) => (
    <motion.div 
        className="bg-card p-5 rounded-xl border border-border/70 shadow-sm hover:shadow-lg transition-shadow"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
        <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-muted-foreground">{title}</p>
            {/* KPI Card ke icon background ko gradient kar diya hai */}
            <div className={`p-2 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white`}>{icon}</div>
        </div>
        <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        {change && <p className={`text-xs font-semibold mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>}
    </motion.div>
);

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-2 rounded-md shadow-lg border border-border">
                <p className="text-xs text-muted-foreground">{label}</p>
                {payload.map(p => (
                    // CustomTooltip ke text par gradient lagaya hai
                    <p key={p.dataKey} className="font-semibold text-sm bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text">
                        {p.name}: {p.value?.toLocaleString ? p.value.toLocaleString() : p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const HospitalDashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/api/hospitals/dashboard-summary');
                setDashboardData(data);
                toast.success('Hospital dashboard data loaded successfully!');
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || err.message);
                // Optionally set dummy data if API fails to prevent empty dashboard
                setDashboardData({
                    kpis: {
                        onlineDoctors: { value: 0, change: '+0%' },
                        waitingPatients: { value: 0, change: '+0%' },
                        totalAppointments: { value: 0, change: '+0%' },
                        todayEarnings: { value: 0, change: '+0%' },
                    },
                    operationalInsights: {
                        doctorsOnline: 0,
                        patientsWaiting: 0,
                        totalAppointmentsToday: 0,
                        upcomingAppointments: 0,
                        tokenDistributionStatus: 'Normal',
                    },
                    financialInsights: {
                        todayRevenue: 0,
                        platformSubscriptionModel: 'Premium',
                        totalRevenue: 0,
                    },
                    appointmentStatusData: [
                        { name: 'Scheduled', value: 0 },
                        { name: 'Completed', value: 0 },
                        { name: 'Cancelled', value: 0 },
                        { name: 'Pending', value: 0 },
                    ],
                    monthlyRevenueData: [
                        { month: 'Jan', Revenue: 0 },
                        { month: 'Feb', Revenue: 0 },
                        { month: 'Mar', Revenue: 0 },
                        { month: 'Apr', Revenue: 0 },
                        { month: 'May', Revenue: 0 },
                        { month: 'Jun', Revenue: 0 },
                        { month: 'Jul', Revenue: 0 },
                    ],
                    patientFeedbackData: [],
                    fraudIncidentsData: [],
                    stockLevelsData: [],
                    doctors: [],
                    aiAssignment: {},
                    jobPostings: [],
                    roles: [],
                    tokenSystem: {},
                    labTests: [],
                    bloodBank: {},
                    insuranceIntegrations: [],
                    patients: [],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground p-8">Loading hospital dashboard...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    if (!dashboardData) {
        setDashboardData({
            kpis: {
                onlineDoctors: { value: 0, change: '+0%' },
                waitingPatients: { value: 0, change: '+0%' },
                totalAppointments: { value: 0, change: '+0%' },
                tokenDistribution: { value: 'N/A', change: '' },
                todayEarnings: { value: 0, change: '+0%' },
                platformSubscription: { value: 'N/A', change: '' },
                overallFinancial: { value: 'N/A', change: '' },
            },
            operationalInsights: {
                doctorsOnline: 0,
                patientsWaiting: 0,
                totalAppointmentsToday: 0,
                upcomingAppointments: 0,
                tokenDistributionStatus: 'Normal',
            },
            financialInsights: {
                todayRevenue: 0,
                platformSubscriptionModel: 'Premium',
                totalRevenue: 0,
            },
            appointmentStatusData: [
                { name: 'Scheduled', value: 400 },
                { name: 'Completed', value: 300 },
                { name: 'Cancelled', value: 200 },
                { name: 'Pending', value: 100 },
            ],
            monthlyRevenueData: [
                { month: 'Jan', Revenue: 4000 },
                { month: 'Feb', Revenue: 3000 },
                { month: 'Mar', Revenue: 2000 },
                { month: 'Apr', Revenue: 2780 },
                { month: 'May', Revenue: 1890 },
                { month: 'Jun', Revenue: 2390 },
                { month: 'Jul', Revenue: 3490 },
            ],
            patientFeedbackData: [
                { month: 'Jan', wait_time: 15 },
                { month: 'Feb', wait_time: 12 },
                { month: 'Mar', wait_time: 10 },
                { month: 'Apr', wait_time: 11 },
                { month: 'May', wait_time: 13 },
                { month: 'Jun', wait_time: 14 },
                { month: 'Jul', wait_time: 16 },
            ],
            fraudIncidentsData: [
                { type: 'Unauthorized Access', date: '2023-07-20', details: 'Attempted login from a suspicious IP' },
                { type: 'Suspicious Activity', date: '2023-07-21', details: 'Multiple failed login attempts from a single IP' },
                { type: 'Data Breach', date: '2023-07-22', details: 'Suspicious data export request' },
            ],
            stockLevelsData: [
                { item: 'Paracetamol', stock: 100 },
                { item: 'Ibuprofen', stock: 50 },
                { item: 'Aspirin', stock: 200 },
                { item: 'Vitamin C', stock: 75 },
            ],
            doctors: [
                { name: 'Dr. John Doe', specialty: 'Cardiology', status: 'Available' },
                { name: 'Dr. Jane Smith', specialty: 'Pediatrics', status: 'Unavailable' },
                { name: 'Dr. Bob Johnson', specialty: 'Orthopedics', status: 'Available' },
            ],
            aiAssignment: {
                status: 'Active',
                lastRun: '2023-07-24 10:30 AM',
            },
            jobPostings: [
                { title: 'Cardiologist', applicants: 5 },
                { title: 'Pediatric Nurse', applicants: 12 },
                { title: 'Lab Technician', applicants: 8 },
            ],
            roles: [
                { name: 'Doctor', permissions: ['view_patients', 'manage_appointments'] },
                { name: 'Receptionist', permissions: ['schedule_appointments', 'register_patients'] },
                { name: 'Admin Staff', permissions: ['manage_staff', 'view_analytics'] },
            ],
            tokenSystem: {
                status: 'Active',
            },
            labTests: [
                { name: 'Complete Blood Count', price: 500 },
                { name: 'Urine Analysis', price: 200 },
                { name: 'Thyroid Panel', price: 800 },
            ],
            bloodBank: {
                APositive: 100,
                BPositive: 80,
                OPositive: 120,
                ANegative: 30,
            },
            insuranceIntegrations: [
                { name: 'HealthSecure', status: 'Active' },
                { name: 'MediCare', status: 'Inactive' },
            ],
            patients: [
                { id: 1, name: 'Patient A', status: 'Waiting' },
                { id: 2, name: 'Patient B', status: 'Checked In' },
                { id: 3, name: 'Patient C', status: 'Discharged' },
            ],
        });
        return <div className="text-center text-muted-foreground p-8">No dashboard data available, loading dummy data...</div>;
    }

    const kpis = dashboardData.kpis || {
        onlineDoctors: { value: 0, change: '+0%' },
        waitingPatients: { value: 0, change: '+0%' },
        totalAppointments: { value: 0, change: '+0%' },
        tokenDistribution: { value: 'N/A', change: '' },
        todayEarnings: { value: 0, change: '+0%' },
        platformSubscription: { value: 'N/A', change: '' },
        overallFinancial: { value: 'N/A', change: '' },
    };

    const operationalInsights = dashboardData.operationalInsights || {
        doctorsOnline: 0,
        patientsWaiting: 0,
        totalAppointmentsToday: 0,
        upcomingAppointments: 0,
        tokenDistributionStatus: 'Normal',
    };

    const financialInsights = dashboardData.financialInsights || {
        todayRevenue: 0,
        platformSubscriptionModel: 'Premium',
        totalRevenue: 0,
    };

    const appointmentStatusData = dashboardData.appointmentStatusData || [
        { name: 'Scheduled', value: 400 },
        { name: 'Completed', value: 300 },
        { name: 'Cancelled', value: 200 },
        { name: 'Pending', value: 100 },
    ];
    const monthlyRevenueData = dashboardData.monthlyRevenueData || [
        { month: 'Jan', Revenue: 400000 },
        { month: 'Feb', Revenue: 300000 },
        { month: 'Mar', Revenue: 450000 },
        { month: 'Apr', Revenue: 380000 },
        { month: 'May', Revenue: 500000 },
        { month: 'Jun', Revenue: 420000 },
        { month: 'Jul', Revenue: 550000 },
    ];

    const patientFeedbackData = dashboardData.patientFeedbackData || [
        { month: 'Jan', wait_time: 15 },
        { month: 'Feb', wait_time: 12 },
        { month: 'Mar', wait_time: 10 },
        { month: 'Apr', wait_time: 11 },
        { month: 'May', wait_time: 13 },
        { month: 'Jun', wait_time: 14 },
        { month: 'Jul', wait_time: 16 },
    ];

    const fraudIncidentsData = dashboardData.fraudIncidentsData || [
        { type: 'Unauthorized Access', date: '2023-07-20', details: 'Attempted login from a suspicious IP' },
        { type: 'Suspicious Activity', date: '2023-07-21', details: 'Multiple failed login attempts from a single IP' },
        { type: 'Data Breach', date: '2023-07-22', details: 'Suspicious data export request' },
    ];

    const stockLevelsData = dashboardData.stockLevelsData || [
        { item: 'Paracetamol', stock: 100 },
        { item: 'Ibuprofen', stock: 50 },
        { item: 'Aspirin', stock: 200 },
        { item: 'Vitamin C', stock: 75 },
    ];

    const doctors = dashboardData.doctors || [];
    const aiAssignment = dashboardData.aiAssignment || {};
    const jobPostings = dashboardData.jobPostings || [];
    const roles = dashboardData.roles || [];
    const tokenSystem = dashboardData.tokenSystem || {};
    const labTests = dashboardData.labTests || [];
    const bloodBank = dashboardData.bloodBank || {};
    const insuranceIntegrations = dashboardData.insuranceIntegrations || [];
    const patients = dashboardData.patients || [];


    return (
        <motion.div 
            className="container mx-auto px-4 pt-4 pb-8 space-y-10" // === `py-8` ko `pt-4 pb-8` mein change kiya ===
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Section 1: Main Dashboard (Operational & Financial Insights) */}
            <section>
                {/* 1. Hospital Overview heading par gradient */}
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6">Hospital Overview</h1>
                <p className="text-muted-foreground mb-8">Real-time operational and financial insights for your hospital.</p>

                {/* Operational KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <KpiCard title="Doctors Online" value={operationalInsights.doctorsOnline} icon={<Stethoscope size={20}/>} color="green"/>
                    <KpiCard title="Patients Waiting" value={operationalInsights.patientsWaiting} icon={<Users size={20}/>} color="yellow"/>
                    <KpiCard title="Total Appointments" value={operationalInsights.totalAppointmentsToday} icon={<ClipboardList size={20}/>} color="blue"/>
                    <KpiCard title="Upcoming Appointments" value={operationalInsights.upcomingAppointments} icon={<Clock size={20}/>} color="indigo"/>
                </div>

                {/* Financial Insights */}
                {/* 2. Financial Insights heading par gradient */}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mt-10 mb-6">Financial Insights</h2>
                <p className="text-muted-foreground mb-8">Real-time financial performance and subscription details.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <KpiCard title="Today's Earnings" value={`₹${financialInsights.todayRevenue.toLocaleString()}`} icon={<IndianRupee size={20}/>} color="purple"/>
                    <KpiCard title="Subscription Model" value={financialInsights.platformSubscriptionModel} icon={<ShieldCheck size={20}/>} color="cyan"/>
                    <KpiCard title="Total Revenue" value={`₹${financialInsights.totalRevenue.toLocaleString()}`} icon={<TrendingUp size={20}/>} color="pink"/>
                </div>

                {/* Charts for Operational/Financial */} 
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4">Appointment Status</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                {/* 3. Pie chart cells ke colors ko gradient se replace kiya hai */}
                                <Pie data={appointmentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label >
                                    {appointmentStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#0891b2', '#22c55e', '#f97316', '#ef4444'][index % 4]} /> // Custom gradient-like colors
                                    ))}
                                </Pie>
                                {/* 4. Tooltip cursor ka color change kiya hai */}
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0891b2', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4">Monthly Revenue</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            {/* 5. Chart margin ko -20 se 0 kiya hai */}
                            <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                {/* 6. Tooltip cursor ka color change kiya hai */}
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0891b2', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                                {/* 7. Area chart ki line aur fill color ko gradient se replace kiya hai */}
                                <Area type="monotone" dataKey="Revenue" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRevenue)" />
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default HospitalDashboardPage;