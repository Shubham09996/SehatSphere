import express from 'express';
const router = express.Router();
import {
  getDonations,
  getDonationById,
  createDonation,
  updateDonationStatus,
  deleteDonation,
  getMyDonations,
} from '../controllers/donationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin'), getDonations).post(protect, authorizeRoles('Patient'), createDonation);
router.route('/my-donations').get(protect, authorizeRoles('Patient', 'Admin'), getMyDonations);
router
  .route('/:id')
  .get(protect, getDonationById)
  .put(protect, authorizeRoles('Admin', 'Donor'), updateDonationStatus)
  .delete(protect, authorizeRoles('Admin'), deleteDonation);

export default router;
