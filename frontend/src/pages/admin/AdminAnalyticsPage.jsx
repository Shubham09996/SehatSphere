import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Award, UserCheck, DollarSign, Hospital, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../../utils/api'; // api.js se import karein

// Reusable Components
const KpiCard = ({ title, value, change, icon, color }) => (
    <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
        <div className="flex items-center gap-3"><div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>{icon}</div><p className="text-sm font-semibold text-muted-foreground">{title}</p></div>
        <p className="text-3xl font-bold text-foreground mt-4">{value}</p>
        <p className={`text-xs font-semibold ${change && change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm h-full">
        <h3 className="font-bold text-lg text-foreground mb-4">{title}</h3>
        <div className="h-80 w-full">{children}</div>
    </div>
);


const AdminAnalyticsPage = () => {
    const [timeRange, setTimeRange] = useState('Last 30 Days');
    const [kpisData, setKpisData] = useState(null);
    const [userGrowthChartData, setUserGrowthChartData] = useState([]);
    const [revenueStreamsChartData, setRevenueStreamsChartData] = useState([]);
    const [topHospitalsData, setTopHospitalsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const COLORS = ['hsl(var(--primary))', '#00C49F', '#FFBB28'];

    useEffect(() => {
        const fetchAdminAnalytics = async () => {
            try {
                setLoading(true);
                const [kpisRes, userGrowthRes, revenueStreamsRes, topHospitalsRes] = await Promise.all([
                    api.get('/api/admin/analytics/kpis'),
                    api.get('/api/admin/analytics/user-growth'),
                    api.get('/api/admin/analytics/revenue-streams'),
                    api.get('/api/admin/analytics/top-hospitals'),
                ]);

                setKpisData(kpisRes.data.kpis);
                setUserGrowthChartData(userGrowthRes.data); // Corrected to directly use the array
                setRevenueStreamsChartData(revenueStreamsRes.data.revenueStreams);
                setTopHospitalsData(topHospitalsRes.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminAnalytics();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground">Loading analytics...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading analytics: {error.message}</div>;
    }

    if (!kpisData || userGrowthChartData.length === 0 || revenueStreamsChartData.length === 0 || topHospitalsData.length === 0) {
        return <div className="text-center text-muted-foreground">No analytics data found.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Deep Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">Platform-wide performance and growth metrics.</p>
                </div>
                <select onChange={e => setTimeRange(e.target.value)} value={timeRange} className="bg-card border border-border rounded-md p-2 text-sm font-semibold">
                    <option>Last 7 Days</option><option>Last 30 Days</option><option>This Year</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Revenue" value={kpisData.totalRevenue.value} change={kpisData.totalRevenue.change} icon={<DollarSign size={20}/>} color="green"/>
                <KpiCard title="New User Growth" value={kpisData.newUserGrowth.value} change={kpisData.newUserGrowth.change} icon={<UserCheck size={20}/>} color="blue"/>
                <KpiCard title="Avg. Wait Time" value={kpisData.avgWaitTime.value} change={kpisData.avgWaitTime.change} icon={<TrendingUp size={20}/>} color="orange"/>
                <KpiCard title="Platform Rating" value={kpisData.platformRating.value} change={kpisData.platformRating.change} icon={<Award size={20}/>} color="yellow"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3"><ChartCard title="User Growth Analysis">
                    <ResponsiveContainer>
                        <AreaChart data={userGrowthChartData} margin={{ left: -20, top: 10, right: 10, bottom: 0 }}>
                            <defs><linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="Patients" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorPatients)" />
                             <Area type="monotone" dataKey="Doctors" stroke="#00C49F" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard></div>
                <div className="lg:col-span-2"><ChartCard title="Revenue Streams">
                     <ResponsiveContainer>
                        <PieChart><Tooltip/><Pie data={revenueStreamsChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={5}>{revenueStreamsChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Legend iconSize={10}/></PieChart>
                    </ResponsiveContainer>
                </ChartCard></div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                 <h3 className="font-bold text-lg text-foreground mb-4">Top Performing Hospitals</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-muted-foreground bg-muted/50">
                            <tr><th className="p-3">Hospital Name</th><th className="p-3">Revenue Contribution</th><th className="p-3">Avg. Rating</th></tr>
                        </thead>
                        <tbody>
                            {topHospitalsData.map(h => (
                                <tr key={h.name} className="border-b border-border last:border-b-0">
                                    <td className="p-3 font-semibold text-foreground">{h.name}</td>
                                    <td className="p-3 text-muted-foreground">{h.revenue}</td>
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
export default AdminAnalyticsPage;