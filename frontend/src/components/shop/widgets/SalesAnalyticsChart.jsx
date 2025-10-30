import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
// import { shopData } from '../../../data/shopData'; // Remove this import
import LockedFeatureCard from './LockedFeatureCard';
import { TrendingUp } from 'lucide-react';

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card p-2 rounded-md shadow-lg border border-border">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-bold text-lg text-primary">₹{payload[0].value.toLocaleString('en-IN')}</p>
            </div>
        );
    }
    return null;
};

const SalesAnalyticsChart = ({ isPremium, salesData, totalRevenue, percentageChange }) => {
    // const { salesLast7Days } = shopData; // Remove this line

    // const totalRevenue = salesLast7Days.reduce((sum, day) => sum + day.sales, 0); // Remove this line
    // const percentageChange = "+7.2%"; // Remove this line

    if (!isPremium) {
        return (
            <LockedFeatureCard title="Revenue Analytics">
                <div className="h-60 w-full bg-muted rounded-md flex items-center justify-center">
                    <TrendingUp size={48} className="text-border"/>
                </div>
            </LockedFeatureCard>
        );
    }

    return (
        <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-foreground">Revenue (Last 7 Days)</h3>
                    <p className="text-xs text-muted-foreground">Performance overview of your shop</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    <p className="text-xs font-semibold text-green-500">{percentageChange} vs last week</p>
                </div>
            </div>
            
            <motion.div 
                className="h-60 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <ResponsiveContainer>
                    <AreaChart data={salesData} margin={{ left: -20, top: 10, right: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                {/* UPDATED: Wrapped color variables in hsl() for theme compatibility */}
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        {/* UPDATED: Wrapped color variables in hsl() */}
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                        <Area 
                            type="monotone" 
                            dataKey="sales" 
                            // UPDATED: Wrapped color variable in hsl()
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            fill="url(#areaGradient)"
                            activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default SalesAnalyticsChart;