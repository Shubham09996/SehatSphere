import express from 'express';
const router = express.Router();
import {
  getBillings,
  getBillingById,
  createBilling,
  updateBilling,
  deleteBilling,
  getMyBillings,
} from '../controllers/billingController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin', 'Shop'), getBillings).post(protect, authorizeRoles('Admin', 'Doctor', 'Shop'), createBilling);
router.route('/mybillings').get(protect, getMyBillings);
router
  .route('/:id')
  .get(protect, authorizeRoles('Admin', 'Doctor', 'Shop', 'Patient'), getBillingById)
  .put(protect, authorizeRoles('Admin', 'Shop'), updateBilling)
  .delete(protect, authorizeRoles('Admin', 'Shop'), deleteBilling);

export default router;
