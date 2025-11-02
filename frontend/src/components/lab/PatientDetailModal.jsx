import React, { useState, useEffect } from 'react';
import { X, Heart, AlertTriangle, Stethoscope, FlaskConical } from 'lucide-react'; // Removed MessageSquare
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; // NEW: Import useAuth

const PatientDetailModal = ({ isOpen, onClose, patientId }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // NEW: Get user from AuthContext

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!isOpen || !patientId) {
        setPatientDetails(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/patients/profile/${patientId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // NEW: Add Authorization header
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPatientDetails(data.personalInfo); // Assuming personalInfo contains the details needed
      } catch (err) {
        console.error("Failed to fetch patient details:", err);
        setError("Failed to load patient details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [isOpen, patientId, user]); // NEW: Add user to dependency array

  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose} // Close modal on backdrop click
        >
          <motion.div
            className="relative bg-card rounded-lg shadow-xl border border-border w-full max-w-md p-6 sm:p-8"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text mb-6 text-center">Patient Details</h2>

            {loading ? (
              <div className="text-center text-muted-foreground">Loading patient details...</div>
            ) : error ? (
              <div className="text-center text-red-500">Error: {error}</div>
            ) : patientDetails ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={patientDetails.pfp || `https://ui-avatars.com/api/?name=${patientDetails.name}`}
                    alt={patientDetails.name || 'Patient Avatar'}
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary/50 mb-3"
                  />
                  <p className="text-2xl font-bold text-foreground">{patientDetails.name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">Patient ID: <span className="font-semibold text-primary">{patientDetails.patientId}</span></p>
                </div>

                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 flex-shrink-0 text-hs-gradient-middle" />
                    <span><span className="font-semibold text-foreground">Blood Group:</span> {patientDetails.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FlaskConical className="h-5 w-5 flex-shrink-0 text-hs-gradient-middle" />
                    <span><span className="font-semibold text-foreground">Email:</span> {patientDetails.email || 'N/A'}</span>
                  </div>
                  {/* Removed Phone number display as per user request */}
                  {/*
                  <div className="flex items-center space-x-3">
                    <Stethoscope className="h-5 w-5 flex-shrink-0 text-hs-gradient-middle mt-1" />
                    <span><span className="font-semibold text-foreground">Phone:</span> {patientDetails.phoneNumber || 'N/A'}</span>
                  </div>
                  */}
                  {patientDetails.allergies && patientDetails.allergies.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500 mt-1" />
                      <span><span className="font-semibold text-foreground">Allergies:</span> {patientDetails.allergies.join(', ')}</span>
                    </div>
                  )}
                  {patientDetails.chronicConditions && patientDetails.chronicConditions.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Stethoscope className="h-5 w-5 flex-shrink-0 text-hs-gradient-middle mt-1" />
                      <span><span className="font-semibold text-foreground">Chronic Conditions:</span> {patientDetails.chronicConditions.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Removed Chat and View Full Record buttons */}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">No patient details available for this ID.</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PatientDetailModal;
