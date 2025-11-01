import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'react-toastify';
import api from '../../utils/api';

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm p-2 rounded-md shadow-lg border border-border">
                <p className="text-xs text-muted-foreground">{label}</p>
                {payload.map(p => (
                    // YEH AB LINE KE COLOR SE AUTOMATIC MATCH KAREGA
                    <p key={p.dataKey} style={{ color: p.stroke }} className="font-semibold text-sm">
                        {p.name}: {p.value?.toLocaleString ? p.value.toLocaleString() : p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const HospitalAnalyticsFraudPage = () => {
    const [patientFeedbackData, setPatientFeedbackData] = useState([]);
    const [fraudIncidentsData, setFraudIncidentsData] = useState([]);
    const [stockLevelsData, setStockLevelsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setLoading(true);
                const [patientFeedbackRes, fraudIncidentsRes, stockLevelsRes] = await Promise.all([
                    api.get('/api/hospitals/patient-feedback'),
                    api.get('/api/hospitals/fraud-incidents'),
                    api.get('/api/hospitals/stock-levels'),
                ]);

                setPatientFeedbackData(patientFeedbackRes.data);
                setFraudIncidentsData(fraudIncidentsRes.data);
                setStockLevelsData(stockLevelsRes.data);

                toast.success('Analytics and fraud data loaded successfully!');
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                toast.error(err.response?.data?.message || err.message);
                setPatientFeedbackData([]);
                setFraudIncidentsData([]);
                setStockLevelsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (loading) {
        return <div className="text-center text-foreground p-8">Loading analytics and fraud data...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6">Analytics & Fraud Detection</h1>
            <p className="text-muted-foreground mb-8">Track performance, security, and stock levels.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Comprehensive Analytics</h3>
                    <div className="h-60 flex items-center justify-center text-muted-foreground">
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={patientFeedbackData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                {/* === CHART GRADIENT FIX KIYA HAI === */}
                                <Area type="monotone" dataKey="wait_time" stroke="#06b6d4" fillOpacity={1} fill="url(#colorWaitTime)" />
                                <defs>
                                    <linearGradient id="colorWaitTime" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                    <h3 className="font-bold text-lg text-foreground mb-4">Fraud Detection</h3>
                    <div className="h-60 flex items-center justify-center text-muted-foreground">
                        <ul className="space-y-3 w-full">
                            {fraudIncidentsData.map((incident) => (
                                <li key={incident.type + incident.date} className="flex items-center justify-between bg-muted/20 p-3 rounded-md">
                                    <span className="font-medium text-foreground">{incident.type}</span>
                                    <span className="text-sm text-muted-foreground">{incident.date}</span>
                                    <button className="px-3 py-1 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-xs hover:opacity-90">Review</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-lg text-foreground mb-4">Stock Analytics (Pharmacy)</h3>
                    <div className="h-60 flex items-center justify-center text-muted-foreground">
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={stockLevelsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="item" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                {/* === CHART GRADIENT FIX KIYA HAI === */}
                                <Area type="monotone" dataKey="stock" stroke="#0891b2" fillOpacity={1} fill="url(#colorStock)" />
                                <defs>
                                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0891b2" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HospitalAnalyticsFraudPage;