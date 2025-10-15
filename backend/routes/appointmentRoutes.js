import express from 'express';
const router = express.Router();
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getMyAppointments,
} from '../controllers/appointmentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin', 'Doctor'), getAppointments).post(protect, authorizeRoles('Patient'), createAppointment);
router.route('/myappointments').get(protect, getMyAppointments);
router
  .route('/:id')
  .get(protect, authorizeRoles('Admin', 'Doctor', 'Patient'), getAppointmentById)
  .put(protect, authorizeRoles('Admin', 'Doctor', 'Patient'), updateAppointment)
  .delete(protect, authorizeRoles('Admin', 'Doctor'), deleteAppointment);

export default router;
