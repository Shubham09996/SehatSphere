import express from 'express';
const router = express.Router();
import {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
} from '../controllers/hospitalController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(getHospitals).post(protect, authorizeRoles('Admin'), createHospital);
router
  .route('/:id')
  .get(getHospitalById)
  .put(protect, authorizeRoles('Admin'), updateHospital)
  .delete(protect, authorizeRoles('Admin'), deleteHospital);

export default router;
