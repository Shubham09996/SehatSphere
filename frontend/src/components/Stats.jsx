import React from 'react';
import { Users, Activity, Briefcase, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, value, label }) => (
  <motion.div
    className="bg-card p-6 rounded-lg shadow-sm border border-border/75 flex flex-col items-start space-y-2"
    initial={{ opacity: 0, y: 70 }} // Increased y
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, ease: "easeOut" }} // Longer duration
    whileHover={{ scale: 1.05 }} // Added hover effect
  >
    <div className="p-2 bg-muted rounded-md text-primary">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-muted-foreground font-medium">{label}</p>
    </div>
  </motion.div>
);

const Stats = () => {
  const statsData = [
    { icon: <Users size={24} />, value: '24,583+', label: 'Active Users' },
    { icon: <Activity size={24} />, value: '142+', label: 'Hospitals' },
    { icon: <Briefcase size={24} />, value: '856+', label: 'Medicine Shops' },
    { icon: <Heart size={24} />, value: '3,247+', label: 'Blood Donors' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Increased stagger duration
      },
    },
  };

  return (
    <section className="pb-16 md:pb-20">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {statsData.map((stat, index) => (
          <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} />
        ))}
      </motion.div>
    </section>
  );
};

export default Stats;