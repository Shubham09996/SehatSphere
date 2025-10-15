import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    reviewedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      required: true,
      enum: ['Doctor', 'Hospital', 'Shop'],
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average rating for Doctor/Hospital/Shop on save
reviewSchema.statics.getAverageRating = async function (entityId, onModel) {
  const obj = await this.aggregate([
    { $match: { reviewedEntity: entityId, onModel: onModel } },
    { $group: { _id: '$reviewedEntity', avgRating: { $avg: '$rating' }, numOfReviews: { $sum: 1 } } },
  ]);

  try {
    await mongoose.model(onModel).findByIdAndUpdate(entityId, {
      averageRating: obj[0] ? Math.round(obj[0].avgRating * 10) / 10 : 0,
      numberOfReviews: obj[0] ? obj[0].numOfReviews : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.reviewedEntity, this.onModel);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
