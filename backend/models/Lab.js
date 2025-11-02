import mongoose from 'mongoose';

const LabSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    labId: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    // Add other lab-specific fields as needed
  },
  { 
    timestamps: true 
  }
);

const Lab = mongoose.model('Lab', LabSchema);

export default Lab;
