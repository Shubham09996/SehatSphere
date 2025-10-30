import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 }, // Increased y
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }, // Longer duration
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Increased y
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, // Longer duration
  };

  return (
    <motion.footer
      className="bg-card dark:bg-background text-foreground py-12 border-t border-border mt-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div
        className="container flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        variants={itemVariants}
      >
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}
        >
          <div className="bg-primary p-2 rounded-md">
            <span className="text-primary-foreground font-bold text-lg">H</span>
          </div>
          <span className="text-xl font-semibold text-foreground">HealthSphere</span>
        </motion.div>
        <p className="text-muted-foreground dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} HealthSphere. All rights reserved.
        </p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
