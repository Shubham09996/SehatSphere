import express from 'express';
const router = express.Router();
import {
  getShops,
  getShopById,
  createShopProfile,
  updateShopProfile,
  deleteShopProfile,
  getShopSalesAnalytics,
  updateShopSubscription, // NEW: Import updateShopSubscription
  getShopStaff,
  addShopStaff,
  updateShopStaffRole,
  removeShopStaff, // NEW: Import staff management functions
  updateShopIntegrations, // NEW: Import updateShopIntegrations
} from '../controllers/shopController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(getShops).post(protect, authorizeRoles('Admin'), createShopProfile);
router
  .route('/:id')
  .get(getShopById)
  .put(protect, authorizeRoles('Shop', 'Admin'), updateShopProfile)
  .delete(protect, authorizeRoles('Admin'), deleteShopProfile);
router.route('/:id/analytics/sales').get(protect, authorizeRoles('Shop', 'Admin'), getShopSalesAnalytics); // New route for sales analytics
// Route for updating shop subscription
router.route('/:id/subscription').put(protect, authorizeRoles('Shop', 'Admin'), updateShopSubscription);

// Shop Staff Management Routes
router.route('/:id/staff')
    .get(protect, authorizeRoles('Shop', 'Admin'), getShopStaff)
    .post(protect, authorizeRoles('Shop', 'Admin'), addShopStaff);

router.route('/:shopId/staff/:userId')
    .put(protect, authorizeRoles('Shop', 'Admin'), updateShopStaffRole)
    .delete(protect, authorizeRoles('Shop', 'Admin'), removeShopStaff);

// NEW: Route for updating shop integrations
router.route('/:id/integrations').put(protect, authorizeRoles('Shop', 'Admin'), updateShopIntegrations);

export default router;
