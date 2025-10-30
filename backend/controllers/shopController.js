import asyncHandler from 'express-async-handler';
import Shop from '../models/Shop.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import ShopInventory from '../models/ShopInventory.js';
import Review from '../models/Review.js';

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find({}).populate('user', 'name email profilePicture phoneNumber').populate('affiliatedHospital', 'name location');
  res.json(shops);
});

// @desc    Get single shop by ID
// @route   GET /api/shops/:id
// @access  Public
const getShopById = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id).populate('user', 'name email profilePicture phoneNumber role createdAt').populate('affiliatedHospital', 'name location');

  if (shop) {
    // Shop Owner Profile Data
    const shopOwnerPersonalInfo = {
        name: shop.user.name,
        pfp: shop.user.profilePicture,
        role: shop.user.role,
        memberSince: shop.user.createdAt,
    };

    // Dashboard Stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalSalesToday = await Order.aggregate([
        { $match: { shop: shop._id, createdAt: { $gte: today, $lt: tomorrow }, status: { $in: ['Delivered', 'Processing', 'Ready'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const revenueToday = totalSalesToday.length > 0 ? totalSalesToday[0].total : 0;

    const pendingOrdersCount = await Order.countDocuments({ shop: shop._id, status: 'New' });

    const lowStockItemsCount = await ShopInventory.countDocuments({ shop: shop._id, quantity: { $lt: 10 } }); // Assuming low stock is < 10

    // New Customers (for simplicity, counting new patients with orders today)
    const newCustomersToday = await Order.distinct('patient', { shop: shop._id, createdAt: { $gte: today, $lt: tomorrow } });

    const dashboardStats = {
        revenueToday: { value: revenueToday, change: '+5%' }, // Placeholder change
        pendingOrders: { value: pendingOrdersCount, change: '+2' }, // Placeholder change
        lowStockItems: { value: lowStockItemsCount, change: '-1' }, // Placeholder change
        newCustomers: { value: newCustomersToday.length, change: '+1' }, // Placeholder change
    };

    // New Orders for Verification
    const newOrders = await Order.find({ shop: shop._id, status: 'New' })
                               .populate('patient', 'user')
                               .select('orderItems patient totalPrice createdAt')
                               .limit(5); // Show top 5 new orders

    const formattedNewOrders = newOrders.map(order => ({
        id: order._id,
        patientName: order.patient.user.name,
        pfp: order.patient.user.profilePicture || '/uploads/default.jpg',
        items: order.orderItems.length,
        totalPrice: order.totalPrice,
    }));

    // Weekly Activity (Placeholder for now)
    const weeklyActivity = [
        { day: 'Mon', tasks: 12 }, { day: 'Tue', tasks: 19 }, { day: 'Wed', tasks: 3 },
        { day: 'Thu', tasks: 5 }, { day: 'Fri', tasks: 2 }, { day: 'Sat', tasks: 8 },
        { day: 'Sun', tasks: 10 },
    ];

    // Recent Activity Log (Orders and Inventory changes for now)
    const recentOrders = await Order.find({ shop: shop._id, status: { $ne: 'New' } }).sort({ createdAt: -1 }).limit(3).populate('patient', 'user');
    const recentInventoryUpdates = await ShopInventory.find({ shop: shop._id }).sort({ updatedAt: -1 }).limit(2).populate('medicine', 'brandName');

    const combinedRecentActivity = [
        ...recentOrders.map(order => ({
            id: order._id,
            icon: 'ShoppingCart',
            action: `Order #${order._id.toString().slice(-4)} processed for ${order.patient.user.name}`,
            timestamp: new Date(order.createdAt).toLocaleString(),
        })),
        ...recentInventoryUpdates.map(inv => ({
            id: inv._id,
            icon: 'Package',
            action: `Inventory updated for ${inv.medicine.brandName} (Qty: ${inv.quantity})`,
            timestamp: new Date(inv.updatedAt).toLocaleString(),
        })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

    // Performance Stats
    const totalRevenueManaged = await Order.aggregate([
        { $match: { shop: shop._id, status: { $in: ['Delivered', 'Processing', 'Ready'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const revenueManaged = totalRevenueManaged.length > 0 ? totalRevenueManaged[0].total : 0;

    const ordersProcessed = await Order.countDocuments({ shop: shop._id, status: { $in: ['Delivered', 'Processing', 'Ready'] } });

    const reviews = await Review.find({ reviewedEntity: shop._id, onModel: 'Shop' });
    const customerSatisfaction = reviews.length > 0 
        ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
        : 0;

    const performanceStats = {
        revenueManaged: `₹${revenueManaged.toLocaleString('en-IN')}`,
        ordersProcessed,
        customerSatisfaction,
    };

    res.json({
        shopInfo: {
            name: shop.name,
            logo: shop.logo,
            isPremium: shop.isPremium,
            phone: shop.phone,
            email: shop.email,
            address: shop.address,
            openingHours: shop.openingHours,
        },
        shopOwnerPersonalInfo,
        dashboardStats,
        newOrders: formattedNewOrders,
        weeklyActivity,
        recentActivity: combinedRecentActivity,
        performance: performanceStats,
    });
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
});

// @desc    Create a shop profile (Admin only, typically created during user registration)
// @route   POST /api/shops
// @access  Private/Admin
const createShopProfile = asyncHandler(async (req, res) => {
  const { userId, name, address, location, phone, email, logo, openingHours, affiliatedHospital, isPremium, subscription, staff } = req.body;

  const user = await User.findById(userId);
  if (!user || user.role !== 'Shop') {
    res.status(400);
    throw new Error('User not found or not a Shop role');
  }

  const shopExists = await Shop.findOne({ user: userId });
  if (shopExists) {
    res.status(400);
    throw new Error('Shop profile already exists for this user');
  }

  const shop = new Shop({
    user: userId,
    name,
    address,
    location,
    phone,
    email,
    logo: logo || '/uploads/default_shop.jpg',
    openingHours,
    affiliatedHospital,
    isPremium,
    subscription,
    staff,
  });

  const createdShop = await shop.save();
  res.status(201).json(createdShop);
});

// @desc    Update shop profile
// @route   PUT /api/shops/:id
// @access  Private/Shop or Admin
const updateShopProfile = asyncHandler(async (req, res) => {
  const { name, address, location, phone, email, logo, openingHours, affiliatedHospital, isPremium, subscription, staff, ownerName, ownerProfilePicture } = req.body;

  const shop = await Shop.findById(req.params.id).populate('user');

  if (shop) {
    // Ensure only the shop themselves or an admin can update
    if (req.user.role !== 'Admin' && shop.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this shop profile');
    }

    // Update User model fields (for shop owner)
    if (ownerName !== undefined) {
        shop.user.name = ownerName;
    }
    if (ownerProfilePicture !== undefined) {
        shop.user.profilePicture = ownerProfilePicture;
    }
    await shop.user.save();

    shop.name = name ?? shop.name;
    shop.address = address ?? shop.address;
    shop.location = location ?? shop.location;
    shop.phone = phone ?? shop.phone;
    shop.email = email ?? shop.email;
    shop.logo = logo ?? shop.logo;
    shop.openingHours = openingHours ?? shop.openingHours;
    shop.affiliatedHospital = affiliatedHospital ?? shop.affiliatedHospital;
    if (isPremium !== undefined) {
        shop.isPremium = isPremium;
    }
    shop.subscription = subscription ?? shop.subscription;
    shop.staff = staff ?? shop.staff;

    const updatedShop = await shop.save();
    res.json(updatedShop);
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
});

// @desc    Delete a shop profile
// @route   DELETE /api/shops/:id
// @access  Private/Admin
const deleteShopProfile = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (shop) {
    // Also delete the associated User account
    await User.deleteOne({ _id: shop.user });
    await shop.deleteOne();
    res.json({ message: 'Shop profile and associated user removed' });
  } else {
    res.status(404);
    throw new Error('Shop not found');
  }
});

// @desc    Get shop sales analytics data
// @route   GET /api/shops/:id/analytics/sales
// @access  Private/Shop or Admin
const getShopSalesAnalytics = asyncHandler(async (req, res) => {
    const shopId = req.params.id;

    const shop = await Shop.findById(shopId);
    if (!shop) {
        res.status(404);
        throw new Error('Shop not found');
    }

    // Authorization: Only the shop owner or an admin can view sales analytics
    if (req.user.role !== 'Admin' && shop.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this shop\'s sales analytics');
    }

    // Aggregate monthly sales data for the last 12 months
    const salesData = await Order.aggregate([
        { $match: { shop: shop._id, status: 'Delivered', createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) } } }, // Last 12 months delivered orders
        { $group: { 
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            totalSales: { $sum: "$totalPrice" }
        } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format data for chart (fill missing months with 0 sales)
    const formattedSalesData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
            month: date.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
            sales: 0,
        };
    }).reverse();

    salesData.forEach(data => {
        const monthName = new Date(data._id.year, data._id.month - 1).toLocaleString('en-US', { month: 'short', year: '2-digit' });
        const monthIndex = formattedSalesData.findIndex(item => item.month === monthName);
        if (monthIndex !== -1) {
            formattedSalesData[monthIndex].sales = data.totalSales;
        }
    });

    res.json(formattedSalesData);
});

// @desc    Update shop subscription details
// @route   PUT /api/shops/:id/subscription
// @access  Private/Admin or Shop
const updateShopSubscription = asyncHandler(async (req, res) => {
    const { plan, price, nextBillingDate } = req.body;

    const shop = await Shop.findById(req.params.id).populate('user');

    if (!shop) {
        res.status(404);
        throw new Error('Shop not found');
    }

    // Authorization: Only the shop owner or an admin can update subscription
    if (req.user.role !== 'Admin' && shop.user._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this shop\'s subscription');
    }

    shop.subscription = shop.subscription || {}; // Initialize if null/undefined
    shop.subscription.plan = plan ?? shop.subscription.plan;
    shop.subscription.price = price ?? shop.subscription.price;
    shop.subscription.nextBillingDate = nextBillingDate ? new Date(nextBillingDate) : shop.subscription.nextBillingDate;

    // Also update isPremium flag based on plan
    shop.isPremium = (shop.subscription.plan === 'Premium');

    const updatedShop = await shop.save();

    res.json({
        message: 'Shop subscription updated successfully',
        subscription: updatedShop.subscription,
        isPremium: updatedShop.isPremium,
    });
});

// @desc    Get all staff members for a specific shop
// @route   GET /api/shops/:id/staff
// @access  Private/Shop or Admin
const getShopStaff = asyncHandler(async (req, res) => {
    const shopId = req.params.id;

    const shop = await Shop.findById(shopId).populate({ path: 'staff.user', select: 'name email profilePicture role' });

    if (!shop) {
        res.status(404);
        throw new Error('Shop not found');
    }

    // Authorization: Only the shop owner or an admin can view staff
    if (req.user.role !== 'Admin' && shop.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this shop\'s staff');
    }

    res.json(shop.staff);
});

// @desc    Add a new staff member to a shop
// @route   POST /api/shops/:id/staff
// @access  Private/Shop or Admin
const addShopStaff = asyncHandler(async (req, res) => {
    const shopId = req.params.id;
    const { email, staffRole } = req.body; // staffRole could be Pharmacist, Cashier, Manager

    const shop = await Shop.findById(shopId);

    if (!shop) {
        res.status(404);
        throw new Error('Shop not found');
    }

    // Authorization: Only the shop owner or an admin can add staff
    if (req.user.role !== 'Admin' && shop.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to add staff to this shop');
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found with this email');
    }

    // Check if user is already a staff member of this shop
    const isAlreadyStaff = shop.staff.some(staffMember => staffMember.user.toString() === user._id.toString());
    if (isAlreadyStaff) {
        res.status(400);
        throw new Error('User is already a staff member of this shop');
    }

    // Add staff member to the shop's staff array
    shop.staff.push({ user: user._id, role: staffRole });
    await shop.save();

    // Optionally, update the user's role if they are not already a 'Shop' role
    if (user.role !== 'Shop' && user.role !== 'Admin') { // Admin can be staff without changing role
        user.role = 'Shop'; // This implies staff members are also considered 'Shop' role in the User model
        await user.save();
    }

    res.status(201).json({ message: 'Staff member added successfully', staff: shop.staff });
});

// @desc    Update a staff member's role in a shop
// @route   PUT /api/shops/:shopId/staff/:userId
// @access  Private/Shop or Admin
const updateShopStaffRole = asyncHandler(async (req, res) => {
    const { shopId, userId } = req.params;
    const { staffRole } = req.body;

    const shop = await Shop.findById(shopId);

    if (!shop) {
        res.status(404);
        throw new Error('Shop not found');
    }

    // Authorization: Only the shop owner or an admin can update staff roles
    if (req.user.role !== 'Admin' && shop.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update staff role in this shop');
    }

    const staffMemberIndex = shop.staff.findIndex(staff => staff.user.toString() === userId);

    if (staffMemberIndex === -1) {
        res.status(404);
        throw new Error('Staff member not found in this shop');
    }

    shop.staff[staffMemberIndex].role = staffRole;
    await shop.save();

    res.json({ message: 'Staff member role updated successfully', staff: shop.staff });
});

// @desc    Remove a staff member from a shop
// @route   DELETE /api/shops/:shopId/staff/:userId
// @access  Private/Shop or Admin
const removeShopStaff = asyncHandler(async (req, res) => {
    const { shopId, userId } = req.params;

    const shop = await Shop.findById(shopId);

    if (!shop) {
        res.status(404);
        throw new Error('Shop not found');
    }

    // Authorization: Only the shop owner or an admin can remove staff
    if (req.user.role !== 'Admin' && shop.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to remove staff from this shop');
    }

    const initialStaffCount = shop.staff.length;
    shop.staff = shop.staff.filter(staffMember => staffMember.user.toString() !== userId);

    if (shop.staff.length === initialStaffCount) {
        res.status(404);
        throw new Error('Staff member not found in this shop');
    }

    await shop.save();

    res.json({ message: 'Staff member removed successfully', staff: shop.staff });
});

// @desc    Update shop integrations
// @route   PUT /api/shops/:id/integrations
// @access  Private/Shop or Admin
const updateShopIntegrations = asyncHandler(async (req, res) => {
    const shopId = req.params.id;
    const { integrationName, settings } = req.body; // settings will be an object like { apiKey: '...', enabled: true }

    const shop = await Shop.findById(shopId).populate('user');

    if (!shop) {
        res.status(404);
        throw new Error('Shop not found');
    }

    // Authorization: Only the shop owner or an admin can update integrations
    if (req.user.role !== 'Admin' && shop.user._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update integrations for this shop');
    }

    // Ensure integrations map exists
    if (!shop.integrations) {
        shop.integrations = new Map();
    }

    // Update specific integration settings
    let currentIntegrationSettings = shop.integrations.get(integrationName) || {};

    shop.integrations.set(integrationName, { ...currentIntegrationSettings, ...settings });

    const updatedShop = await shop.save();

    res.json({
        message: `${integrationName} integration updated successfully`,
        integrations: updatedShop.integrations.get(integrationName),
    });
});

export { getShops, getShopById, createShopProfile, updateShopProfile, deleteShopProfile, getShopSalesAnalytics, updateShopSubscription, getShopStaff, addShopStaff, updateShopStaffRole, removeShopStaff, updateShopIntegrations };
