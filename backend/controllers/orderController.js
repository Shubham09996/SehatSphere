import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Patient from '../models/Patient.js';
import Shop from '../models/Shop.js';
import Medicine from '../models/Medicine.js';
import ShopInventory from '../models/ShopInventory.js'; // Import ShopInventory
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendSms } from '../services/twilioService.js';

// @desc    Get all orders (Admin/Shop only)
// @route   GET /api/orders
// @access  Private/Admin or Shop
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('patient', 'patientId user')
    .populate('shop', 'name location user')
    .populate('prescription', 'prescriptionId')
    .populate('orderItems.medicine', 'brandName genericName strength');

  res.json(orders);
});

// @desc    Get orders for the logged-in user (Patient, Shop, Admin)
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) {
            res.status(404);
            throw new Error('Patient profile not found');
        }
        query = { patient: patient._id };
    } else if (req.user.role === 'Shop') {
        const shop = await Shop.findOne({ user: req.user._id });
        if (!shop) {
            res.status(404);
            throw new Error('Shop profile not found');
        }
        query = { shop: shop._id };
    }
    // Admins can see all orders (no specific query needed for admin)

    const orders = await Order.find(query)
      .populate('patient', 'patientId user')
      .populate('shop', 'name location user')
      .populate('prescription', 'prescriptionId')
      .populate('orderItems.medicine', 'brandName genericName strength');

    res.json(orders);
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin, Shop or Patient
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('patient', 'patientId user')
    .populate('shop', 'name location user')
    .populate('prescription', 'prescriptionId')
    .populate('orderItems.medicine', 'brandName genericName strength');

  if (order) {
    // Authorization: Only admin, the patient who made the order, or the shop processing the order can view
    const isAuthorized = req.user.role === 'Admin' || 
                         (order.patient && order.patient.user && order.patient.user.toString() === req.user._id.toString()) ||
                         (order.shop && order.shop.user && order.shop.user.toString() === req.user._id.toString());

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Create an order (Patient only)
// @route   POST /api/orders
// @access  Private/Patient
const createOrder = asyncHandler(async (req, res) => {
  const { shopId, prescriptionId, prescriptionImage, orderItems, deliveryAddress } = req.body;

  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }

  const shop = await Shop.findById(shopId);
  if (!shop) {
      res.status(404);
      throw new Error('Shop not found');
  }

  // Calculate total price and validate order items
  let totalPrice = 0;
  for (const item of orderItems) {
      const medicine = await Medicine.findById(item.medicine);
      if (!medicine) {
          res.status(400);
          throw new Error(`Medicine not found for ID: ${item.medicine}`);
      }

      // Check medicine availability in shop inventory
      const shopInventoryItem = await ShopInventory.findOne({ shop: shopId, medicine: item.medicine });
      if (!shopInventoryItem || shopInventoryItem.quantity < item.quantity) {
          res.status(400);
          throw new Error(`Insufficient stock for ${medicine.brandName} in ${shop.name}`);
      }

      totalPrice += shopInventoryItem.price * item.quantity; // Use price from shop inventory
      item.price = shopInventoryItem.price; // Store current price from inventory at time of order
  }

  const order = new Order({
    patient: patient._id,
    shop: shopId,
    prescription: prescriptionId || null,
    prescriptionImage,
    orderItems,
    totalPrice,
    deliveryAddress,
    status: 'New',
    paymentStatus: 'Pending',
  });

  const createdOrder = await order.save();

  // Deduct quantities from shop inventory
  for (const item of orderItems) {
      await ShopInventory.findOneAndUpdate(
          { shop: shopId, medicine: item.medicine },
          { $inc: { quantity: -item.quantity } }
      );
  }

  // Notify shop and patient
  if (patient.user && patient.user.phoneNumber) {
      const patientUser = await User.findById(patient.user);
      if (patientUser && patientUser.phoneNumber) {
        const msg = `Hello ${patientUser.name}, your order #${createdOrder._id} has been placed with ${shop.name}. Total: ${createdOrder.totalPrice}.`;
        sendSms(patientUser.phoneNumber, msg);
      }
  }
  if (shop.user && shop.user.phoneNumber) {
      const shopUser = await User.findById(shop.user);
      if (shopUser && shopUser.phoneNumber) {
        const msg = `Hello ${shopUser.name}, a new order #${createdOrder._id} from ${patient.user.name} has been placed.`;
        sendSms(shopUser.phoneNumber, msg);
      }
  }

  await Notification.create({
      recipient: patient._id,
      onModel: 'Patient',
      title: 'Order Placed',
      message: `Your order #${createdOrder._id} has been placed with ${shop.name}. Total: ${createdOrder.totalPrice}.`,
      category: 'Order',
      link: `/patient/orders/${createdOrder._id}`,
  });

  await Notification.create({
      recipient: shop._id,
      onModel: 'Shop',
      title: 'New Order Received',
      message: `New order #${createdOrder._id} from ${patient.user.name}.`,
      category: 'Order',
      link: `/shop/orders/${createdOrder._id}`,
  });

  res.status(201).json(createdOrder);
});

// @desc    Update an order (Admin/Shop only)
// @route   PUT /api/orders/:id
// @access  Private/Admin or Shop
const updateOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, status, paymentStatus, deliveryAddress } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    // Authorization: Only admin or the shop processing the order can update
    let isAuthorized = req.user.role === 'Admin';
    if (!isAuthorized && req.user.role === 'Shop') {
        const shop = await Shop.findOne({ user: req.user._id });
        if (shop && order.shop.toString() === shop._id.toString()) isAuthorized = true;
    }

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to update this order');
    }

    // If order items are updated, re-validate and adjust inventory (this can be complex, simplified for now)
    // For a real-world scenario, you might need to handle partial updates, returns, etc.
    if (orderItems) {
        // This is a simplified approach. A more robust solution would involve comparing old and new items
        // and adjusting inventory accordingly (e.g., if quantity decreases, add back to stock).
        // For now, we will just ensure new order items have enough stock.

        for (const newItem of orderItems) {
            const existingItem = order.orderItems.find(item => item.medicine.toString() === newItem.medicine.toString());
            if (existingItem) {
                // If item existed, check if quantity increased
                if (newItem.quantity > existingItem.quantity) {
                    const quantityNeeded = newItem.quantity - existingItem.quantity;
                    const shopInventoryItem = await ShopInventory.findOne({ shop: order.shop, medicine: newItem.medicine });
                    if (!shopInventoryItem || shopInventoryItem.quantity < quantityNeeded) {
                        res.status(400);
                        throw new Error(`Insufficient stock for ${newItem.name} during update.`);
                    }
                    await ShopInventory.findOneAndUpdate(
                        { shop: order.shop, medicine: newItem.medicine },
                        { $inc: { quantity: -quantityNeeded } }
                    );
                }
                // If quantity decreased, a more robust system would add back to inventory. Skipping for now.
            } else {
                // If new item, check full quantity
                const shopInventoryItem = await ShopInventory.findOne({ shop: order.shop, medicine: newItem.medicine });
                if (!shopInventoryItem || shopInventoryItem.quantity < newItem.quantity) {
                    res.status(400);
                    throw new Error(`Insufficient stock for new item ${newItem.name} during update.`);
                }
                await ShopInventory.findOneAndUpdate(
                    { shop: order.shop, medicine: newItem.medicine },
                    { $inc: { quantity: -newItem.quantity } }
                );
            }
        }
    }

    order.orderItems = orderItems || order.orderItems;
    order.totalPrice = totalPrice || order.totalPrice;
    order.status = status || order.status;
    order.paymentStatus = paymentStatus || order.paymentStatus;
    order.deliveryAddress = deliveryAddress || order.deliveryAddress;

    const updatedOrder = await order.save();

    // Notify patient and shop about order status change
    const patient = await Patient.findById(updatedOrder.patient);
    const shop = await Shop.findById(updatedOrder.shop);

    if (patient && patient.user) {
        const patientUser = await User.findById(patient.user);
        if (patientUser && patientUser.phoneNumber) {
            const msg = `Hello ${patientUser.name}, your order #${updatedOrder._id} status is now ${updatedOrder.status}.`;
            sendSms(patientUser.phoneNumber, msg);
        }
    }
    await Notification.create({
        recipient: patient._id,
        onModel: 'Patient',
        title: 'Order Status Update',
        message: `Your order #${updatedOrder._id} status is now ${updatedOrder.status}.`,
        category: 'Order',
        link: `/patient/orders/${updatedOrder._id}`,
    });

    if (shop && shop.user) {
        const shopUser = await User.findById(shop.user);
        if (shopUser && shopUser.phoneNumber) {
            const msg = `Hello ${shopUser.name}, order #${updatedOrder._id} status for ${patient.user.name} is now ${updatedOrder.status}.`;
            sendSms(shopUser.phoneNumber, msg);
        }
    }
    await Notification.create({
        recipient: shop._id,
        onModel: 'Shop',
        title: 'Order Status Update',
        message: `Order #${updatedOrder._id} for ${patient.user.name} is now ${updatedOrder.status}.`,
        category: 'Order',
        link: `/shop/orders/${updatedOrder._id}`,
    });

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Delete an order (Admin/Shop only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin or Shop
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Authorization: Only admin or the shop processing the order can delete
    let isAuthorized = req.user.role === 'Admin';
    if (!isAuthorized && req.user.role === 'Shop') {
        const shop = await Shop.findOne({ user: req.user._id });
        if (shop && order.shop.toString() === shop._id.toString()) isAuthorized = true;
    }

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to delete this order');
    }

    await order.deleteOne();
    // Restore quantities to shop inventory if order is deleted
    for (const item of order.orderItems) {
        await ShopInventory.findOneAndUpdate(
            { shop: order.shop, medicine: item.medicine },
            { $inc: { quantity: item.quantity } }
        );
    }

    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, getMyOrders };
