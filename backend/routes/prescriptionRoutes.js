import express from 'express';
const router = express.Router();
import {
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getPatientPrescriptions,
  getPrescriptionsForDoctor,
} from '../controllers/prescriptionController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').post(protect, authorizeRoles('Doctor'), createPrescription);
router
  .route('/patient')
  .get(protect, authorizeRoles('Patient', 'Admin', 'Doctor'), getPatientPrescriptions);
router
  .route('/doctor')
  .get(protect, authorizeRoles('Doctor'), getPrescriptionsForDoctor);
router
  .route('/:id')
  .get(protect, authorizeRoles('Admin', 'Doctor', 'Patient'), getPrescriptionById)
  .put(protect, authorizeRoles('Admin', 'Doctor'), updatePrescription)
  .delete(protect, authorizeRoles('Admin', 'Doctor'), deletePrescription);

export default router;
