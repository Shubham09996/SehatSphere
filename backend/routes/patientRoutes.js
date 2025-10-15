import express from 'express';
const router = express.Router();
import {
  getPatients,
  getPatientProfile,
  updatePatientProfile,
  createPatientProfile,
  deletePatientProfile,
  getPatientDashboardStats,
  updateRewardPoints,
  getUpcomingAppointments,
} from '../controllers/patientController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin', 'Doctor'), getPatients).post(protect, authorizeRoles('Admin'), createPatientProfile);
router.route('/dashboard-stats').get(protect, authorizeRoles('Patient'), getPatientDashboardStats);
router.route('/upcoming-appointments').get(protect, authorizeRoles('Patient'), getUpcomingAppointments);
router.route('/:id/reward-points').put(protect, authorizeRoles('Admin', 'Doctor'), updateRewardPoints);
router
  .route('/profile/:idOrPatientId') // Flexible route to get profile by MongoDB _id or patientId string
  .get(protect, getPatientProfile)
  .put(protect, authorizeRoles('Patient', 'Admin'), updatePatientProfile)
  .delete(protect, authorizeRoles('Admin'), deletePatientProfile);

export default router;
