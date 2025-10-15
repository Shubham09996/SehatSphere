import express from 'express';
const router = express.Router();
import {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getPatientPrescriptions,
} from '../controllers/prescriptionController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin', 'Doctor'), getPrescriptions).post(protect, authorizeRoles('Doctor'), createPrescription);
router
  .route('/patient')
  .get(protect, authorizeRoles('Patient', 'Admin', 'Doctor'), getPatientPrescriptions);
router
  .route('/:id')
  .get(protect, authorizeRoles('Admin', 'Doctor', 'Patient'), getPrescriptionById)
  .put(protect, authorizeRoles('Admin', 'Doctor'), updatePrescription)
  .delete(protect, authorizeRoles('Admin', 'Doctor'), deletePrescription);

export default router;
