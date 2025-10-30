import asyncHandler from 'express-async-handler';
import ShopInventory from '../models/ShopInventory.js';
import Shop from '../models/Shop.js';
import Medicine from '../models/Medicine.js';

// @desc    Get all shop inventories (Admin only, or maybe filtered for specific shops)
// @route   GET /api/shopinventories
// @access  Private/Admin or Shop
const getShopInventories = asyncHandler(async (req, res) => {
  // Admins can see all inventories. Shops can only see their own.
  let query = {};
  if (req.user.role === 'Shop') {
      const shop = await Shop.findOne({ user: req.user._id });
      if (!shop) {
          res.status(404);
          throw new Error('Shop profile not found');
      }
      query = { shop: shop._id };
  }

  const shopInventories = await ShopInventory.find(query)
    .populate('shop', 'name location')
    .populate('medicine', 'brandName genericName strength price image');

  res.json(shopInventories);
});

// @desc    Get medicines for a specific shop
// @route   GET /api/shopinventories/shop/:shopId
// @access  Public
const getShopMedicines = asyncHandler(async (req, res) => {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) {
        res.status(404);
        throw new Error('Shop not found');
    }

    const shopMedicines = await ShopInventory.find({ shop: req.params.shopId, quantity: { $gt: 0 } })
      .populate('medicine', 'brandName genericName strength type manufacturer description usage sideEffects precautions category image');
    
    res.json(shopMedicines);
});

// @desc    Get single shop inventory item by ID
// @route   GET /api/shopinventories/:id
// @access  Private (Shop owner or Admin)
const getShopInventoryById = asyncHandler(async (req, res) => {
  const shopInventory = await ShopInventory.findById(req.params.id)
    .populate('shop', 'name location user')
    .populate('medicine', 'brandName genericName strength price image');

  if (shopInventory) {
    // Authorization: Only admin or the owner of the shop can view
    const isAuthorized = req.user.role === 'Admin' ||
                         (shopInventory.shop && shopInventory.shop.user && shopInventory.shop.user.toString() === req.user._id.toString());

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view this inventory item');
    }
    res.json(shopInventory);
  } else {
    res.status(404);
    throw new Error('Shop inventory item not found');
  }
});

// @desc    Create a shop inventory item
// @route   POST /api/shopinventories
// @access  Private/Admin or Shop
const createShopInventory = asyncHandler(async (req, res) => {
  const { shopId, medicineId, quantity, price } = req.body;

  const shop = await Shop.findById(shopId);
  if (!shop) {
    res.status(404);
    throw new Error('Shop not found');
  }

  const medicine = await Medicine.findById(medicineId);
  if (!medicine) {
    res.status(404);
    throw new Error('Medicine not found');
  }

  // Authorization: Only admin or the owner of the shop can create inventory for that shop
  if (req.user.role !== 'Admin' && shop.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to create inventory for this shop');
  }

  let shopInventory = await ShopInventory.findOne({ shop: shopId, medicine: medicineId });

  if (shopInventory) {
    // If item already exists, update quantity and price
    shopInventory.quantity += quantity;
    shopInventory.price = price; // Update price to the latest
  } else {
    // Create new inventory item
    shopInventory = new ShopInventory({
      shop: shopId,
      medicine: medicineId,
      quantity,
      price,
    });
  }

  const createdOrUpdatedInventory = await shopInventory.save();
  res.status(201).json(createdOrUpdatedInventory);
});

// @desc    Update a shop inventory item
// @route   PUT /api/shopinventories/:id
// @access  Private/Admin or Shop
const updateShopInventory = asyncHandler(async (req, res) => {
  const { quantity, price } = req.body;

  const shopInventory = await ShopInventory.findById(req.params.id);

  if (shopInventory) {
    // Authorization: Only admin or the owner of the shop can update their inventory
    const shop = await Shop.findById(shopInventory.shop);
    if (req.user.role !== 'Admin' && shop.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this inventory item');
    }

    shopInventory.quantity = quantity !== undefined ? quantity : shopInventory.quantity;
    shopInventory.price = price !== undefined ? price : shopInventory.price;

    const updatedShopInventory = await shopInventory.save();
    res.json(updatedShopInventory);
  } else {
    res.status(404);
    throw new Error('Shop inventory item not found');
  }
});

// @desc    Delete a shop inventory item
// @route   DELETE /api/shopinventories/:id
// @access  Private/Admin or Shop
const deleteShopInventory = asyncHandler(async (req, res) => {
  const shopInventory = await ShopInventory.findById(req.params.id);

  if (shopInventory) {
    // Authorization: Only admin or the owner of the shop can delete their inventory
    const shop = await Shop.findById(shopInventory.shop);
    if (req.user.role !== 'Admin' && shop.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this inventory item');
    }

    await shopInventory.deleteOne();
    res.json({ message: 'Shop inventory item removed' });
  } else {
    res.status(404);
    throw new Error('Shop inventory item not found');
  }
});

export { getShopInventories, getShopInventoryById, createShopInventory, updateShopInventory, deleteShopInventory, getShopMedicines };
