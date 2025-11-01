import asyncHandler from 'express-async-handler';
import HealthRecord from '../models/HealthRecord.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Get all health records (Admin/Doctor only)
// @route   GET /api/healthrecords
// @access  Private/Admin or Doctor
const getHealthRecords = asyncHandler(async (req, res) => {
  const healthRecords = await HealthRecord.find({})
    .populate('patient', 'patientId user')
    .populate('associatedDoctor', 'specialty user');

  res.json(healthRecords);
});

// @desc    Get patient specific health records (Patient, Admin, Doctor)
// @route   GET /api/healthrecords/patient/:patientId
// @access  Private/Patient, Admin or Doctor
const getPatientHealthRecords = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.patientId);

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    // Authorization: Patient can only view their own records, Doctor can view their patients' records, Admin can view all.
    let isAuthorized = req.user.role === 'Admin' || (req.user.role === 'Doctor' && true); // Admins and Doctors are authorized

    if (req.user.role === 'Patient') {
        const primaryPatient = await Patient.findOne({ user: req.user._id });
        if (primaryPatient) {
            // Check if the requested patient is the primary patient itself
            if (patient._id.toString() === primaryPatient._id.toString()) {
                isAuthorized = true;
            } else {
                // Check if the requested patient is a family member of the primary patient
                const isFamilyMember = await Patient.exists({
                    _id: patient._id,
                    primaryPatient: primaryPatient._id,
                });
                if (isFamilyMember) {
                    isAuthorized = true;
                }
            }
        }
    }

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view these health records');
    }

    const healthRecords = await HealthRecord.find({ patient: req.params.patientId })
      .populate('patient', 'patientId user')
      .populate('associatedDoctor', 'specialty user');

    res.json(healthRecords);
});

// @desc    Get single health record by ID
// @route   GET /api/healthrecords/:id
// @access  Private/Admin, Doctor or Patient
const getHealthRecordById = asyncHandler(async (req, res) => {
  const healthRecord = await HealthRecord.findById(req.params.id)
    .populate('patient', 'patientId user')
    .populate('associatedDoctor', 'specialty user');

  if (healthRecord) {
    // Authorization: Only admin, the patient, or the associated doctor can view
    const isAuthorized = req.user.role === 'Admin' ||
                         (healthRecord.patient && healthRecord.patient.user && healthRecord.patient.user.toString() === req.user._id.toString()) ||
                         (healthRecord.associatedDoctor && healthRecord.associatedDoctor.user && healthRecord.associatedDoctor.user.toString() === req.user._id.toString());

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view this health record');
    }

    res.json(healthRecord);
  } else {
    res.status(404);
    throw new Error('Health record not found');
  }
});

// @desc    Create a health record (Doctor or Patient)
// @route   POST /api/healthrecords
// @access  Private/Doctor or Patient
const createHealthRecord = asyncHandler(async (req, res) => {
  const { patientId, recordType, date, title, details, associatedDoctor, fileUrl } = req.body;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  // If a doctor is creating it, ensure the logged in user is a doctor.
  if (associatedDoctor && req.user.role !== 'Doctor') {
      res.status(403);
      throw new Error('Only doctors can associate a health record with a doctor');
  }

  // If patient is creating it, ensure the logged in user is the patient.
  if (!associatedDoctor && req.user.role !== 'Admin' && patient.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to create health record for this patient');
  }

  const healthRecord = new HealthRecord({
    patient: patientId,
    recordType,
    date,
    title,
    details,
    associatedDoctor: associatedDoctor || null,
    fileUrl,
  });

  const createdHealthRecord = await healthRecord.save();

  // Notify patient about new health record
  if (patient.user) {
      const patientUser = await User.findById(patient.user);
      if (patientUser && patientUser.phoneNumber) {
          const msg = `Hello ${patientUser.name}, a new health record (${recordType}) has been added to your profile.`;
          // sendSms(patientUser.phoneNumber, msg);
      }
  }
  await Notification.create({
      recipient: patient._id,
      onModel: 'Patient',
      title: 'New Health Record',
      message: `A new ${recordType} health record has been added to your profile.`, 
      category: 'Report',
      link: `/patient/healthrecords/${createdHealthRecord._id}`,
  });

  res.status(201).json(createdHealthRecord);
});

// @desc    Update a health record (Admin, Doctor or Patient)
// @route   PUT /api/healthrecords/:id
// @access  Private/Admin, Doctor or Patient
const updateHealthRecord = asyncHandler(async (req, res) => {
  const { recordType, date, title, details, associatedDoctor, fileUrl } = req.body;

  const healthRecord = await HealthRecord.findById(req.params.id);

  if (healthRecord) {
    // Authorization: Only admin, the patient, or the associated doctor can update
    const isAuthorized = req.user.role === 'Admin' ||
                         (healthRecord.patient && healthRecord.patient.user && healthRecord.patient.user.toString() === req.user._id.toString()) ||
                         (healthRecord.associatedDoctor && healthRecord.associatedDoctor.user && healthRecord.associatedDoctor.user.toString() === req.user._id.toString());
    
    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to update this health record');
    }

    healthRecord.recordType = recordType || healthRecord.recordType;
    healthRecord.date = date || healthRecord.date;
    healthRecord.title = title || healthRecord.title;
    healthRecord.details = details || healthRecord.details;
    healthRecord.associatedDoctor = associatedDoctor || healthRecord.associatedDoctor;
    healthRecord.fileUrl = fileUrl || healthRecord.fileUrl;

    const updatedHealthRecord = await healthRecord.save();

    // Notify patient about health record update
    const patient = await Patient.findById(updatedHealthRecord.patient);
    if (patient && patient.user) {
        const patientUser = await User.findById(patient.user);
        if (patientUser && patientUser.phoneNumber) {
            const msg = `Hello ${patientUser.name}, your health record (${updatedHealthRecord.recordType}) has been updated.`;
            // sendSms(patientUser.phoneNumber, msg);
        }
    }
    await Notification.create({
        recipient: patient._id,
        onModel: 'Patient',
        title: 'Health Record Updated',
        message: `Your ${updatedHealthRecord.recordType} health record has been updated.`, 
        category: 'Report',
        link: `/patient/healthrecords/${updatedHealthRecord._id}`,
    });

    res.json(updatedHealthRecord);
  } else {
    res.status(404);
    throw new Error('Health record not found');
  }
});

// @desc    Delete a health record (Admin or Doctor)
// @route   DELETE /api/healthrecords/:id
// @access  Private/Admin or Doctor
const deleteHealthRecord = asyncHandler(async (req, res) => {
  const healthRecord = await HealthRecord.findById(req.params.id);

  if (healthRecord) {
    // Authorization: Only admin or the associated doctor can delete
    const isAuthorized = req.user.role === 'Admin' ||
                         (healthRecord.associatedDoctor && healthRecord.associatedDoctor.user && healthRecord.associatedDoctor.user.toString() === req.user._id.toString());

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to delete this health record');
    }

    await healthRecord.deleteOne();
    res.json({ message: 'Health record removed' });
  } else {
    res.status(404);
    throw new Error('Health record not found');
  }
});

export { getHealthRecords, getHealthRecordById, createHealthRecord, updateHealthRecord, deleteHealthRecord, getPatientHealthRecords };
