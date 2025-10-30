import mongoose from 'mongoose';

const hospitalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '/uploads/default_hospital.jpg',
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    departments: [
      { type: String },
    ],
    // These stats can be virtuals or calculated dynamically
    // from related Doctor and Patient models
    stats: {
      totalDoctors: { type: Number, default: 0 },
      patientsToday: { type: Number, default: 0 },
      avgWaitTime: { type: String, default: 'N/A' },
      rating: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
