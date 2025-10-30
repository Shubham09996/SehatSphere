import React from 'react';
import { Outlet } from 'react-router-dom';
import HospitalSidebar from './HospitalSidebar'; // Import the new sidebar
import HospitalHeader from './HospitalHeader'; // Import the new header

const HospitalDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <HospitalSidebar />
      <div className="flex-1 flex flex-col">
        <HospitalHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HospitalDashboardLayout;
