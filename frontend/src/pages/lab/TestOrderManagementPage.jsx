import React, { useState } from 'react';

const TestOrderManagementPage = () => {
  // Removed const navigate = useNavigate();

  const [selectedDayFilter, setSelectedDayFilter] = useState('All');
  const [selectedTestFilter, setSelectedTestFilter] = useState('All');

  const allBookings = [
    { id: '#1001', patient: 'Blood Test', time: 'Today, 10:00 AM', testType: 'Blood Test' },
    { id: '#1002', patient: 'Urine Analysis', time: 'Today, 11:30 AM', testType: 'Urine Analysis' },
    { id: '#1003', patient: 'X-Ray', time: 'Yesterday, 02:00 PM', testType: 'X-Ray' },
    { id: '#1004', patient: 'MRI Scan', time: 'Yesterday, 03:00 PM', testType: 'MRI Scan' },
    { id: '#1005', patient: 'CT Scan', time: '2 days ago, 09:00 AM', testType: 'CT Scan' },
    { id: '#1006', patient: 'Thyroid Panel', time: '3 days ago, 01:00 PM', testType: 'Thyroid Panel' },
    { id: '#1007', patient: 'Lipid Profile', time: '3 days ago, 04:00 PM', testType: 'Lipid Profile' },
    { id: '#1008', patient: 'Blood Test', time: 'This Week, 09:00 AM', testType: 'Blood Test' },
    { id: '#1009', patient: 'Urine Analysis', time: 'This Month, 01:00 PM', testType: 'Urine Analysis' },
    { id: '#1010', patient: 'X-Ray', time: 'Last Month, 11:00 AM', testType: 'X-Ray' },
  ];

  const dayFilters = ['All', 'Today', 'Yesterday', 'Week', 'Month'];
  const testTypes = ['All', ...new Set(allBookings.map(booking => booking.testType))];

  const filterBookings = () => {
    return allBookings.filter(booking => {
      const matchesDay = selectedDayFilter === 'All' || booking.time.includes(selectedDayFilter);
      const matchesTest = selectedTestFilter === 'All' || booking.testType === selectedTestFilter;
      return matchesDay && matchesTest;
    });
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
            {testTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Placeholder for a list of new bookings */}
        <ul className="space-y-3">
          {filteredBookings.map((booking, index) => (
            <li key={index} className="flex justify-between items-center p-3 border border-border rounded-md bg-background">
              <span className="font-medium text-foreground">Patient ID: {booking.id} - {booking.patient}</span>
              <span className="text-sm text-muted-foreground">{booking.time}</span>
            </li>
          ))}
        </ul>
        <button
          // Removed onClick={() => navigate('/lab/test-orders')}
          className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white rounded-md hover:opacity-90 transition-opacity"
        >
          View All Bookings
        </button>
      </div>

      {/* Doctor Referrals Section */}
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