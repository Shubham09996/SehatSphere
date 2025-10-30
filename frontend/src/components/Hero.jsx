import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <motion.section
      className="text-center py-8 md:py-12 px-4" // Horizontal padding added here
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="inline-flex items-center justify-center bg-muted border border-border text-xs px-3 py-1 rounded-full mb-5"
        variants={itemVariants}
      >
        <span className="text-primary mr-2 text-sm">✲</span>
        <span className="text-foreground/80 font-medium">Integrated Healthcare Platform</span>
      </motion.div>
      <motion.h1
        // Font sizes adjusted for responsiveness
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] text-transparent bg-clip-text"
        variants={itemVariants}
      >
        Welcome to <span className="whitespace-nowrap">HealthSphere</span>
      </motion.h1>
      <motion.p
        className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-normal"
        variants={itemVariants}
      >
        A comprehensive healthcare ecosystem connecting patients, doctors, pharmacies, and blood donors for seamless healthcare delivery
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row justify-center items-center gap-4"
        variants={itemVariants}
      >
        <motion.button 
          className="w-full sm:w-auto bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2] text-primary-foreground px-5 py-2.5 rounded-md flex items-center justify-center space-x-2 font-medium hover:opacity-90 transition-transform hover:scale-105"
          whileHover={{ scale: 1.07 }} transition={{ duration: 0.2 }}
          onClick={() => navigate('/signup')} // Redirect to signup page
        >
          <span>Get Started</span>
          <span className="font-bold text-lg">→</span>
        </motion.button>
        <motion.div 
          className="p-0.5 rounded-md bg-gradient-to-r from-[#0096C7] via-[#2A9D8F] to-[#7E57C2]"
          whileHover={{ scale: 1.07 }} transition={{ duration: 0.2 }}
        >
           <button className="w-full sm:w-auto bg-card text-foreground px-5 py-2 rounded-md font-medium hover:bg-muted transition-colors">
            Learn More
          </button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;