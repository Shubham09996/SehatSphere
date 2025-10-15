import mongoose from 'mongoose';

const billingRecordSchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Completed',
    },
    description: {
      type: String,
    },
    billingDate: {
      type: Date,
      default: Date.now,
    },
    // Reference to the subscription if this billing record is for a subscription payment
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop', // Refers to the Shop's subscription field
    },
  },
  {
    timestamps: true,
  }
);

const BillingRecord = mongoose.model('BillingRecord', billingRecordSchema);

export default BillingRecord;
