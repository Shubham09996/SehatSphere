import asyncHandler from 'express-async-handler';
import Billing from '../models/Billing.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Shop from '../models/Shop.js';
import Notification from '../models/Notification.js';

// @desc    Get all billings (Admin/Shop only)
// @route   GET /api/billings
// @access  Private/Admin or Shop
const getBillings = asyncHandler(async (req, res) => {
  const billings = await Billing.find({})
    .populate('billedTo', 'name email role')
    .populate('relatedEntity');

  res.json(billings);
});

// @desc    Get billings for the logged-in user (Patient, Doctor, Shop, Admin)
// @route   GET /api/billings/mybillings
// @access  Private
const getMyBillings = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) {
            res.status(404);
            throw new Error('Patient profile not found');
        }
        query = { billedTo: patient._id, onModel: 'Patient' };
    } else if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            res.status(404);
            throw new Error('Doctor profile not found');
        }
        query = { billedTo: doctor._id, onModel: 'Doctor' };
    } else if (req.user.role === 'Shop') {
        const shop = await Shop.findOne({ user: req.user._id });
        if (!shop) {
            res.status(404);
            throw new Error('Shop profile not found');
        }
        query = { billedTo: shop._id, onModel: 'Shop' };
    } else if (req.user.role === 'User') {
        query = { billedTo: req.user._id, onModel: 'User' };
    }
    // Admins can see all billings (no specific query needed for admin, already covered by getBillings if not filtered)

    const billings = await Billing.find(query)
      .populate('billedTo', 'name email role')
      .populate('relatedEntity');

    res.json(billings);
});

// @desc    Get single billing by ID
// @route   GET /api/billings/:id
// @access  Private/Admin, Doctor, Shop or Patient
const getBillingById = asyncHandler(async (req, res) => {
  const billing = await Billing.findById(req.params.id)
    .populate('billedTo', 'name email role')
    .populate('relatedEntity');

  if (billing) {
    // Authorization: Only admin, the billed party, or related doctor/shop can view
    let isAuthorized = req.user.role === 'Admin';

    if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ user: req.user._id });
        if (patient && billing.billedTo && billing.billedTo._id.toString() === patient._id.toString()) isAuthorized = true;
    } else if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (doctor && billing.billedTo && billing.billedTo._id.toString() === doctor._id.toString()) isAuthorized = true;
    } else if (req.user.role === 'Shop') {
        const shop = await Shop.findOne({ user: req.user._id });
        if (shop && billing.billedTo && billing.billedTo._id.toString() === shop._id.toString()) isAuthorized = true;
    }

    if (billing.relatedOnModel === 'Appointment') {
        // If billing is related to an appointment, check if the logged-in user is the patient or doctor for that appointment
        // (Requires populating the relatedEntity and its user fields, which might be complex here. Simplified for now)
    }
    
    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view this billing record');
    }

    res.json(billing);
  } else {
    res.status(404);
    throw new Error('Billing record not found');
  }
});

// @desc    Create a billing record (Admin, Doctor, Shop)
// @route   POST /api/billings
// @access  Private/Admin, Doctor or Shop
const createBilling = asyncHandler(async (req, res) => {
  const { billedToId, onModel, invoiceId, issueDate, dueDate, amount, status, items, paymentMethod, transactionId, relatedEntityId, relatedOnModel } = req.body;

  // Basic validation that billedToId exists for the given onModel
  let billedToEntity;
  if (onModel === 'User') billedToEntity = await User.findById(billedToId);
  else if (onModel === 'Patient') billedToEntity = await Patient.findById(billedToId);
  else if (onModel === 'Doctor') billedToEntity = await Doctor.findById(billedToId);
  else if (onModel === 'Shop') billedToEntity = await Shop.findById(billedToId);
  
  if (!billedToEntity) {
    res.status(400);
    throw new Error(`Billed entity of type ${onModel} not found`);
  }

  const billing = new Billing({
    billedTo: billedToId,
    onModel,
    invoiceId: invoiceId || `INV-${Math.floor(1000000 + Math.random() * 9000000)}`,
    issueDate,
    dueDate,
    amount,
    status: status || 'Pending',
    items,
    paymentMethod,
    transactionId,
    relatedEntity: relatedEntityId,
    relatedOnModel,
  });

  const createdBilling = await billing.save();

  // Notify billed party about new billing
  if (billedToEntity.user) {
      const billedToUser = await User.findById(billedToEntity.user);
      if (billedToUser && billedToUser.phoneNumber) {
          const msg = `Hello ${billedToUser.name}, a new bill (Invoice ID: ${createdBilling.invoiceId}) for ${createdBilling.amount} has been issued.`;
          // sendSms(billedToUser.phoneNumber, msg);
      }
  }
  await Notification.create({
      recipient: billedToId,
      onModel: onModel,
      title: 'New Bill Issued',
      message: `A new bill for ${createdBilling.amount} has been issued (Invoice ID: ${createdBilling.invoiceId}).`, 
      category: 'Billing',
      link: `/app/billings/${createdBilling._id}`,
  });

  res.status(201).json(createdBilling);
});

// @desc    Update a billing record (Admin/Shop only)
// @route   PUT /api/billings/:id
// @access  Private/Admin or Shop
const updateBilling = asyncHandler(async (req, res) => {
  const { issueDate, dueDate, amount, status, items, paymentMethod, transactionId } = req.body;

  const billing = await Billing.findById(req.params.id);

  if (billing) {
    // Authorization: Only admin or the shop that created it (if applicable) can update
    // Simplified for now: assume admin or creator shop
    let isAuthorized = req.user.role === 'Admin';
    if (!isAuthorized && req.user.role === 'Shop') {
        // Need to check if this billing record was created by this shop
        // This requires more complex logic to trace back the origin of the billing, or storing creator in billing model
        // For now, only admin can update statuses or details not related to payment processing by the billed party
    }

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to update this billing record');
    }

    billing.issueDate = issueDate || billing.issueDate;
    billing.dueDate = dueDate || billing.dueDate;
    billing.amount = amount || billing.amount;
    billing.status = status || billing.status;
    billing.items = items || billing.items;
    billing.paymentMethod = paymentMethod || billing.paymentMethod;
    billing.transactionId = transactionId || billing.transactionId;

    const updatedBilling = await billing.save();

    // Notify billed party about billing update
    let recipientUser = null;
    if (updatedBilling.onModel === 'Patient') {
        const patient = await Patient.findById(updatedBilling.billedTo);
        if (patient) recipientUser = await User.findById(patient.user);
    } else if (updatedBilling.onModel === 'Doctor') {
        const doctor = await Doctor.findById(updatedBilling.billedTo);
        if (doctor) recipientUser = await User.findById(doctor.user);
    } else if (updatedBilling.onModel === 'Shop') {
        const shop = await Shop.findById(updatedBilling.billedTo);
        if (shop) recipientUser = await User.findById(shop.user);
    } else if (updatedBilling.onModel === 'User') {
        recipientUser = await User.findById(updatedBilling.billedTo);
    }

    if (recipientUser && recipientUser.phoneNumber) {
        const msg = `Hello ${recipientUser.name}, your bill (Invoice ID: ${updatedBilling.invoiceId}) has been updated. Status: ${updatedBilling.status}.`;
        // sendSms(recipientUser.phoneNumber, msg);
    }
    await Notification.create({
        recipient: updatedBilling.billedTo,
        onModel: updatedBilling.onModel,
        title: 'Bill Updated',
        message: `Your bill (Invoice ID: ${updatedBilling.invoiceId}) has been updated. Status: ${updatedBilling.status}.`, 
        category: 'Billing',
        link: `/app/billings/${updatedBilling._id}`,
    });

    res.json(updatedBilling);
  } else {
    res.status(404);
    throw new Error('Billing record not found');
  }
});

// @desc    Delete a billing record (Admin/Shop only)
// @route   DELETE /api/billings/:id
// @access  Private/Admin or Shop
const deleteBilling = asyncHandler(async (req, res) => {
  const billing = await Billing.findById(req.params.id);

  if (billing) {
    // Authorization: Only admin or the shop that created it (if applicable) can delete
    let isAuthorized = req.user.role === 'Admin';
    if (!isAuthorized && req.user.role === 'Shop') {
        // Similar to update, more complex logic might be needed here to verify ownership/creation
    }

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to delete this billing record');
    }

    await billing.deleteOne();
    res.json({ message: 'Billing record removed' });
  } else {
    res.status(404);
    throw new Error('Billing record not found');
  }
});

export { getBillings, getBillingById, createBilling, updateBilling, deleteBilling, getMyBillings };
