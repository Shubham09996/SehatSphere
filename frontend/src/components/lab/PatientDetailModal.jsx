import React from 'react';
import { X, Heart, AlertTriangle, Stethoscope, FlaskConical } from 'lucide-react'; // Removed MessageSquare
import { motion, AnimatePresence } from 'framer-motion';

const PatientDetailModal = ({ isOpen, onClose, patientId }) => {
  const mockPatientData = {
    'patient_id_1': {
      _id: 'patient_id_1',
      user: {
        name: 'Priya Sharma',
        profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      test: 'Blood Test',
      bloodGroup: 'A+',
      allergies: ['Penicillin', 'Dust'],
      medicalHistory: ['Asthma'],
    },
    'patient_id_2': {
      _id: 'patient_id_2',
      user: {
        name: 'Rahul Verma',
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      test: 'Urine Analysis',
      bloodGroup: 'B-',
      allergies: [],
      medicalHistory: ['Hypertension'],
    },
    'patient_id_3': {
      _id: 'patient_id_3',
      user: {
        name: 'Sneha Singh',
        profilePicture: 'https://randomuser.me/api/portraits/women/67.jpg',
      },
      test: 'X-Ray',
      bloodGroup: 'O+',
      allergies: ['Pollen'],
      medicalHistory: [],
    },
  };

  const patientDetails = mockPatientData[patientId];

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

            {patientDetails ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={patientDetails.user?.profilePicture || `https://ui-avatars.com/api/?name=${patientDetails.user?.name}`}
                    alt={patientDetails.user?.name || 'Patient Avatar'}
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary/50 mb-3"
                  />
                  <p className="text-2xl font-bold text-foreground">{patientDetails.user?.name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">Patient ID: <span className="font-semibold text-primary">{patientDetails._id}</span></p>
                </div>

                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 flex-shrink-0 text-hs-gradient-middle" />
                    <span><span className="font-semibold text-foreground">Blood Group:</span> {patientDetails.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FlaskConical className="h-5 w-5 flex-shrink-0 text-hs-gradient-middle" />
                    <span><span className="font-semibold text-foreground">Test:</span> {patientDetails.test || 'N/A'}</span>
                  </div>
                  {patientDetails.allergies && patientDetails.allergies.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500 mt-1" />
                      <span><span className="font-semibold text-foreground">Allergies:</span> {patientDetails.allergies.join(', ')}</span>
                    </div>
                  )}
                  {patientDetails.medicalHistory && patientDetails.medicalHistory.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Stethoscope className="h-5 w-5 flex-shrink-0 text-hs-gradient-middle mt-1" />
                      <span><span className="font-semibold text-foreground">Medical History:</span> {patientDetails.medicalHistory.join(', ')}</span>
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
