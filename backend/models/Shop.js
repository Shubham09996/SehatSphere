import mongoose from 'mongoose';

const shopSchema = mongoose.Schema(
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
    address: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    logo: {
        type: String,
        default: '/uploads/default_shop.jpg',
    },
    openingHours: {
        type: Map,
        of: new mongoose.Schema({
          from: String,
          to: String,
          enabled: { type: Boolean, default: true },
        }),
        default: {},
    },
    affiliatedHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    subscription: {
        plan: { type: String, enum: ['Free', 'Premium'], default: 'Free' },
        price: { type: Number, default: 0 },
        nextBillingDate: { type: Date },
    },
    // Add more shop-specific fields like staff, integrations etc.
    // Staff can be Users with role 'Staff' and a reference to shop
    staff: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            role: { type: String, enum: ['Pharmacist', 'Cashier', 'Manager'] },
        },
    ],
    integrations: {
        type: Map,
        of: new mongoose.Schema({
            apiKey: { type: String }, // Store API keys securely
            secret: { type: String }, // Store secrets securely
            enabled: { type: Boolean, default: false },
            // Add other integration-specific fields as needed
        }),
        default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
