import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // NEW: Import useNavigate
import { TrendingUp, FileText, Package, CalendarCheck, Clock, FlaskConical, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion'; // NEW: Import motion
import PatientDetailModal from '../../components/lab/PatientDetailModal'; // NEW: Import PatientDetailModal
import api from '../../utils/api'; // NEW: Import api
import { useAuth } from '../../context/AuthContext'; // NEW: Import useAuth

// Removed hardcoded data as it will be fetched from the backend
// const data = [
//   { name: 'Mon', orders: 20 },
//   { name: 'Tue', orders: 30 },
//   { name: 'Wed', orders: 25 },
//   { name: 'Thu', orders: 35 },
//   { name: 'Fri', orders: 40 },
//   { name: 'Sat', orders: 28 },
//   { name: 'Sun', orders: 22 },
// ];

const LabDashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedPatientId, setSelectedPatientId] = useState(null); // State for selected patient ID
  const navigate = useNavigate(); // NEW: Initialize useNavigate
  const { user } = useAuth(); // Get user from AuthContext
  const [stats, setStats] = useState([]); // State for dashboard stats
  const [recentOrders, setRecentOrders] = useState([]); // State for recent orders
  const [inventorySummary, setInventorySummary] = useState([]); // State for inventory summary
  const [dailyTrendData, setDailyTrendData] = useState([]); // State for daily trend chart data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !user.role || user.role.toLowerCase() !== 'lab') {
        setError('User not authorized for lab dashboard.');
        setLoading(false);
        return;
      }
      try {
        // Fetch Stats
        const statsRes = await api.get('/api/labs/dashboard/stats');
        setStats([
          { id: 1, name: 'Today\'s Test Orders', value: statsRes.data.todayTestOrders, icon: CalendarCheck, trend: statsRes.data.todayTestOrdersTrend, change: statsRes.data.todayTestOrdersChange },
          { id: 2, name: 'Pending Reports', value: statsRes.data.pendingReports, icon: FileText, trend: statsRes.data.pendingReportsTrend, change: statsRes.data.pendingReportsChange },
          { id: 3, name: 'Low Stock Alerts', value: statsRes.data.lowStockAlerts, icon: Package, trend: statsRes.data.lowStockAlertsTrend, change: statsRes.data.lowStockAlertsChange },
        ]);

        // Fetch Recent Orders
        const recentOrdersRes = await api.get('/api/labs/dashboard/recent-orders');
        setRecentOrders(recentOrdersRes.data);

        // Fetch Inventory Summary
        const inventorySummaryRes = await api.get('/api/labs/dashboard/inventory-summary');
        setInventorySummary([
          { id: 1, name: 'Total Items', value: inventorySummaryRes.data.totalItems, icon: FlaskConical },
          { id: 2, name: 'Low Stock Items', value: inventorySummaryRes.data.lowStockItems, icon: AlertTriangle, color: 'text-red-500' },
        ]);

        // Fetch Daily Trend Data
        const dailyTrendRes = await api.get('/api/labs/dashboard/daily-trend');
        setDailyTrendData(dailyTrendRes.data);

      } catch (err) {
        console.error('Failed to fetch lab dashboard data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]); // Re-fetch when user changes

  // Framer Motion variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleViewPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatientId(null);
  };

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background text-foreground"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6">Lab Overview Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div key={stat.id} className="bg-card rounded-lg shadow-md p-6 border border-border flex items-center justify-between" variants={itemVariants}>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <div className="flex items-center text-sm mt-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
                )}
                <span className={`${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</span>
                <span className="ml-1 text-muted-foreground">since yesterday</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <stat.icon className="h-8 w-8 text-hs-gradient-middle" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Wrap the two main content divs in a React Fragment */}
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Test Orders Trend Chart */}
          <motion.div className="bg-card rounded-lg shadow-md p-6 border border-border" variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4">Daily Test Orders Trend</h2>
            <div className="h-64">
              {loading ? (
                <p>Loading chart data...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#E2E8F0' }} labelStyle={{ color: '#94A3B8' }} />
                    <Bar dataKey="orders" fill="#0096C7" barSize={20} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Recent Test Orders */}
          <motion.div className="bg-card rounded-lg shadow-md p-6 border border-border" variants={itemVariants}>
            <div> {/* New wrapper div */}
              <h2 className="text-xl font-semibold mb-4">Recent Test Orders</h2>
              {loading ? (
                <p>Loading recent orders...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : recentOrders.length > 0 ? (
                <ul className="space-y-4">
                  {recentOrders.map(order => (
                    <motion.li key={order.id} className="flex items-center justify-between p-3 bg-background rounded-md border border-border" variants={itemVariants}>
                      <div>
                        <p className="font-medium text-foreground">{order.patient} - {order.test}</p>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {order.time} - <span className={`ml-1 font-semibold ${order.status === 'Pending' ? 'text-yellow-500' : 'text-green-500'}`}>{order.status}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewPatient(order.patientId)}
                        className="px-3 py-1 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-sm hover:opacity-90 transition-opacity"
                      >
                        View
                      </button>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No recent orders found.</p>
              )}
              <button 
                onClick={() => {
                  console.log('Navigating to:', '/lab/test-order-management'); // NEW: Log navigation target
                  navigate('/lab/test-order-management');
                }}
                className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground rounded-md hover:opacity-90 transition-opacity w-full"
              >
                View All Orders
              </button>
            </div> {/* End new wrapper div */}
          </motion.div>
        </div>

        {/* Quick Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p>Loading inventory summary...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : inventorySummary.length > 0 ? (
            inventorySummary.map(item => (
              <motion.div key={item.id} className="bg-card rounded-lg shadow-md p-6 border border-border flex items-center justify-between" variants={itemVariants}>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                  <p className={`text-3xl font-bold ${item.color || 'text-foreground'}`}>{item.value}</p>
                </div>
                <div className="p-3 bg-muted rounded-full">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground">No inventory summary available.</p>
          )}
        </div>
      </>

      {/* Welcome Section - Removed if redundant, otherwise re-evaluate styling */}
      {/* <div className="bg-card rounded-lg shadow-md p-6 border border-border mt-8">
        <h2 className="text-xl font-semibold mb-4">Welcome to Your Lab Dashboard</h2>
        <p className="text-muted-foreground">
          This dashboard provides a comprehensive overview of your daily lab operations.
          Monitor crucial metrics like test orders, pending reports, and inventory status at a glance.
        </p>
        <p className="mt-4 text-muted-foreground">
          Utilize the sidebar navigation to manage specific areas such as test bookings, report uploads, and stock analytics.
        </p>
      </div> */}

      <PatientDetailModal // NEW: PatientDetailModal component
        isOpen={isModalOpen}
        onClose={closeModal}
        patientId={selectedPatientId}
      />
    </motion.div>
  );
};

export default LabDashboardPage;
