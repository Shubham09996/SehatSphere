import express from 'express';
const router = express.Router();
console.log('patientRoutes.js: Router initialized'); // Debug log
import {
  getPatients,
  getPatientProfile,
  updatePatientProfile,
  createPatientProfile,
  deletePatientProfile,
  getPatientDashboardStats,
  updateRewardPoints,
  getUpcomingAppointments,
  getPatientById,
  getPatientHistory,
} from '../controllers/patientController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin', 'Doctor'), getPatients).post(protect, authorizeRoles('Admin'), createPatientProfile);
router.route('/dashboard-stats').get(protect, authorizeRoles('Patient'), getPatientDashboardStats);
router.route('/upcoming-appointments').get(protect, authorizeRoles('Patient'), getUpcomingAppointments);
router.route('/:id/reward-points').put(protect, authorizeRoles('Admin', 'Doctor'), updateRewardPoints);

// NEW: Route to get patient profile by userId
router.route('/user/:userId').get(protect, getPatientProfile); // Using existing getPatientProfile controller

router
  .route('/profile/:idOrPatientId') // Flexible route to get profile by MongoDB _id or patientId string
  .get(protect, getPatientProfile)
  .put(protect, authorizeRoles('Patient', 'Admin'), updatePatientProfile)
  .delete(protect, authorizeRoles('Admin'), deletePatientProfile);

// Doctor fetches patient by ID for prescriptions or other needs
router.route('/:id').get(protect, authorizeRoles('Doctor', 'Admin'), getPatientById);

// NEW: Route to get patient history
router.route('/:patientId/history').get(protect, authorizeRoles('Doctor', 'Admin', 'Patient'), getPatientHistory);

export const patientRoutes = router; // Change to named export
