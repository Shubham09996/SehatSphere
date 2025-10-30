import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import RoleSelection from '../components/RoleSelection';
import PremiumUpgrade from '../components/PremiumUpgrade';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <main className="container pt-24">
      <Hero />
      <Stats />
      <RoleSelection />
      <PremiumUpgrade />
      <Footer />
    </main>
  );
};

export default HomePage;