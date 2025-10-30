import asyncHandler from 'express-async-handler';
import DonationCenter from '../models/DonationCenter.js';

// @desc    Get all donation centers
// @route   GET /api/donationcenters
// @access  Public
const getDonationCenters = asyncHandler(async (req, res) => {
  const donationCenters = await DonationCenter.find({});
  res.json(donationCenters);
});

// @desc    Get single donation center by ID
// @route   GET /api/donationcenters/:id
// @access  Public
const getDonationCenterById = asyncHandler(async (req, res) => {
  const donationCenter = await DonationCenter.findById(req.params.id);

  if (donationCenter) {
    res.json(donationCenter);
  } else {
    res.status(404);
    throw new Error('Donation center not found');
  }
});

// @desc    Create a donation center
// @route   POST /api/donationcenters
// @access  Private/Admin
const createDonationCenter = asyncHandler(async (req, res) => {
  const { name, address, location, contactPhone, contactEmail, operatingHours, image } = req.body;

  const donationCenterExists = await DonationCenter.findOne({ name });

  if (donationCenterExists) {
    res.status(400);
    throw new Error('Donation center with this name already exists');
  }

  const donationCenter = new DonationCenter({
    name,
    address,
    location,
    contactPhone,
    contactEmail,
    operatingHours,
    image: image || '/uploads/default_donation_center.jpg',
  });

  const createdDonationCenter = await donationCenter.save();
  res.status(201).json(createdDonationCenter);
});

// @desc    Update a donation center
// @route   PUT /api/donationcenters/:id
// @access  Private/Admin
const updateDonationCenter = asyncHandler(async (req, res) => {
  const { name, address, location, contactPhone, contactEmail, operatingHours, image } = req.body;

  const donationCenter = await DonationCenter.findById(req.params.id);

  if (donationCenter) {
    donationCenter.name = name || donationCenter.name;
    donationCenter.address = address || donationCenter.address;
    donationCenter.location = location || donationCenter.location;
    donationCenter.contactPhone = contactPhone || donationCenter.contactPhone;
    donationCenter.contactEmail = contactEmail || donationCenter.contactEmail;
    donationCenter.operatingHours = operatingHours || donationCenter.operatingHours;
    donationCenter.image = image || donationCenter.image;

    const updatedDonationCenter = await donationCenter.save();
    res.json(updatedDonationCenter);
  } else {
    res.status(404);
    throw new Error('Donation center not found');
  }
});

// @desc    Delete a donation center
// @route   DELETE /api/donationcenters/:id
// @access  Private/Admin
const deleteDonationCenter = asyncHandler(async (req, res) => {
  const donationCenter = await DonationCenter.findById(req.params.id);

  if (donationCenter) {
    await donationCenter.deleteOne();
    res.json({ message: 'Donation center removed' });
  } else {
    res.status(404);
    throw new Error('Donation center not found');
  }
});

export { getDonationCenters, getDonationCenterById, createDonationCenter, updateDonationCenter, deleteDonationCenter };
