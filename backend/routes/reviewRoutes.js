import express from 'express';
const router = express.Router();
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsForEntity,
} from '../controllers/reviewController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

router.route('/').get(getReviews).post(protect, createReview);
router.route('/entity/:entityId').get(getReviewsForEntity);
router
  .route('/:id')
  .get(getReviewById)
  .put(protect, updateReview)
  .delete(protect, authorizeRoles('Admin'), deleteReview);

export default router;
