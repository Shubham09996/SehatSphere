import mongoose from 'mongoose';

const labTestOrderSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    lab: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Lab',
    },
    testName: {
      type: String,
      required: true,
    },
    testType: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Sample Collected', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    result: {
      type: String, // Can be a URL to a file or a string containing the result
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completionDate: {
      type: Date,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const LabTestOrder = mongoose.model('LabTestOrder', labTestOrderSchema);

export default LabTestOrder;
