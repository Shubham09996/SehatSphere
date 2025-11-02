import mongoose from 'mongoose';

const prescriptionSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Doctor',
    },
    prescriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    medicines: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medicine',
        },
        name: { type: String, required: true }, // Store name for easier display if medicine ref is null/deleted
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String },
        quantity: { type: Number }, // Quantity for ordering
      },
    ],
    notes: {
      type: String,
    },
    secretNotes: {
      type: String,
    },
    prescriptionImage: {
      type: String, // URL to the uploaded prescription image
    },
    status: {
        type: String,
        enum: ['Active', 'Expired', 'Archived'],
        default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
