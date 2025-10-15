import mongoose from 'mongoose';

const donationSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    donationCenter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'DonationCenter',
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    bloodGroup: {
      type: String,
      required: true, // Patient's blood group at time of donation
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
