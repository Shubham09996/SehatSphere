import mongoose from 'mongoose';

const medicineSchema = mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
    genericName: {
      type: String,
      required: true,
    },
    strength: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Cream', 'Gel', 'Other'],
    },
    manufacturer: {
      type: String,
    },
    description: {
      type: String,
    },
    usage: {
      type: String,
    },
    sideEffects: {
      type: String,
    },
    precautions: {
      type: String,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      default: '/uploads/default_medicine.jpg',
    },
    // For online search functionality, might need a field for external platform IDs
    // or a separate model for online listings.
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
