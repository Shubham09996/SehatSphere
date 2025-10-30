import mongoose from 'mongoose';

const donationCenterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: String, // Can be a simple string or a GeoJSON point for advanced queries
      required: true,
    },
    contactPhone: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    operatingHours: {
        type: Map,
        of: new mongoose.Schema({
            from: String,
            to: String,
            enabled: { type: Boolean, default: true },
        }),
        default: {},
    },
    image: {
        type: String,
        default: '/uploads/default_donation_center.jpg',
    },
  },
  {
    timestamps: true,
  }
);

const DonationCenter = mongoose.model('DonationCenter', donationCenterSchema);

export default DonationCenter;
