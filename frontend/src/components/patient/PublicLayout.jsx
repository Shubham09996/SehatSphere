import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar.jsx'; // Main Navbar
import { useTheme } from '../../context/ThemeContext';

const PublicLayout = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-4 py-8">
        <Outlet /> {/* Yahan child pages render honge */}
      </main>
    </div>
  );
};

export default PublicLayout;