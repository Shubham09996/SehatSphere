import React, { useState, useEffect } from 'react';
import api from '../../utils/api'; // Import api for backend calls
import { useAuth } from '../../context/AuthContext'; // Import useAuth to get lab ID
import moment from 'moment'; // Import moment for date formatting

const TestOrderManagementPage = () => {
  const { user } = useAuth();
  const [testOrders, setTestOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDayFilter, setSelectedDayFilter] = useState('All');
  const [selectedTestFilter, setSelectedTestFilter] = useState('All');

  // Hardcoded filters for display purposes, actual filtering will be done backend
  const dayFilters = ['All', 'Today', 'Yesterday', 'This Week', 'This Month'];
  const allTestTypes = ['All', 'Blood Test', 'Urine Analysis', 'X-Ray', 'MRI Scan', 'CT Scan', 'Thyroid Panel', 'Lipid Profile'];

  useEffect(() => {
    const fetchTestOrders = async () => {
      if (!user || !user.lab) {
        setError('User not authorized or lab ID not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log("TestOrderManagementPage: User object before API call", user); // NEW LOG
        console.log("TestOrderManagementPage: user.lab before API call", user.lab); // NEW LOG
        const response = await api.get('/api/labs/test-orders', {
          params: {
            dayFilter: selectedDayFilter,
            testTypeFilter: selectedTestFilter,
            labId: user.lab._id, // Pass lab ID for filtering (accessing _id from the populated lab object)
          },
        });
        setTestOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch test orders:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch test orders');
      } finally {
        setLoading(false);
      }
    };

    fetchTestOrders();
  }, [selectedDayFilter, selectedTestFilter, user]);

  // This function is now mostly redundant as filtering is backend driven
  const filterBookings = () => {
    return testOrders; // Directly return fetched orders
  };

  const filteredBookings = filterBookings();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background text-foreground">
      {/* === HEADING GRADIENT CHANGE KIYA HAI === */}
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6">
        🗓 Test Order Management
      </h1>

      {/* New Bookings Section */}
      <div className="bg-card rounded-lg shadow-md p-6 mb-8 border border-border">
        <h2 className="text-xl font-semibold mb-4">New Bookings</h2>
        <p className="text-muted-foreground mb-4">
          Manage new diagnostic test bookings made by patients online.
        </p>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Day Filters */}
          <div className="flex space-x-2">
            {dayFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedDayFilter(filter)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedDayFilter === filter ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Test Type Filter */}
          <select
            onChange={(e) => setSelectedTestFilter(e.target.value)}
            value={selectedTestFilter}
            className="bg-card border border-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
          >
            {allTestTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading test orders...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : filteredBookings.length > 0 ? (
          <ul className="space-y-3">
            {filteredBookings.map((order) => (
              <li key={order._id} className="flex justify-between items-center p-3 border border-border rounded-md bg-background">
                <span className="font-medium text-foreground">Order ID: {order._id} - Patient: {order.patient.name} - Test: {order.testName}</span>
                <span className="text-sm text-muted-foreground">Ordered On: {moment(order.orderDate).format('MMMM Do YYYY, h:mm A')} - Status: {order.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No test orders found.</p>
        )}
        <button
          // Removed onClick={() => navigate('/lab/test-orders')}
          className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity"
        >
          View All Bookings
        </button>
      </div>

      {/* Doctor Referrals Section - Remains hardcoded for now */}
      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4">Doctor Referrals</h2>
        <p className="text-muted-foreground mb-4">
          Handle digital prescription verifications and test requests from doctors.
        </p>
        {/* Placeholder for a list of doctor referrals */}
        <ul className="space-y-3">
          <li className="flex justify-between items-center p-3 border border-border rounded-md bg-background">
            <span className="font-medium text-foreground">Dr. Smith - Patient: Jane Doe</span>
            <span className="text-sm text-muted-foreground">Pending Review</span>
          </li>
          <li className="flex justify-between items-center p-3 border border-border rounded-md bg-background">
            <span className="font-medium text-foreground">Dr. Khan - Patient: John W.</span>
            <span className="text-sm text-muted-foreground">Approved</span>
          </li>
        </ul>
        <button className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity">
          Manage Referrals
        </button>
      </div>
    </div>
  );
};

export default TestOrderManagementPage;