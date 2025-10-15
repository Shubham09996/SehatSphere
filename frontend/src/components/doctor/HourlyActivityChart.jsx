import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

// Custom Tooltip for the chart - Slightly refined look
const CustomTooltip = ({ active, payload, label, fbbbt}) => {
    if (active && payload && payload.length) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }}
                className="bg-card p-3 rounded-md shadow-lg border border-border text-foreground text-sm" // Changed background, border and text color for better theme integration
            >
                <p className="font-bold">{`${label}`}</p>
                <p className="text-muted-foreground">{`Patients: `}<span className="text-primary font-semibold">{payload[0].value}</span></p>
            </motion.div>
        );
    }
    return null;
};

const HourlyActivityChart = ({ data }) => {
    return (
        <div className="bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            <h3 className="font-bold text-lg text-foreground mb-4">Patients per Hour</h3>
            <motion.div 
                className="h-52 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}> {/* Adjusted margins */}
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                {/* Use theme's primary color with varying opacity for a vibrant gradient */}
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                            </linearGradient>
                        </defs>
                        {/* CartesianGrid now uses more subtle stroke for better look */}
                        <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} opacity={0.7} />
                        
                        {/* XAxis labels now use foreground color from theme */}
                        <XAxis 
                            dataKey="hour" 
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                            axisLine={false} 
                            tickLine={false} 
                            padding={{ left: 10, right: 10 }} 
                        />
                        {/* YAxis labels also use foreground color from theme */}
                        <YAxis 
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                            axisLine={false} 
                            tickLine={false} 
                            orientation="left" // Ensure Y-axis is on the left
                        />
                        
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} /> {/* Adjusted cursor opacity */}
                        <Bar 
                            dataKey="patients" 
                            fill="url(#barGradient)" 
                            radius={[6, 6, 0, 0]} // Slightly larger radius for rounded bars
                            barSize={25} // Set a fixed bar size for better visual consistency
                            activeBar={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }} // Highlight active bar
                        />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default HourlyActivityChart;