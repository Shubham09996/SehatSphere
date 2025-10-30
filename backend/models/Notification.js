import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      required: true,
      enum: ['User', 'Patient', 'Doctor', 'Shop', 'Admin'], // Who is the recipient of the notification
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['System', 'Appointment', 'Prescription', 'Order', 'Alert', 'Registration', 'Report', 'Inventory'],
      default: 'System',
    },
    icon: {
        type: String, // Storing Lucide icon name as a string
        default: 'Bell',
    },
    link: {
      type: String, // Frontend route to navigate to
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
    actions: [
        {
            label: { type: String },
            actionType: { type: String }, // e.g., 'approve', 'reject', 'view'
            // You might need more fields here like targetId for the action
        },
    ],
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
