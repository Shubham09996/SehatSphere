import asyncHandler from 'express-async-handler';
import Hospital from '../models/Hospital.js';

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
const getHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find({});
  res.json(hospitals);
});

// @desc    Get single hospital by ID
// @route   GET /api/hospitals/:id
// @access  Public
const getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (hospital) {
    res.json(hospital);
  } else {
    res.status(404);
    throw new Error('Hospital not found');
  }
});

// @desc    Create a hospital
// @route   POST /api/hospitals
// @access  Private/Admin
const createHospital = asyncHandler(async (req, res) => {
  const { name, location, address, image, contactEmail, contactPhone, departments } = req.body;

  const hospitalExists = await Hospital.findOne({ name });

  if (hospitalExists) {
    res.status(400);
    throw new Error('Hospital with this name already exists');
  }

  const hospital = new Hospital({
    name,
    location,
    address,
    image: image || '/uploads/default_hospital.jpg',
    contactEmail,
    contactPhone,
    departments,
  });

  const createdHospital = await hospital.save();
  res.status(201).json(createdHospital);
});

// @desc    Update a hospital
// @route   PUT /api/hospitals/:id
// @access  Private/Admin
const updateHospital = asyncHandler(async (req, res) => {
  const { name, location, address, image, contactEmail, contactPhone, departments, stats } = req.body;

  const hospital = await Hospital.findById(req.params.id);

  if (hospital) {
    hospital.name = name || hospital.name;
    hospital.location = location || hospital.location;
    hospital.address = address || hospital.address;
    hospital.image = image || hospital.image;
    hospital.contactEmail = contactEmail || hospital.contactEmail;
    hospital.contactPhone = contactPhone || hospital.contactPhone;
    hospital.departments = departments || hospital.departments;
    if (stats) {
      hospital.stats.totalDoctors = stats.totalDoctors || hospital.stats.totalDoctors;
      hospital.stats.patientsToday = stats.patientsToday || hospital.stats.patientsToday;
      hospital.stats.avgWaitTime = stats.avgWaitTime || hospital.stats.avgWaitTime;
      hospital.stats.rating = stats.rating || hospital.stats.rating;
    }

    const updatedHospital = await hospital.save();
    res.json(updatedHospital);
  } else {
    res.status(404);
    throw new Error('Hospital not found');
  }
});

// @desc    Delete a hospital
// @route   DELETE /api/hospitals/:id
// @access  Private/Admin
const deleteHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);

  if (hospital) {
    await hospital.deleteOne();
    res.json({ message: 'Hospital removed' });
  } else {
    res.status(404);
    throw new Error('Hospital not found');
  }
});

export { getHospitals, getHospitalById, createHospital, updateHospital, deleteHospital };
