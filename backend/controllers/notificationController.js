import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Shop from '../models/Shop.js';

// @desc    Get all notifications (Admin only)
// @route   GET /api/notifications
// @access  Private/Admin
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({})
    .populate('recipient', 'name email role');

  res.json(notifications);
});

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications/mynotifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
    let recipientId = null;
    let onModel = req.user.role; // Default to user's role

    if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ user: req.user._id });
        if (patient) recipientId = patient._id;
    } else if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (doctor) recipientId = doctor._id;
    } else if (req.user.role === 'Shop') {
        const shop = await Shop.findOne({ user: req.user._id });
        if (shop) recipientId = shop._id;
    } else if (req.user.role === 'Admin') {
        // Admins can see notifications addressed to their User ID or specific Admin profile ID if exists
        recipientId = req.user._id; // Assuming admin notifications are tied to the User model directly
        onModel = 'User'; // Admins are users first
    }

    if (!recipientId) {
        res.status(404);
        throw new Error('Recipient profile not found');
    }

    const notifications = await Notification.find({ recipient: recipientId, onModel })
        .sort({ createdAt: -1 })
        .populate('recipient', 'name email role');

    res.json(notifications);
});

// @desc    Get single notification by ID
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id)
    .populate('recipient', 'name email role');

  if (notification) {
    // Authorization: Only admin or the recipient can view
    let isAuthorized = req.user.role === 'Admin';
    if (!isAuthorized) {
        let recipientId = null;
        if (req.user.role === 'Patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient) recipientId = patient._id;
        } else if (req.user.role === 'Doctor') {
            const doctor = await Doctor.findOne({ user: req.user._id });
            if (doctor) recipientId = doctor._id;
        } else if (req.user.role === 'Shop') {
            const shop = await Shop.findOne({ user: req.user._id });
            if (shop) recipientId = shop._id;
        } else if (req.user.role === 'User') {
            recipientId = req.user._id;
        }
        if (recipientId && notification.recipient.toString() === recipientId.toString()) isAuthorized = true;
    }

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view this notification');
    }

    res.json(notification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    // Authorization: Only admin or the recipient can mark as read
    let isAuthorized = req.user.role === 'Admin';
    if (!isAuthorized) {
        let recipientId = null;
        if (req.user.role === 'Patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient) recipientId = patient._id;
        } else if (req.user.role === 'Doctor') {
            const doctor = await Doctor.findOne({ user: req.user._id });
            if (doctor) recipientId = doctor._id;
        } else if (req.user.role === 'Shop') {
            const shop = await Shop.findOne({ user: req.user._id });
            if (shop) recipientId = shop._id;
        } else if (req.user.role === 'User') {
            recipientId = req.user._id;
        }
        if (recipientId && notification.recipient.toString() === recipientId.toString()) isAuthorized = true;
    }

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to update this notification');
    }

    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    // Authorization: Only admin or the recipient can delete
    let isAuthorized = req.user.role === 'Admin';
    if (!isAuthorized) {
        let recipientId = null;
        if (req.user.role === 'Patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient) recipientId = patient._id;
        } else if (req.user.role === 'Doctor') {
            const doctor = await Doctor.findOne({ user: req.user._id });
            if (doctor) recipientId = doctor._id;
        } else if (req.user.role === 'Shop') {
            const shop = await Shop.findOne({ user: req.user._id });
            if (shop) recipientId = shop._id;
        } else if (req.user.role === 'User') {
            recipientId = req.user._id;
        }
        if (recipientId && notification.recipient.toString() === recipientId.toString()) isAuthorized = true;
    }

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to delete this notification');
    }

    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

export { getNotifications, getNotificationById, markNotificationAsRead, deleteNotification, getMyNotifications };
