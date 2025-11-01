import mongoose from 'mongoose';

const patientSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    primaryPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null, // This patient is a family member of primaryPatient
    },
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    profilePicture: {
      type: String,
      default: '/uploads/default.jpg',
    },
    bloodGroup: {
      type: String,
    },
    emergencyContact: {
      name: { type: String },
      relation: { type: String },
      phone: { type: String },
    },
    allergies: [
      { type: String },
    ],
    chronicConditions: [
      { type: String },
    ],
    // Vitals can be stored here or in a separate HealthRecord model
    // For simplicity, let's keep basic vitals here for quick access
    recentVitals: {
      bloodPressure: { type: String },
      bloodSugar: { type: String },
      bmi: { type: String },
      lastChecked: { type: Date },
    },
    // Premium status might be stored in User model or here
    isPremium: {
        type: Boolean,
        default: false,
    },
    // Add more patient-specific fields as identified from frontend analysis
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
