import mongoose from 'mongoose';

const billingSchema = mongoose.Schema(
  {
    billedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      required: true,
      enum: ['User', 'Patient', 'Doctor', 'Shop'], // Who is being billed (can be patient, doctor for subscriptions, shop for platform fees)
    },
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
      default: 'Pending',
    },
    items: [
      {
        description: { type: String, required: true },
        cost: { type: Number, required: true },
      },
    ],
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    // For patient billing, reference to appointment or prescription
    // For shop/doctor billing, reference to subscription plan
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedOnModel',
    },
    relatedOnModel: {
        type: String,
        enum: ['Appointment', 'Prescription', 'Subscription'], // Type of entity it's related to
    },
  },
  {
    timestamps: true,
  }
);

const Billing = mongoose.model('Billing', billingSchema);

export default Billing;
