import express from 'express';
const router = express.Router();
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
} from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin', 'Shop'), getOrders).post(protect, authorizeRoles('Patient'), createOrder);
router.route('/myorders').get(protect, getMyOrders);
router
  .route('/:id')
  .get(protect, authorizeRoles('Admin', 'Shop', 'Patient'), getOrderById)
  .put(protect, authorizeRoles('Admin', 'Shop'), updateOrder)
  .delete(protect, authorizeRoles('Admin', 'Shop'), deleteOrder);

export default router;
