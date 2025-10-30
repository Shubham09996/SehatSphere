import mongoose from 'mongoose';

const shopInventorySchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Medicine',
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
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

// Ensure that a shop can only have one entry for a given medicine
shopInventorySchema.index({ shop: 1, medicine: 1 }, { unique: true });

const ShopInventory = mongoose.model('ShopInventory', shopInventorySchema);

export default ShopInventory;
