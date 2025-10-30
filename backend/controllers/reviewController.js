import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Doctor from '../models/Doctor.js';
import Hospital from '../models/Hospital.js';
import Shop from '../models/Shop.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public (or Private/Admin if filtered)
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate('user', 'name profilePicture')
    .populate('reviewedEntity', 'name specialty');

  res.json(reviews);
});

// @desc    Get reviews for a specific entity (Doctor, Hospital, Shop)
// @route   GET /api/reviews/entity/:entityId
// @access  Public
const getReviewsForEntity = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ reviewedEntity: req.params.entityId })
      .populate('user', 'name profilePicture')
      .populate('reviewedEntity', 'name specialty');

    res.json(reviews);
});

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name profilePicture')
    .populate('reviewedEntity', 'name specialty');

  if (review) {
    res.json(review);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, reviewedEntityId, onModel } = req.body;

  // Check if the entity exists
  let entity;
  if (onModel === 'Doctor') entity = await Doctor.findById(reviewedEntityId);
  else if (onModel === 'Hospital') entity = await Hospital.findById(reviewedEntityId);
  else if (onModel === 'Shop') entity = await Shop.findById(reviewedEntityId);
  
  if (!entity) {
    res.status(404);
    throw new Error(`${onModel} not found`);
  }

  // Check if user has already reviewed this entity (optional, but good for data integrity)
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    reviewedEntity: reviewedEntityId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this entity');
  }

  const review = new Review({
    user: req.user._id,
    rating,
    comment,
    reviewedEntity: reviewedEntityId,
    onModel,
  });

  const createdReview = await review.save();

  // Trigger static method to update average rating
  // This is handled by the `post('save')` hook in the Review model.

  // Notify entity owner about new review (e.g., Doctor, Shop)
  let recipientId = null;
  let recipientOnModel = null;

  if (onModel === 'Doctor') {
      const doctor = await Doctor.findById(reviewedEntityId);
      if (doctor) { recipientId = doctor._id; recipientOnModel = 'Doctor'; }
  } else if (onModel === 'Shop') {
      const shop = await Shop.findById(reviewedEntityId);
      if (shop) { recipientId = shop._id; recipientOnModel = 'Shop'; }
  }
  // For Hospital, notification might go to an Admin user associated with the hospital

  if (recipientId && recipientOnModel) {
    await Notification.create({
        recipient: recipientId,
        onModel: recipientOnModel,
        title: 'New Review Received',
        message: `You received a new ${rating}-star review from ${req.user.name}.`,
        category: 'Review',
        link: `/${recipientOnModel.toLowerCase()}/reviews/${createdReview._id}`,
    });
  }

  res.status(201).json(createdReview);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const review = await Review.findById(req.params.id);

  if (review) {
    // Authorization: Only the user who created the review can update it
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this review');
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    // Trigger static method to update average rating
    // This is handled by the `post('save')` hook in the Review model.
    res.json(updatedReview);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    // Authorization: Only Admin can delete reviews (or possibly the creator, but admin control is safer)
    if (req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized to delete this review');
    }
    
    await review.deleteOne();
    // Trigger static method to update average rating (after deletion)
    // This is handled by the `post('remove')` hook in the Review model (need to add this hook).
    // For now, it won't auto-update on delete, consider adding `reviewSchema.post('remove', ...)`
    res.json({ message: 'Review removed' });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

export { getReviews, getReviewById, createReview, updateReview, deleteReview, getReviewsForEntity };
