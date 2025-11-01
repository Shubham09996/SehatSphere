import React from 'react';
import { motion } from 'framer-motion'; // NEW: Import motion

const LabNotificationsPage = () => {
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

  return (
    <motion.div
      className="min-h-screen p-4 sm:p-6 lg:p-8 bg-background text-foreground"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center">
        <span className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
          Lab Notifications
        </span>
        <span className="ml-2">🔔</span> {/* Emoji alag se */}
      </h1>

      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4">Your Recent Notifications</h2>
        <p className="text-muted-foreground mb-4">
          Here you can manage all your important notifications and alerts.
        </p>
        <ul className="space-y-4">
          <motion.li variants={itemVariants} className="flex items-start space-x-3 p-4 bg-background rounded-md border border-border">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-hs-gradient-start"></div> {/* Adjusted color */}
            <div>
              <p className="font-medium text-foreground">New Test Order: #ORD2024001 for Patient ID P1002.</p>
              <p className="text-sm text-muted-foreground mt-1">2 hours ago</p>
            </div>
          </motion.li>
          <motion.li variants={itemVariants} className="flex items-start space-x-3 p-4 bg-background rounded-md border border-border">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-yellow-500"></div>
            <div>
              <p className="font-medium text-foreground">Low Stock Alert: Glucose Reagent is running low. (50 Litres left)</p>
              <p className="text-sm text-muted-foreground mt-1">5 hours ago</p>
            </div>
          </motion.li>
          <motion.li variants={itemVariants} className="flex items-start space-x-3 p-4 bg-background rounded-md border border-border">
            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500"></div>
            <div>
              <p className="font-medium text-foreground">Report Uploaded: Patient P1001's Blood Test report is ready.</p>
              <p className="text-sm text-muted-foreground mt-1">Yesterday</p>
            </div>
          </motion.li>
        </ul>
        <button className="mt-6 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
          View All Notifications
        </button>
      </div>
    </motion.div>
  );
};

export default LabNotificationsPage;
