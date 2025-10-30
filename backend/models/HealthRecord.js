import mongoose from 'mongoose';

const healthRecordSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    recordType: {
      type: String,
      enum: ['Consultation', 'Lab Report', 'Allergy', 'Vaccination', 'Vital', 'Other'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // Generic details field for flexibility
    details: {
      type: mongoose.Schema.Types.Mixed, // Can store various types of details based on recordType
    },
    associatedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    fileUrl: {
        type: String, // For lab reports or other document uploads
    },
  },
  {
    timestamps: true,
  }
);

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

export default HealthRecord;
