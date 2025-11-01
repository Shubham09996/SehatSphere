import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building, IndianRupee, UserPlus, Check, X, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'react-toastify'; // NEW: Import toast
// import { adminData } from '../../data/adminData'; // Remove this import
import PendingApprovals from '../../components/admin/widgets/PendingApprovals';
import SystemAlerts from '../../components/admin/widgets/SystemAlerts';
import api from '../../utils/api'; // api.js se import karein

// --- Reusable Components for this Page ---

const KpiCard = ({ title, value, change, icon, color }) => (
    <motion.div 
        className="bg-card p-5 rounded-xl border border-border/70 shadow-sm hover:shadow-lg transition-shadow"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
        <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-muted-foreground">{title}</p>
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>{icon}</div>
        </div>
        <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        {change && <p className={`text-xs font-semibold mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>}
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-2 rounded-md shadow-lg border border-border">
                <p className="text-xs text-muted-foreground">{label}</p>
                {payload.map(p => (
                    <p key={p.dataKey} style={{ color: p.stroke }} className="font-semibold text-sm">
                        {p.dataKey}: {p.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- Main Admin Dashboard Page ---
const AdminDashboardPage = () => {
    const [kpis, setKpis] = useState(null);
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [userDistributionData, setUserDistributionData] = useState([]);
    const [pendingApprovalsData, setPendingApprovalsData] = useState([]);
    const [systemAlertsData, setSystemAlertsData] = useState([]);
    const [hospitalPerformanceData, setHospitalPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = ['hsl(var(--primary))', '#00C49F', '#FFBB28', '#FF8042'];
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchAdminDashboardData = async () => {
            try {
                setLoading(true);
                const [kpisRes, userGrowthRes, userDistributionRes, pendingApprovalsRes, systemAlertsRes, hospitalPerformanceRes] = await Promise.all([
                    api.get('/api/admin/kpis'),
                    api.get('/api/admin/user-growth'),
                    api.get('/api/admin/user-distribution'),
                    api.get('/api/admin/pending-approvals'),
                    api.get('/api/admin/alerts'),
                    api.get('/api/admin/hospital-performance'),
                ]);

                setKpis(kpisRes.data);
                setUserGrowthData(userGrowthRes.data);
                setUserDistributionData(userDistributionRes.data);
                setPendingApprovalsData(pendingApprovalsRes.data.doctors.concat(pendingApprovalsRes.data.shops));
                setSystemAlertsData(systemAlertsRes.data);
                setHospitalPerformanceData(hospitalPerformanceRes.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminDashboardData();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground">Loading admin dashboard...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading dashboard: {error.message}</div>;
    }

    // Ensure all data is loaded before rendering, or provide fallback
    if (!kpis || !userGrowthData || !userDistributionData || !pendingApprovalsData || !systemAlertsData || !hospitalPerformanceData) {
        return <div className="text-center text-muted-foreground">No admin dashboard data found.</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                 <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Platform Overview
                </h1>
                <p className="text-muted-foreground mt-1">Real-time analytics and management for HealthSphere.</p>
            </div>

            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                <KpiCard title="Total Users" value={kpis.totalUsers.value} change={kpis.totalUsers.change} icon={<Users size={20}/>} color="blue"/>
                <KpiCard title="Active Hospitals" value={kpis.activeHospitals.value} change={kpis.activeHospitals.change} icon={<Building size={20}/>} color="green"/>
                <KpiCard title="Platform Revenue" value={kpis.platformRevenue.value} change={kpis.platformRevenue.change} icon={<IndianRupee size={20}/>} color="sky"/>
                <KpiCard title="Pending Approvals" value={kpis.pendingApprovals.value} icon={<UserPlus size={20}/>} color="orange"/>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">User Growth</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer>
                            <AreaChart data={userGrowthData} margin={{ left: -20, top: 10, right: 10, bottom: 0 }}>
                                 <defs><linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                 <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                 <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                 <Tooltip content={<CustomTooltip />} />
                                 <Area type="monotone" dataKey="Patients" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorGrowth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-1 bg-card p-6 rounded-xl border border-border/70 shadow-sm relative">
                     <h3 className="font-bold text-lg text-foreground mb-4 text-center">User Distribution</h3>
                     <div className="h-80 w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={userDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={5} onMouseEnter={(_, index) => setActiveIndex(index)}>
                                    {userDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none"/>)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{userDistributionData[activeIndex]?.value?.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">{userDistributionData[activeIndex]?.name}</p>
                            </div>
                        </div>
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PendingApprovals pendingApprovals={pendingApprovalsData} />
                <SystemAlerts systemAlerts={systemAlertsData} />
            </div>

             {/* Hospital Performance Leaderboard */}
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <h3 className="font-bold text-lg text-foreground mb-4">Hospital Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-muted-foreground bg-muted/50">
                            <tr>
                                <th className="p-3">Hospital Name</th>
                                <th className="p-3">Patient Load</th>
                                <th className="p-3">Avg. Wait Time</th>
                                <th className="p-3">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitalPerformanceData.map(h => (
                                <tr key={h.name} className="border-b border-border last:border-b-0">
                                    <td className="p-3 font-semibold text-foreground">{h.name}</td>
                                    <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${h.patientLoad === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{h.patientLoad}</span></td>
                                    <td className="p-3 text-muted-foreground">{h.avgWaitTime}</td>
                                    <td className="p-3 font-semibold text-primary">{h.rating} ★</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboardPage;