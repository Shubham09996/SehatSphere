import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Patient', 'Doctor', 'Shop', 'Admin', 'Donor', 'Hospital', 'Lab'],
      default: 'Patient',
    },
    profilePicture: {
      type: String,
      default: '/uploads/default.jpg',
    },
    phoneNumber: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Suspended'],
        default: 'Active',
    },
    rewardPoints: {
        type: Number,
        default: 0,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    notificationPreferences: {
        type: new mongoose.Schema({
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            inApp: { type: Boolean, default: true },
        }),
        default: {},
    },
    // Common fields for all users, specific details will be in their respective models
    googleId: { // NEW: Add googleId for linking Google accounts
        type: String,
        unique: true, // Should be unique
        sparse: true, // Allows null values, so users without googleId can still exist
    },
    isNewUser: { // NEW: Add isNewUser flag
        type: Boolean,
        default: false,
    },
    specificProfileId: { // NEW: Add specificProfileId to store patientId, doctorId, shopId
        type: String,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null,
    },
    lab: { // NEW: Add lab field to link to Lab model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
