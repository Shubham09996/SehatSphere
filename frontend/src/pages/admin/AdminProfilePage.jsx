import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, Activity, Users, Building, BarChart2, ShieldCheck, Award, GitBranch, UserCheck, UserX, FileText, Map } from 'lucide-react';
// Removed: import { adminProfileData as data } from '../../data/adminProfileData'; // Remove this import
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import * as LucideIcons from 'lucide-react';
// Removed: import axios from 'axios'; // Import axios
import api from '../../utils/api'; // api.js se import karein

// --- Reusable Sub-Components for the page ---

const SparklineStat = ({ title, value, change, chartData, color }) => (
    <div className="bg-muted/50 p-4 rounded-lg border border-border/50 flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className={`text-xs font-semibold ${change && change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
        </div>
        <div className="h-12 w-full mt-2">
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const Achievement = ({ icon: Icon, name, description, achieved }) => (
    <div className={`flex items-center gap-4 p-3 rounded-lg transition-opacity ${achieved ? 'bg-muted' : 'opacity-40 bg-muted/50'}`}>
        <div className={`p-2 rounded-lg ${achieved ? 'bg-yellow-500/10 text-yellow-500' : 'bg-border'}`}>
            <Icon size={24}/>
        </div>
        <div>
            <p className={`font-semibold ${achieved ? 'text-foreground' : 'text-muted-foreground'}`}>{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    </div>
);


// --- Main Profile Page ---
const AdminProfilePage = () => {
    const [adminProfile, setAdminProfile] = useState(null);
    const [recentLogData, setRecentLogData] = useState([]);
    const [achievementsData, setAchievementsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminProfileData = async () => {
            try {
                setLoading(true);
                const [profileRes, recentLogRes, achievementsRes] = await Promise.all([
                    api.get('/api/admin/profile'),
                    api.get('/api/admin/recent-log'),
                    api.get('/api/admin/achievements'),
                ]);

                setAdminProfile(profileRes.data.personalInfo); // Corrected: Access personalInfo
                setRecentLogData(recentLogRes.data); // Assuming recentLogRes.data is directly the array
                setAchievementsData(achievementsRes.data); // Assuming achievementsRes.data is directly the array
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminProfileData();
    }, []);

    const iconMap = { Award, ShieldCheck, UserCheck, GitBranch, Activity }; // Added Activity icon

    if (loading) {
        return <div className="text-center text-foreground p-8">Loading admin profile...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-8">Error loading profile: {error}</div>;
    }

    if (!adminProfile || !recentLogData || !achievementsData) {
        return <div className="text-center text-muted-foreground p-8">No admin profile data found.</div>;
    }

    // Using adminProfile directly
    
    return (
        <div className="space-y-8">
            {/* Profile Hero Section */}
            <motion.div 
                className="bg-card p-6 rounded-xl border border-border/70 shadow-sm"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                    <img src={adminProfile.pfp || "https://via.placeholder.com/96"} alt={adminProfile.name} className="w-24 h-24 rounded-full border-4 border-primary/50"/>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">{adminProfile.name}</h1>
                        <p className="font-semibold text-muted-foreground">{adminProfile.role}</p>
                        <p className="text-sm text-muted-foreground">Member Since: {new Date(adminProfile.memberSince).toLocaleDateString()}</p>
                    </div>
                    <Link to="/admin/profile/settings" className="flex items-center gap-2 font-semibold py-2 px-4 rounded-lg bg-muted text-foreground hover:bg-border">
                        <Edit size={16}/> Edit Profile
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SparklineStat title="Users Managed" value={adminProfile.performance?.usersManaged?.value || 0} change={adminProfile.performance?.usersManaged?.change || '+'} chartData={adminProfile.performance?.usersManaged?.data || []} color="hsl(var(--primary))"/>
                    <SparklineStat title="Approvals Done" value={adminProfile.performance?.approvalsDone?.value || 0} change={adminProfile.performance?.approvalsDone?.change || '+'} chartData={adminProfile.performance?.approvalsDone?.data || []} color="#00C49F"/>
                    <SparklineStat title="Tickets Resolved" value={adminProfile.performance?.ticketsResolved?.value || 0} change={adminProfile.performance?.ticketsResolved?.change || '+'} chartData={adminProfile.performance?.ticketsResolved?.data || []} color="#FFBB28"/>
                </div>
            </motion.div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2"><Activity size={20} className="text-primary"/> Recent Admin Log</h3>
                        <div className="space-y-4">
                            {recentLogData.length > 0 ? (
                                recentLogData.map(item => {
                                    const Icon = iconMap[item.icon] || LucideIcons['Activity'];
                                    return (
                                    <div key={item._id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-muted p-2 rounded-full"><Icon size={16} className="text-muted-foreground"/></div>
                                            <p className="font-semibold text-sm">{item.action}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex-shrink-0">{item.timestamp}</p>
                                    </div>
                                )})
                            ) : (
                                <p className="text-center text-muted-foreground">No recent activities found.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                         <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2"><Award size={20} className="text-primary"/> Achievements</h3>
                         <div className="space-y-3">
                            {achievementsData.length > 0 ? (
                                achievementsData.map(ach => (
                                    <Achievement key={ach._id} icon={iconMap[ach.icon]} {...ach} />
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground">No achievements yet.</p>
                            )}
                         </div>
                    </div>
                    
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4">Quick Actions</h3>
                        <div className="flex flex-col gap-2">
                            <Link to="/admin/users" className="font-semibold py-2 px-3 rounded-lg hover:bg-muted text-sm flex items-center gap-2"><Users size={16} className="text-primary"/> Manage Users</Link>
                            <Link to="/admin/hospitals" className="font-semibold py-2 px-3 rounded-lg hover:bg-muted text-sm flex items-center gap-2"><Building size={16} className="text-primary"/> Manage Hospitals</Link>
                             <Link to="/admin/analytics" className="font-semibold py-2 px-3 rounded-lg hover:bg-muted text-sm flex items-center gap-2"><BarChart2 size={16} className="text-primary"/> View Analytics</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;