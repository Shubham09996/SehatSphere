import express from 'express';
const router = express.Router();
import {
  getHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  getPatientHealthRecords,
} from '../controllers/healthRecordController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin', 'Doctor'), getHealthRecords).post(protect, authorizeRoles('Doctor', 'Patient'), createHealthRecord);
router.route('/patient/:patientId').get(protect, authorizeRoles('Patient', 'Admin', 'Doctor'), getPatientHealthRecords);
router
  .route('/:id')
  .get(protect, authorizeRoles('Admin', 'Doctor', 'Patient'), getHealthRecordById)
  .put(protect, authorizeRoles('Admin', 'Doctor', 'Patient'), updateHealthRecord)
  .delete(protect, authorizeRoles('Admin', 'Doctor'), deleteHealthRecord);

export default router;
