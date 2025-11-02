import express from 'express';
const router = express.Router();
import {
  getDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfile,
  updateDoctorSchedule,
  getAvailableDoctorSlots,
  getDoctorDashboardStats,
  updateAppointmentStatus,
  getDoctorHourlyActivity,
  getDoctorAppointmentQueue,
  getDoctorDailyAvailability, // Import the new controller function
  onboardDoctorProfile, // Import the new controller function
} from '../controllers/doctorController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(getDoctors).post(protect, authorizeRoles('Admin'), createDoctorProfile);
router.post('/onboard', protect, authorizeRoles('Doctor'), onboardDoctorProfile); // NEW: Doctor onboarding route
router.route('/dashboard-stats/:medicalRegistrationNumber').get(protect, authorizeRoles('Doctor'), getDoctorDashboardStats);
router.route('/hourly-activity/:medicalRegistrationNumber').get(protect, authorizeRoles('Doctor'), getDoctorHourlyActivity);
router.route('/appointment-queue/:medicalRegistrationNumber').get(protect, authorizeRoles('Doctor'), getDoctorAppointmentQueue);
router.route('/profile/:medicalRegistrationNumber')
  .get(getDoctorById)
  .put(protect, authorizeRoles('Doctor', 'Admin'), updateDoctorProfile);
router
  .route('/:id')
  .get(getDoctorById)
  .put(protect, authorizeRoles('Doctor', 'Admin'), updateDoctorProfile)
  .delete(protect, authorizeRoles('Admin'), deleteDoctorProfile);
router.route('/schedule/:id').put(protect, authorizeRoles('Doctor', 'Admin'), updateDoctorSchedule);
router.route('/available-slots/:doctorId').get(getAvailableDoctorSlots);
router.route('/daily-availability/:doctorId').get(getDoctorDailyAvailability); // New route for daily availability
router.route('/appointments/:id/status').put(protect, authorizeRoles('Doctor'), updateAppointmentStatus);

export default router;
