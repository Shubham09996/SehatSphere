import asyncHandler from 'express-async-handler';
import Donation from '../models/Donation.js';
import Patient from '../models/Patient.js';
import DonationCenter from '../models/DonationCenter.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendSms } from '../services/twilioService.js';

// @desc    Get all donation requests (Admin only)
// @route   GET /api/donations
// @access  Private/Admin
const getDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({})
    .populate('patient', 'patientId bloodGroup user')
    .populate('donationCenter', 'name address');

  res.json(donations);
});

// @desc    Get donation requests for the logged-in patient
// @route   GET /api/donations/my-donations
// @access  Private/Patient or Admin
const getMyDonations = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) {
            res.status(404);
            throw new Error('Patient profile not found');
        }
        query = { patient: patient._id };
    }
    // Admins can view all donations, so no specific query for them here, covered by getDonations if unfiltered.

    const donations = await Donation.find(query)
      .populate('patient', 'patientId bloodGroup user')
      .populate('donationCenter', 'name address');

    res.json(donations);
});

// @desc    Get single donation request by ID
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id)
    .populate('patient', 'patientId bloodGroup user')
    .populate('donationCenter', 'name address');

  if (donation) {
    // Authorization: Only admin, or the patient who made the request can view
    const isAuthorized = req.user.role === 'Admin' || 
                         (donation.patient && donation.patient.user && donation.patient.user.toString() === req.user._id.toString());

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view this donation request');
    }

    res.json(donation);
  } else {
    res.status(404);
    throw new Error('Donation request not found');
  }
});

// @desc    Create a donation request (Patient only)
// @route   POST /api/donations
// @access  Private/Patient
const createDonation = asyncHandler(async (req, res) => {
  const { donationCenterId, scheduledDate, scheduledTime, notes } = req.body;

  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }

  const donationCenter = await DonationCenter.findById(donationCenterId);
  if (!donationCenter) {
    res.status(404);
    throw new Error('Donation center not found');
  }

  // Check if patient has a blood group in their profile
  if (!patient.bloodGroup) {
      res.status(400);
      throw new Error('Patient must have a blood group specified in their profile to schedule a donation.');
  }

  const donation = new Donation({
    patient: patient._id,
    donationCenter: donationCenterId,
    scheduledDate,
    scheduledTime,
    bloodGroup: patient.bloodGroup, // Use patient's blood group
    status: 'Pending',
    notes,
  });

  const createdDonation = await donation.save();

  // Notify patient about their scheduled donation
  if (patient.user && patient.user.phoneNumber) {
      const patientUser = await User.findById(patient.user);
      if (patientUser && patientUser.phoneNumber) {
          const msg = `Hello ${patientUser.name}, your blood donation at ${donationCenter.name} on ${new Date(scheduledDate).toDateString()} at ${scheduledTime} is pending confirmation.`;
          sendSms(patientUser.phoneNumber, msg);
      }
  }
  await Notification.create({
      recipient: patient._id,
      onModel: 'Patient',
      title: 'Donation Scheduled',
      message: `Your blood donation at ${donationCenter.name} on ${new Date(scheduledDate).toDateString()} at ${scheduledTime} is pending confirmation.`, 
      category: 'Alert',
      link: `/patient/donations/${createdDonation._id}`,
  });

  // Notify admin/donation center about new request
  // This would typically go to an admin user or a dedicated donation center user
  // For simplicity, we can create a generic admin notification
  await Notification.create({
      recipient: req.user._id, // Assuming current user is an admin for this notification or a generic admin ID
      onModel: 'User',
      title: 'New Donation Request',
      message: `New blood donation request from ${patient.user.name} (${patient.bloodGroup}) for ${donationCenter.name} on ${new Date(scheduledDate).toDateString()} at ${scheduledTime}.`,
      category: 'Alert',
      link: `/admin/donations/${createdDonation._id}`,
  });

  res.status(201).json(createdDonation);
});

// @desc    Update donation status (Admin/Donor role)
// @route   PUT /api/donations/:id
// @access  Private/Admin or Donor
const updateDonationStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const donation = await Donation.findById(req.params.id);

  if (donation) {
    // Authorization: Only admin or the donor can update status (e.g., mark as cancelled)
    // For 'Confirmed' or 'Completed', usually an Admin or Donation Center staff would do this.
    const isAuthorized = req.user.role === 'Admin' || 
                         (req.user.role === 'Donor' && donation.patient && donation.patient.user && donation.patient.user.toString() === req.user._id.toString());
    
    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to update this donation status');
    }

    donation.status = status || donation.status;
    donation.notes = notes || donation.notes;

    const updatedDonation = await donation.save();

    // Notify patient about status change
    const patient = await Patient.findById(updatedDonation.patient);
    if (patient && patient.user) {
        const patientUser = await User.findById(patient.user);
        if (patientUser && patientUser.phoneNumber) {
            const msg = `Hello ${patientUser.name}, your blood donation on ${new Date(updatedDonation.scheduledDate).toDateString()} at ${updatedDonation.scheduledTime} is now ${updatedDonation.status}.`;
            sendSms(patientUser.phoneNumber, msg);
        }
    }
    await Notification.create({
        recipient: patient._id,
        onModel: 'Patient',
        title: 'Donation Status Update',
        message: `Your blood donation on ${new Date(updatedDonation.scheduledDate).toDateString()} at ${updatedDonation.scheduledTime} is now ${updatedDonation.status}.`,
        category: 'Alert',
        link: `/patient/donations/${updatedDonation._id}`,
    });

    res.json(updatedDonation);
  } else {
    res.status(404);
    throw new Error('Donation request not found');
  }
});

// @desc    Delete a donation request (Admin only)
// @route   DELETE /api/donations/:id
// @access  Private/Admin
const deleteDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);

  if (donation) {
    // Authorization: Only admin can delete donation requests
    if (req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized to delete this donation request');
    }

    await donation.deleteOne();
    res.json({ message: 'Donation request removed' });
  } else {
    res.status(404);
    throw new Error('Donation request not found');
  }
});

export { getDonations, getDonationById, createDonation, updateDonationStatus, deleteDonation, getMyDonations };
