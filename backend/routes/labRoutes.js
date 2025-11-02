import express from 'express';
const router = express.Router();

import {
  getLabProfile,
  updateLabProfile,
  getLabs,
  deleteLab,
  getLabDashboardStats,
  getRecentLabOrders,
  getLabInventorySummary,
  getDailyTestOrdersTrend,
  getLabTestOrders,
  getLabPatients,
  getLabDoctors,
  generateLabReport,
  uploadLabReport,
  getLabReports,
  getAvailableLabs, // NEW: Import getAvailableLabs
  getLabTests, // NEW: Import getLabTests
  createLabTestOrder, // NEW: Import createLabTestOrder
  addLabTest,
} from '../controllers/labController.js';

import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

// Public routes (for patients to view available labs)
router.route('/available').get(getAvailableLabs);

router.route('/:labId/tests').get(getLabTests).post(protect, authorizeRoles('Lab'), addLabTest); // NEW: Add route for adding lab tests

// NEW: Route for booking a lab test (patient-facing)
router.route('/lab-test-orders').post(protect, authorizeRoles('Patient'), createLabTestOrder);

// Admin routes
router.route('/').get(protect, authorizeRoles('Admin'), getLabs);
router.route('/:id').delete(protect, authorizeRoles('Admin'), deleteLab);

// Lab specific routes
router.route('/profile/:id')
  .get(protect, authorizeRoles('Lab', 'Admin'), getLabProfile)
  .put(protect, authorizeRoles('Lab'), updateLabProfile);

// Lab Dashboard Routes
router.route('/dashboard/stats').get(protect, authorizeRoles('Lab', 'Admin'), getLabDashboardStats);
router.route('/dashboard/recent-orders').get(protect, authorizeRoles('Lab', 'Admin'), getRecentLabOrders);
router.route('/dashboard/inventory-summary').get(protect, authorizeRoles('Lab', 'Admin'), getLabInventorySummary);
router.route('/dashboard/daily-trend').get(protect, authorizeRoles('Lab', 'Admin'), getDailyTestOrdersTrend);

// NEW: Route for Lab Test Order Management
router.route('/test-orders').get(protect, authorizeRoles('Lab', 'Admin'), getLabTestOrders);

// NEW: Routes for Report & Data Management
router.route('/patients').get(protect, authorizeRoles('Lab', 'Admin'), getLabPatients);
router.route('/doctors').get(protect, authorizeRoles('Lab', 'Admin'), getLabDoctors);
router.route('/reports/generate').post(protect, authorizeRoles('Lab', 'Admin'), generateLabReport);
router.route('/reports/upload').post(protect, authorizeRoles('Lab', 'Admin'), uploadLabReport);
router.route('/reports').get(protect, authorizeRoles('Lab', 'Admin'), getLabReports);

export default router;
