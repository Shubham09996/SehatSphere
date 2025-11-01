import React from 'react';
import { User, Mail, Phone, Building, MapPin } from 'lucide-react';
import { motion } from 'framer-motion'; // NEW: Import motion

const LabProfilePage = () => {
  const labInfo = {
    name: "HealthSphere Diagnostics Lab",
    email: "lab.diagnostics@healthsphere.com",
    phone: "+1 (123) 456-7890",
    address: "123 Healthway, Medical City, HS 12345",
    established: "2015",
    director: "Dr. Anya Sharma",
    description: "A leading diagnostic laboratory committed to accurate and timely test results for comprehensive patient care."
  };

  // Framer Motion variants
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
          Lab Profile
        </span>
        <span className="ml-2">🔬</span> {/* Emoji alag se */}
      </h1>

      <motion.div variants={itemVariants} className="bg-card rounded-lg shadow-md p-6 border border-border max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary-foreground text-5xl font-bold mb-4">
            H
          </div>
          <h2 className="text-2xl font-bold text-foreground">{labInfo.name}</h2>
          <p className="text-muted-foreground text-sm">Established: {labInfo.established}</p>
        </div>

        <div className="space-y-4">
          <motion.div variants={itemVariants} className="flex items-center space-x-3">
            <User className="h-5 w-5 text-hs-gradient-middle flex-shrink-0" />
            <p className="text-foreground"><span className="font-semibold">Director:</span> {labInfo.director}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-hs-gradient-middle flex-shrink-0" />
            <p className="text-foreground"><span className="font-semibold">Email:</span> {labInfo.email}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-hs-gradient-middle flex-shrink-0" />
            <p className="text-foreground"><span className="font-semibold">Phone:</span> {labInfo.phone}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-hs-gradient-middle flex-shrink-0 mt-1" />
            <p className="text-foreground"><span className="font-semibold">Address:</span> {labInfo.address}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="pt-4 border-t border-border mt-4">
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="text-muted-foreground leading-relaxed">
              {labInfo.description}
            </p>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <motion.button variants={itemVariants} className="px-6 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
            Edit Profile
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LabProfilePage;
