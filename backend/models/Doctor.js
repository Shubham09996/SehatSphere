import mongoose from 'mongoose';

const doctorSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    specialty: {
      type: String,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    medicalRegistrationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    bio: {
      type: String,
    },
    expertise: [
      { type: String },
    ],
    consultationFee: {
      type: Number,
      default: 0,
    },
    appointmentDuration: {
      type: Number, // in minutes
      default: 15,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    workSchedule: {
      // Store availability for each day, e.g., { Monday: { from: '09:00', to: '17:00', enabled: true } }
      type: Map,
      of: new mongoose.Schema({
        from: String,
        to: String,
        enabled: { type: Boolean, default: true },
      }),
      default: {},
    },
    // Add average rating and number of reviews here or as a virtual
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
