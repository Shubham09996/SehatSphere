import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Zap, CheckCircle, IndianRupee, Percent, ShoppingCart, Users } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { analyticsData } from '../../data/analyticsData';
// UPDATED: BarChart and Bar have been added to the import list
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

// --- Reusable Components for this Page ---

const KpiCard = ({ title, value, change, icon, color }) => (
    <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>{icon}</div>
            <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        </div>
        <p className="text-3xl font-bold text-foreground mt-4">{value}</p>
        <p className={`text-xs font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change} this month</p>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-2 rounded-md shadow-lg border border-border">
                <p className="text-xs text-muted-foreground">{label}</p>
                {payload.map(p => (
                    <p key={p.dataKey} style={{ color: p.stroke || p.fill }} className="font-semibold text-sm">
                        {p.dataKey}: ₹{p.value.toLocaleString('en-IN')}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- Main Analytics Page ---
const ShopAnalyticsPage = () => {
    const { isPremium, setIsPremium } = useOutletContext();
    const { kpis, revenueProfitData, bestSellers, salesByCategory } = analyticsData;
    const COLORS = ['hsl(var(--primary))', '#00C49F', '#FFBB28', '#FF8042'];

    // If the user is NOT premium, show the upgrade wall
    if (!isPremium) {
        return (
            <div className="flex items-center justify-center h-full">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-card p-8 rounded-2xl border border-border shadow-lg max-w-2xl"
                >
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <BarChart2 size={32} className="text-primary"/>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Unlock Your Analytics Dashboard</h1>
                    <p className="text-muted-foreground mt-2 mb-6">
                        Upgrade to Premium to access powerful insights, track your performance, and make data-driven decisions to grow your business.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left text-sm mb-6">
                         <span className="flex items-center gap-2"><CheckCircle size={16} className="text-primary"/> Sales Performance</span>
                         <span className="flex items-center gap-2"><CheckCircle size={16} className="text-primary"/> Stock Prediction</span>
                         <span className="flex items-center gap-2"><CheckCircle size={16} className="text-primary"/> Profitability Insights</span>
                         <span className="flex items-center gap-2"><CheckCircle size={16} className="text-primary"/> Best-Seller Tracking</span>
                    </div>
                    <button onClick={() => setIsPremium(true)} className="font-semibold py-3 px-6 rounded-lg bg-primary text-primary-foreground text-base flex items-center gap-2 mx-auto">
                        <Zap size={16}/> Upgrade to Premium
                    </button>
                </motion.div>
            </div>
        );
    }

    // If the user IS premium, show the actual analytics dashboard
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Shop Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">Your complete business performance overview.</p>
                </div>
                <select className="bg-card border border-border rounded-md p-2 text-sm font-semibold">
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>This Year</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard icon={<IndianRupee size={20}/>} title="Total Revenue" value={kpis.totalRevenue.value} change={kpis.totalRevenue.change} color="green"/>
                <KpiCard icon={<Percent size={20}/>} title="Profit Margin" value={kpis.profitMargin.value} change={kpis.profitMargin.change} color="sky"/>
                <KpiCard icon={<ShoppingCart size={20}/>} title="Total Orders" value={kpis.totalOrders.value} change={kpis.totalOrders.change} color="blue"/>
                <KpiCard icon={<Users size={20}/>} title="Avg. Order Value" value={kpis.avgOrderValue.value} change={kpis.avgOrderValue.change} color="orange"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Revenue vs. Profit</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer>
                             <AreaChart data={revenueProfitData} margin={{ left: -20, top: 10, right: 10, bottom: 0 }}>
                                <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRevenue)" />
                                <Line type="monotone" dataKey="profit" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Sales by Category</h3>
                     <div className="h-80 w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={salesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} labelLine={false}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                        return <text x={x} y={y} fill="var(--foreground)" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>{`${(percent * 100).toFixed(0)}%`}</text>;
                                    }}>
                                    {salesByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Legend iconSize={10}/>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <h3 className="font-bold text-lg text-foreground mb-4">Best-Selling Products</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer>
                        <BarChart data={bestSellers} layout="vertical" margin={{ left: 30, right: 30 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                             <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`}/>
                             <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} axisLine={false} tickLine={false}/>
                             <Tooltip cursor={{fill: 'var(--muted)'}}/>
                             <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ShopAnalyticsPage;