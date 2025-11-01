import mongoose from 'mongoose';

const hospitalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    user: { // NEW: Link to the User model (Hospital role)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // A user can only onboard one hospital
    },
    description: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    directorName: {
        type: String,
        required: true,
    },
    numberOfBeds: {
        type: Number,
        required: true,
        default: 0,
    },
    website: {
        type: String,
    },
    specialties: [
        { type: String }
    ],
    emergencyServices: {
        type: Boolean,
        default: false,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
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
    status: { // NEW: Add status for approval workflow
        type: String,
        enum: ['Pending', 'Active', 'Suspended', 'Rejected'],
        default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
