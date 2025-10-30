import asyncHandler from 'express-async-handler';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Medicine from '../models/Medicine.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendSms } from '../services/twilioService.js';
import Appointment from '../models/Appointment.js'; // Import Appointment model for patient filtering

// @desc    Get all prescriptions (Admin) or prescriptions issued by a specific doctor (Doctor)
// @route   GET /api/prescriptions
// @access  Private/Admin or Doctor
const getPrescriptionsForDoctor = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'Doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
          res.status(404);
          throw new Error('Doctor profile not found');
      }
      query = { doctor: doctor._id };
  }

  const prescriptions = await Prescription.find(query)
    .populate('patient', 'patientId user')
    .populate('doctor', 'specialty user')
    .populate('medicines.medicine', 'brandName genericName strength');

  res.json(prescriptions);
});

// @desc    Get patient specific prescriptions (Patient, Admin, Doctor)
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private/Patient, Admin or Doctor
const getPatientPrescriptions = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id });

    if (!patient) {
        res.status(404);
        throw new Error('Patient profile not found for this user');
    }

    const prescriptions = await Prescription.find({ patient: patient._id })
      .populate('patient', 'patientId user')
      .populate('doctor', 'specialty user')
      .populate({ 
            path: 'medicines.medicine',
            select: 'brandName genericName strength',
            strictPopulate: false
      });

    res.json(prescriptions);
});

// @desc    Get single prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private/Admin, Doctor or Patient
const getPrescriptionById = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patient', 'patientId user')
    .populate('doctor', 'specialty user')
    .populate('medicines.medicine', 'brandName genericName strength');

  if (prescription) {
    // Authorization: Only admin, the patient, or the prescribing doctor can view
    const isAuthorized = req.user.role === 'Admin' ||
                         (prescription.patient && prescription.patient.user && prescription.patient.user.toString() === req.user._id.toString()) ||
                         (prescription.doctor && prescription.doctor.user && prescription.doctor.user.toString() === req.user._id.toString());

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view this prescription');
    }

    res.json(prescription);
  } else {
    res.status(404);
    throw new Error('Prescription not found');
  }
});

// @desc    Create a prescription (Doctor only)
// @route   POST /api/prescriptions
// @access  Private/Doctor
const createPrescription = asyncHandler(async (req, res) => {
  const { patientId, doctorId, issueDate, expiryDate, medicines, notes, prescriptionImage } = req.body;

  console.log('Backend: createPrescription hit!');
  console.log('Received req.body:', req.body);

  const patient = await Patient.findById(patientId);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  const doctor = await Doctor.findOne({ medicalRegistrationNumber: doctorId });
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Ensure the logged-in user is the prescribing doctor or an admin
  if (req.user.role !== 'Admin' && doctor.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to create prescription for this doctor');
  }

  const prescription = new Prescription({
    patient: patient._id,
    doctor: doctor._id, // Use the MongoDB _id of the found doctor
    prescriptionId: `PRX-${Math.floor(100000 + Math.random() * 900000)}`,
    issueDate,
    expiryDate,
    medicines,
    notes,
    prescriptionImage,
  });

  const createdPrescription = await prescription.save();
  console.log('Prescription saved to DB:', createdPrescription);

  // Notify patient about new prescription
  if (patient.user) {
      const patientUser = await User.findById(patient.user);
      if (patientUser && patientUser.phoneNumber) {
          const msg = `Hello ${patientUser.name}, you have a new prescription from Dr. ${doctor.user.name}. View it in the HealthSphere app.`;
          sendSms(patientUser.phoneNumber, msg);
      }
  }

  await Notification.create({
      recipient: patient._id,
      onModel: 'Patient',
      title: 'New Prescription Issued',
      message: `Dr. ${doctor.user.name} has issued a new prescription for you.`, // Assuming doctor.user is populated
      category: 'Prescription',
      link: `/patient/prescriptions/${createdPrescription._id}`,
  });

  res.status(201).json(createdPrescription);
});

// @desc    Update a prescription (Admin/Doctor only)
// @route   PUT /api/prescriptions/:id
// @access  Private/Admin or Doctor
const updatePrescription = asyncHandler(async (req, res) => {
  const { issueDate, expiryDate, medicines, notes, prescriptionImage, status } = req.body;

  const prescription = await Prescription.findById(req.params.id);

  if (prescription) {
    // Authorization: Only admin or the prescribing doctor can update
    const doctor = await Doctor.findById(prescription.doctor);
    if (req.user.role !== 'Admin' && doctor.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this prescription');
    }

    prescription.issueDate = issueDate || prescription.issueDate;
    prescription.expiryDate = expiryDate || prescription.expiryDate;
    prescription.medicines = medicines || prescription.medicines;
    prescription.notes = notes || prescription.notes;
    prescription.prescriptionImage = prescriptionImage || prescription.prescriptionImage;
    prescription.status = status || prescription.status;

    const updatedPrescription = await prescription.save();

    // Notify patient about prescription update
    const patient = await Patient.findById(updatedPrescription.patient);
    const doctorUser = await User.findById(doctor.user);

    if (patient && patient.user) {
        const patientUser = await User.findById(patient.user);
        if (patientUser && patientUser.phoneNumber) {
            const msg = `Hello ${patientUser.name}, your prescription from Dr. ${doctorUser.name} has been updated.`;
            sendSms(patientUser.phoneNumber, msg);
        }
    }
    await Notification.create({
        recipient: patient._id,
        onModel: 'Patient',
        title: 'Prescription Updated',
        message: `Your prescription from Dr. ${doctorUser.name} has been updated.`, // Assuming doctor.user is populated
        category: 'Prescription',
        link: `/patient/prescriptions/${updatedPrescription._id}`,
    });


    res.json(updatedPrescription);
  } else {
    res.status(404);
    throw new Error('Prescription not found');
  }
});

// @desc    Delete a prescription (Admin/Doctor only)
// @route   DELETE /api/prescriptions/:id
// @access  Private/Admin or Doctor
const deletePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (prescription) {
    // Authorization: Only admin or the prescribing doctor can delete
    const doctor = await Doctor.findById(prescription.doctor);
    if (req.user.role !== 'Admin' && doctor.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this prescription');
    }

    await prescription.deleteOne();
    res.json({ message: 'Prescription removed' });
  } else {
    res.status(404);
    throw new Error('Prescription not found');
  }
});

export { getPrescriptionsForDoctor, getPrescriptionById, createPrescription, updatePrescription, deletePrescription, getPatientPrescriptions };
