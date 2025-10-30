import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumUpgrade = () => {
  const premiumFeatures = [
    'Priority appointment tokens',
    'Advanced health analytics',
    'Priority blood donor alerts',
    'Unlimited AI chatbot access',
    'Multi-hospital management',
    'Verified donor badge',
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 }, // Increased y
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 } }, // Longer duration, increased stagger
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Increased y
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, // Longer duration
  };

  return (
    <motion.section
      className="py-20 bg-premium-bg dark:bg-dark-premium-bg"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container text-center">
        <motion.div
          className="inline-flex items-center justify-center bg-premium-tag-bg text-premium-tag-text text-sm font-semibold px-4 py-1 rounded-full mb-6"
          variants={itemVariants}
        >
          Premium Features
        </motion.div>
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          variants={itemVariants}
        >
          Upgrade to Premium
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 dark:text-gray-400"
          variants={itemVariants}
        >
          Unlock advanced features and priority access
        </motion.p>

        <motion.div
          className="bg-card p-8 rounded-xl shadow-lg max-w-4xl mx-auto border border-border dark:bg-dark-premium-card-bg dark:border-gray-700 dark:shadow-none"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10 text-left">
            {premiumFeatures.map((feature, index) => (
              <motion.div key={index} className="flex items-center space-x-3" variants={itemVariants}>
                <CheckCircle2 size={20} className="text-premium-button-free-trial-bg" />
                <span className="text-foreground text-base dark:text-gray-200">{feature}</span>
              </motion.div>
            ))}
          </div>
          <motion.div className="flex flex-col sm:flex-row justify-center items-center gap-4" variants={itemVariants}>
            <motion.button 
              className="w-full sm:w-auto bg-premium-button-free-trial-bg text-premium-button-free-trial-text px-6 py-3 rounded-md text-lg font-semibold hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}
            >
              Start 7-Day Free Trial
            </motion.button>
            <motion.button 
              className="w-full sm:w-auto bg-premium-button-compare-bg text-premium-button-compare-text px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-300 transition-colors dark:bg-dark-premium-button-compare-bg dark:text-dark-premium-button-compare-text dark:hover:bg-gray-600"
              whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}
            >
              Compare Plans
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PremiumUpgrade;
