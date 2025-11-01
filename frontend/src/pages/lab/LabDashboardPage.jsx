import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // NEW: Import useNavigate
import { TrendingUp, FileText, Package, CalendarCheck, Clock, FlaskConical, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion'; // NEW: Import motion
import PatientDetailModal from '../../components/lab/PatientDetailModal'; // NEW: Import PatientDetailModal

const data = [
  { name: 'Mon', orders: 20 },
  { name: 'Tue', orders: 30 },
  { name: 'Wed', orders: 25 },
  { name: 'Thu', orders: 35 },
  { name: 'Fri', orders: 40 },
  { name: 'Sat', orders: 28 },
  { name: 'Sun', orders: 22 },
];

const LabDashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedPatientId, setSelectedPatientId] = useState(null); // State for selected patient ID
  const navigate = useNavigate(); // NEW: Initialize useNavigate

  const stats = [
    { id: 1, name: 'Today\'s Test Orders', value: '15', icon: CalendarCheck, trend: 'up', change: '+ 5%' },
    { id: 2, name: 'Pending Reports', value: '8', icon: FileText, trend: 'down', change: '-2%' },
    { id: 3, name: 'Low Stock Alerts', value: '3', icon: Package, trend: 'up', change: '+10%' },
  ];

  const recentOrders = [
    { id: 'ORD001', patient: 'Priya Sharma', test: 'Blood Test', status: 'Pending', time: '10:30 AM', patientId: 'patient_id_1' }, // Added patientId
    { id: 'ORD002', patient: 'Rahul Verma', test: 'Urine Analysis', status: 'Completed', time: '09:00 AM', patientId: 'patient_id_2' }, // Added patientId
    { id: 'ORD003', patient: 'Sneha Singh', test: 'X-Ray', status: 'Pending', time: '08:15 AM', patientId: 'patient_id_3' }, // Added patientId
  ];

  const inventorySummary = [
    { id: 1, name: 'Total Items', value: '250', icon: FlaskConical },
    { id: 2, name: 'Low Stock Items', value: '5', icon: AlertTriangle, color: 'text-red-500' },
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Test Orders Trend Chart */}
        <motion.div className="bg-card rounded-lg shadow-md p-6 border border-border" variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-4">Daily Test Orders Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#E2E8F0' }} labelStyle={{ color: '#94A3B8' }} />
                <Bar dataKey="orders" fill="#0096C7" barSize={20} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Test Orders */}
        <motion.div className="bg-card rounded-lg shadow-md p-6 border border-border" variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-4">Recent Test Orders</h2>
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
                  onClick={() => handleViewPatient(order.patientId)} // Added onClick handler
                  className="px-3 py-1 bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white rounded-md text-sm hover:opacity-90 transition-opacity"
                >
                  View
                </button>
              </motion.li>
            ))}
          </ul>
          <button 
            onClick={() => navigate('/lab/test-orders')} // NEW: Add onClick handler for navigation
            className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground rounded-md hover:opacity-90 transition-opacity w-full"
          >
            View All Orders
          </button>
        </motion.div>
      </div>

      {/* Quick Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inventorySummary.map(item => (
          <motion.div key={item.id} className="bg-card rounded-lg shadow-md p-6 border border-border flex items-center justify-between" variants={itemVariants}>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
              <p className={`text-3xl font-bold ${item.color || 'text-foreground'}`}>{item.value}</p>
            </div>
            <div className="p-3 bg-muted rounded-full">
              <item.icon className="h-8 w-8 text-primary" />
            </div>
          </motion.div>
        ))}
      </div>

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
