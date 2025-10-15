import express from 'express';
const router = express.Router();
import {
  getDonationCenters,
  getDonationCenterById,
  createDonationCenter,
  updateDonationCenter,
  deleteDonationCenter,
} from '../controllers/donationCenterController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(getDonationCenters).post(protect, authorizeRoles('Admin'), createDonationCenter);
router
  .route('/:id')
  .get(getDonationCenterById)
  .put(protect, authorizeRoles('Admin'), updateDonationCenter)
  .delete(protect, authorizeRoles('Admin'), deleteDonationCenter);

export default router;
