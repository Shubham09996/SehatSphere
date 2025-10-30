import express from 'express';
const router = express.Router();
import {
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  deleteNotification,
  getMyNotifications,
} from '../controllers/notificationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(protect, authorizeRoles('Admin'), getNotifications);
router.route('/mynotifications').get(protect, getMyNotifications);
router
  .route('/:id')
  .get(protect, getNotificationById)
  .put(protect, markNotificationAsRead)
  .delete(protect, deleteNotification);

export default router;
