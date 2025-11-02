import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import HealthRecord from '../models/HealthRecord.js';
import Doctor from '../models/Doctor.js'; // Import Doctor model
import LabTestOrder from '../models/LabTestOrder.js'; // Import LabTestOrder model

// @desc    Get all patients (Admin) or patients of a specific doctor (Doctor)
// @route   GET /api/patients
// @access  Private/Admin or Doctor
const getPatients = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'Doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
          res.status(404);
          throw new Error('Doctor profile not found');
      }
      // Find all patients who have appointments with this doctor
      const patientAppointments = await Appointment.find({ doctor: doctor._id }).select('patient');
      const patientIds = [...new Set(patientAppointments.map(app => app.patient))];
      query = { _id: { $in: patientIds } };
  }

  const patients = await Patient.find(query)
    .populate('user', 'name email profilePicture phoneNumber')
    .select('patientId name profilePicture dob gender bloodGroup emergencyContact allergies chronicConditions recentVitals recentActivity'); // Select additional fields, including name and profilePicture
  res.json(patients);
});

// @desc    Get patient by ID (for doctors to prescribe or view)
// @route   GET /api/patients/:id
// @access  Private/Doctor or Admin
const getPatientById = asyncHandler(async (req, res) => {
  let patient;
  const patientIdFromFrontend = req.params.id;

  // Prioritize finding by MongoDB _id, as patient.id from frontend is usually the _id
  // Check if it's a valid MongoDB ObjectId format
  if (patientIdFromFrontend && patientIdFromFrontend.match(/^[0-9a-fA-F]{24}$/)) {
    patient = await Patient.findById(patientIdFromFrontend)
      .populate('user', 'name email profilePicture phoneNumber isVerified') // Ensure name and profilePicture are populated
      .select('patientId name profilePicture dob gender bloodGroup emergencyContact allergies chronicConditions recentVitals recentActivity');
  }

  // If not found by _id, then try by patientId field (e.g., PID-XXXXX)
  if (!patient) {
    patient = await Patient.findOne({ patientId: patientIdFromFrontend })
      .populate('user', 'name email profilePicture phoneNumber isVerified') // Ensure name and profilePicture are populated
      .select('patientId name profilePicture dob gender bloodGroup emergencyContact allergies chronicConditions recentVitals recentActivity');
  }

  if (patient) {
    res.json(patient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc    Get patient profile (for patient to view their own, or admin to view any)
// @route   GET /api/patients/profile/:id
// @access  Private/Patient or Admin
const getPatientProfile = asyncHandler(async (req, res) => {
  let patient;
  const idOrPatientId = req.params.idOrPatientId; // Corrected to req.params.idOrPatientId

  console.log(`Attempting to fetch patient profile for ID: ${idOrPatientId}`); // Debug log

  if (idOrPatientId && idOrPatientId.startsWith('PID-')) {
    patient = await Patient.findOne({ patientId: idOrPatientId }).populate('user', 'name email profilePicture phoneNumber isVerified');
    console.log(`Patient found by patientId: ${patient ? patient._id : 'Not Found'}`); // Debug log
  } else if (idOrPatientId && idOrPatientId.match(/^[0-9a-fA-F]{24}$/)) {
    // If it's a valid MongoDB ObjectId, try to find by user ID first, then by patient _id
    patient = await Patient.findOne({ user: idOrPatientId }).populate('user', 'name email profilePicture phoneNumber isVerified');
    console.log(`Patient found by user ID (first attempt): ${patient ? patient.user._id : 'Not Found'}`); // Debug log

    if (!patient) {
      // If not found by user ID, try to find by Patient _id
      patient = await Patient.findById(idOrPatientId).populate('user', 'name email profilePicture phoneNumber isVerified');
      console.log(`Patient found by _id (second attempt): ${patient ? patient._id : 'Not Found'}`); // Debug log
    }
  } else {
    patient = await Patient.findOne({ user: req.user._id }).populate('user', 'name email profilePicture phoneNumber isVerified');
    console.log(`Patient found by logged-in user ID: ${patient ? patient.user._id : 'Not Found'}`); // Debug log
  }

  if (patient) {
    if (
      req.user.role !== 'Admin' &&
      req.user.role !== 'Doctor' &&
      patient.user._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to view this patient profile');
    }

    const dob = new Date(patient.dob);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    const healthRecords = await HealthRecord.find({ patient: patient._id }).sort({ date: -1 });

    const latestVitals = healthRecords.filter(record => record.recordType === 'Vital');

    const bloodPressure = latestVitals.find(v => v.title === 'Blood Pressure') || { details: { value: '120/80', status: 'Normal' } };
    const bloodSugar = latestVitals.find(v => v.title === 'Blood Sugar') || { details: { value: '90 mg/dL', status: 'Normal' } };
    const bmi = latestVitals.find(v => v.title === 'BMI') || { details: { value: '22.5', status: 'Healthy' } };
    const lastCheckedVitals = latestVitals.length > 0 ? latestVitals[0].date : new Date();

    const recentAppointments = await Appointment.find({ patient: patient._id }).sort({ date: -1 }).limit(3).populate('doctor', 'user').select('date status reason doctor');
    const recentPrescriptions = await Prescription.find({ patient: patient._id }).sort({ issueDate: -1 }).limit(3).populate('doctor', 'user').select('issueDate medicines doctor');
    const recentHealthRecords = await HealthRecord.find({ patient: patient._id }).sort({ date: -1 }).limit(3).select('date recordType title');

    const combinedRecentActivity = [
        ...recentAppointments.map(app => ({
            id: app._id,
            type: 'Consultation',
            title: `Consultation with Dr. ${app.doctor.user.name}`,
            date: app.date,
        })),
        ...recentPrescriptions.map(pres => ({
            id: pres._id,
            type: 'Prescription',
            title: `Prescription from Dr. ${pres.doctor.user.name}`,
            date: pres.issueDate,
        })),
        ...recentHealthRecords.map(rec => ({
            id: rec._id,
            type: rec.recordType === 'Lab Report' ? 'LabReport' : (rec.recordType === 'Allergy' ? 'Allergy' : 'Other'),
            title: rec.title,
            date: rec.date,
        }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    const upcomingAppointmentsCount = await Appointment.countDocuments({
        patient: patient._id,
        date: { $gte: new Date() },
        status: { $in: ['Pending', 'Confirmed', 'Now Serving', 'Up Next', 'Waiting'] }
    });
    const activePrescriptionsCount = await Prescription.countDocuments({
        patient: patient._id,
        status: 'Active',
        expiryDate: { $gte: new Date() }
    });
    const recordsCount = await HealthRecord.countDocuments({ patient: patient._id });

    console.log('Patient object before response:', patient); // Re-add this for detailed debugging

    // Fetch all prescriptions for the patient
    const allPrescriptions = await Prescription.find({ patient: patient._id })
        .populate({
            path: 'doctor',
            select: 'user',
            populate: { path: 'user', select: 'name' }
        })
        .select('issueDate medicines doctor notes prescriptionImage status');

    // Fetch all lab test orders for the patient
    const allLabTestOrders = await LabTestOrder.find({ patient: patient._id })
        .populate({
            path: 'lab',
            select: 'name',
        })
        .select('testName testType status result orderDate completionDate price');

    res.json({
      personalInfo: {
          name: patient.user.name,
          pfp: patient.user.profilePicture,
          patientId: patient.patientId,
          age,
          bloodGroup: patient.bloodGroup,
          emergencyContact: patient.emergencyContact,
          isVerified: patient.user.isVerified,
          email: patient.user.email,
          phoneNumber: patient.user.phoneNumber,
      },
      quickStats: {
          upcomingAppointments: upcomingAppointmentsCount,
          activePrescriptions: activePrescriptionsCount,
          recordsCount,
      },
      recentActivity: combinedRecentActivity,
      vitals: {
          lastChecked: lastCheckedVitals,
          bloodPressure: { value: bloodPressure.details.value, status: bloodPressure.details.status },
          bloodSugar: { value: bloodSugar.details.value, status: bloodSugar.details.status },
          bmi: { value: bmi.details.value, status: bmi.details.status },
      },
      criticalInfo: {
          allergies: patient.allergies,
          chronicConditions: patient.chronicConditions,
      },
      gender: patient.gender,
      isPremium: patient.isPremium,
      prescriptions: allPrescriptions.map(p => ({
          _id: p._id,
          issueDate: p.issueDate,
          expiryDate: p.expiryDate,
          doctorName: p.doctor.user.name,
          medicines: p.medicines,
          notes: p.notes,
          prescriptionImage: p.prescriptionImage,
          status: p.status,
      })),
      labTestOrders: allLabTestOrders.map(lto => ({
          _id: lto._id,
          testName: lto.testName,
          testType: lto.testType,
          status: lto.status,
          result: lto.result,
          orderDate: lto.orderDate,
          completionDate: lto.completionDate,
          price: lto.price,
          labName: lto.lab.name,
      })),
    });
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc    Create a patient profile (Admin only, typically created during user registration)
// @route   POST /api/patients
// @access  Private/Admin
const createPatientProfile = asyncHandler(async (req, res) => {
    const { userId, dob, gender, bloodGroup, emergencyContact = {}, allergies, chronicConditions, recentVitals, isPremium } = req.body; // Default emergencyContact to empty object

    const user = await User.findById(userId);
    if (!user || user.role !== 'Patient') {
      res.status(400);
      throw new Error('User not found or not a Patient role');
    }

    const patientExists = await Patient.findOne({ user: userId });
    if (patientExists) {
      res.status(400);
      throw new Error('Patient profile already exists for this user');
    }

    const patient = new Patient({
      user: userId,
      patientId: `PID-${Math.floor(100000 + Math.random() * 900000)}`,
      dob,
      gender,
      bloodGroup,
      emergencyContact,
      allergies,
      chronicConditions,
      recentVitals,
      isPremium,
    });

    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
});

// @desc    Update patient profile
// @route   PUT /api/patients/profile/:id
// @access  Private/Patient or Admin
const updatePatientProfile = asyncHandler(async (req, res) => {
  const { dob, gender, bloodGroup, emergencyContact, allergies, chronicConditions, recentVitals, isPremium, name, profilePicture } = req.body;

  const idOrPatientId = req.params.idOrPatientId;
  let patient;

  if (idOrPatientId && idOrPatientId.startsWith('PID-')) {
      patient = await Patient.findOne({ patientId: idOrPatientId }).populate('user');
  } else if (idOrPatientId) {
      patient = await Patient.findById(idOrPatientId).populate('user');
  } else {
      res.status(400);
      throw new Error('Patient ID not provided');
  }

  if (patient) {
    // Ensure only the patient themselves or an admin can update
    if (req.user.role !== 'Admin' && patient.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this patient profile');
    }

    // Update User model fields
    if (name !== undefined) {
        patient.user.name = name;
    }
    if (profilePicture !== undefined) {
        patient.user.profilePicture = profilePicture;
    }
    await patient.user.save();

    patient.dob = dob ?? patient.dob;
    patient.gender = gender ?? patient.gender;
    patient.bloodGroup = bloodGroup ?? patient.bloodGroup;
    // Ensure emergencyContact is an object before assigning properties
    patient.emergencyContact = {
        name: emergencyContact.name ?? patient.emergencyContact?.name,
        relation: emergencyContact.relation ?? patient.emergencyContact?.relation,
        phone: emergencyContact.phone ?? patient.emergencyContact?.phone,
    };
    patient.allergies = allergies ?? patient.allergies;
    patient.chronicConditions = chronicConditions ?? patient.chronicConditions;
    patient.recentVitals = recentVitals ?? patient.recentVitals;
    if (isPremium !== undefined) {
        patient.isPremium = isPremium;
    }

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc    Delete a patient profile
// @route   DELETE /api/patients/profile/:id
// @access  Private/Admin
const deletePatientProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (patient) {
    // Also delete the associated User account
    await User.deleteOne({ _id: patient.user });
    await patient.deleteOne();
    res.json({ message: 'Patient profile and associated user removed' });
  } else {
    res.status(404);
    throw new Error('Patient not found');
  }
});

// @desc    Get patient dashboard statistics
// @route   GET /api/patients/dashboard-stats
// @access  Private/Patient
const getPatientDashboardStats = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient profile not found');
    }

    const nowLocal = new Date();
    const today = new Date(Date.UTC(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate()));

    const currentHour = nowLocal.getHours();
    const currentMinute = nowLocal.getMinutes();
    const currentTimeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    const upcomingAppointmentsQuery = {
        patient: patient._id,
        $or: [
            { date: { $gt: today } }, // Appointments on future dates
            {
                date: today, // Appointments on today's date
                time: { $gte: currentTimeString } // And time is current or future
            }
        ],
        status: { $in: ['Pending', 'Confirmed', 'Now Serving', 'Up Next', 'Waiting'] }
    };

    const upcomingAppointmentsCount = await Appointment.countDocuments(upcomingAppointmentsQuery);

    // Calculate total unique patients for this doctor
    const doctor = await Doctor.findOne({ user: req.user._id });
    let totalPatientsCount = 0;
    if (doctor) {
        const patientAppointments = await Appointment.find({ doctor: doctor._id }).select('patient');
        const uniquePatientIds = [...new Set(patientAppointments.map(app => app.patient.toString()))];
        totalPatientsCount = uniquePatientIds.length;
    }

    const nextAppointment = await Appointment.findOne(upcomingAppointmentsQuery)
    .sort('date time').populate('doctor', 'user specialty').populate('hospital', 'name').select('date time tokenNumber doctor hospital');

    let nextAppointmentDetails = null;
    if (nextAppointment) {
        const appointmentDateTime = new Date(`${nextAppointment.date.toISOString().split('T')[0]}T${nextAppointment.time}:00`);
        const now = new Date();
        const timeDiffMinutes = Math.round((appointmentDateTime.getTime() - now.getTime()) / (1000 * 60));

        nextAppointmentDetails = {
            date: nextAppointment.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            time: nextAppointment.time,
            doctorName: nextAppointment.doctor.user.name,
            doctorSpecialty: nextAppointment.doctor.specialty, // Added doctor specialty
            hospitalName: nextAppointment.hospital.name, // Added hospital name
            tokenNumber: nextAppointment.tokenNumber,
            timeUntil: timeDiffMinutes > 0 ? `+${timeDiffMinutes} min` : '-', // Simplified for display
        };
    }

    const activePrescriptions = await Prescription.countDocuments({
        patient: patient._id,
        status: 'Active',
        expiryDate: { $gte: new Date() } // Ensure prescription is not expired
    });

    const recordsCount = await HealthRecord.countDocuments({
        patient: patient._id,
    });

    const rewardPoints = req.user.rewardPoints; // Fetch from updated User model

    res.json({
        patientName: req.user.name,
        dashboardStats: {
            currentToken: nextAppointmentDetails ? `Next: ${nextAppointmentDetails.date}, ${nextAppointmentDetails.time}` : 'No Upcoming',
            currentTokenDetail: nextAppointmentDetails ? nextAppointmentDetails.timeUntil : '',
            currentTokenProgress: nextAppointmentDetails ? 40 : 0, // Placeholder for actual progress logic
            appointmentsCount: upcomingAppointmentsCount,
            prescriptionsCount: activePrescriptions,
            rewardPoints,
            totalPatients: { value: totalPatientsCount, change: '' }, // Add dynamic totalPatients count
        },
        // Kept for backward compatibility or if needed separately
        upcomingAppointmentsCount,
        activePrescriptions,
        recordsCount,
        nextAppointmentDetails,
    });
});

// @desc    Update patient reward points
// @route   PUT /api/patients/:id/reward-points
// @access  Private/Admin or Doctor
const updateRewardPoints = asyncHandler(async (req, res) => {
    const { points } = req.body; // points could be positive or negative

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    // Authorization: Only Admin or Doctor can update reward points
    if (req.user.role !== 'Admin' && req.user.role !== 'Doctor') {
        res.status(403);
        throw new Error('Not authorized to update reward points');
    }

    const user = await User.findById(patient.user);

    if (user) {
        user.rewardPoints = (user.rewardPoints || 0) + points;
        if (user.rewardPoints < 0) {
            user.rewardPoints = 0; // Ensure reward points don't go below zero
        }
        await user.save();
        res.json({
            message: 'Reward points updated successfully',
            rewardPoints: user.rewardPoints
        });
    } else {
        res.status(404);
        throw new Error('Associated user not found');
    }
});

const getUpcomingAppointments = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
        res.status(404);
        throw new Error('Patient profile not found');
    }

    const nowLocal = new Date();
    const today = new Date(Date.UTC(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate()));

    const currentHour = nowLocal.getHours();
    const currentMinute = nowLocal.getMinutes();
    const currentTimeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    const upcomingAppointmentsQuery = {
        patient: patient._id,
        $or: [
            { date: { $gt: today } }, // Appointments on future dates
            {
                date: today, // Appointments on today's date
                time: { $gte: currentTimeString } // And time is current or future
            }
        ],
        status: { $in: ['Pending', 'Confirmed', 'Now Serving', 'Up Next', 'Waiting'] },
    };

    const upcomingAppointments = await Appointment.find(upcomingAppointmentsQuery).sort('date time')
    .populate({
        path: 'doctor',
        select: 'user specialty',
        populate: {
          path: 'user',
          select: 'name profilePicture'
        }
      })
    .populate('hospital', 'name').select('date time tokenNumber doctor hospital');

    res.json({ upcomingAppointments: upcomingAppointments.map(app => ({
        _id: app._id,
        date: app.date,
        time: app.time,
        token: app.tokenNumber, // Change tokenNumber to token
        status: app.status,
        doctorName: app.doctor.user.name,
        doctorSpecialty: app.doctor.specialty,
        hospitalName: app.hospital.name,
    })) });
});

const getPatientHistory = asyncHandler(async (req, res) => {
    const { patientId } = req.params; // Get patientId from URL parameters

    // Find the patient by patientId to get their MongoDB _id
    const patient = await Patient.findOne({ patientId: patientId });

    if (!patient) {
        res.status(404);
        throw new Error('Patient not found');
    }

    // Authorization: Only admin, the patient, or a doctor who has an appointment with the patient can view history
    let isAuthorized = false;
    if (req.user.role === 'Admin' || (req.user.role === 'Patient' && patient.user.toString() === req.user._id.toString())) {
        isAuthorized = true;
    } else if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (doctor) {
            const hasAppointment = await Appointment.exists({ doctor: doctor._id, patient: patient._id });
            if (hasAppointment) {
                isAuthorized = true;
            }
        }
    }

    if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to view this patient\'s history');
    }

    const prescriptions = await Prescription.find({ patient: patient._id })
        .populate({
            path: 'doctor',
            populate: {
                path: 'user',
                select: 'name'
            },
            select: 'user'
        })
        .populate({
            path: 'medicines.medicine',
            select: 'brandName genericName strength'
        })
        .select('issueDate notes doctor medicines');

    const appointments = await Appointment.find({ patient: patient._id })
        .populate({
            path: 'doctor',
            populate: {
                path: 'user',
                select: 'name'
            },
            select: 'user'
        })
        .select('date time reason doctor status');

    const formattedHistory = [];

    prescriptions.forEach(p => {
        const medicineNames = p.medicines.map(medItem => {
            if (medItem.medicine && medItem.medicine.brandName) {
                return medItem.medicine.brandName;
            } else if (medItem.medicine && medItem.medicine.genericName) {
                return medItem.medicine.genericName;
            } else if (medItem.name) {
                return medItem.name; // Use the name field from the prescription's medicine sub-document
            } else {
                return 'Unknown';
            }
        }).join(', ');
        formattedHistory.push({
            date: p.issueDate,
            type: 'Prescription',
            // details: `Prescribed by Dr. ${p.doctor ? p.doctor.user.name : 'N/A'}. Notes: ${p.notes || 'None'}. Medicines: ${medicineNames}`,
            doctorName: p.doctor ? p.doctor.user.name : 'N/A',
            notes: p.notes || 'None',
            medicines: medicineNames,
            prescriptionId: p._id,
        });
    });

    appointments.forEach(a => {
        formattedHistory.push({
            date: new Date(`${a.date.toISOString().split('T')[0]}T${a.time}:00`),
            type: 'Appointment',
            // details: `Appointment with Dr. ${a.doctor ? a.doctor.user.name : 'N/A'}. Reason: ${a.reason || 'N/A'}. Status: ${a.status}`,
            doctorName: a.doctor ? a.doctor.user.name : 'N/A',
            reason: a.reason || 'N/A',
            status: a.status,
            appointmentId: a._id,
        });
    });

    formattedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(formattedHistory);
});

export { getPatients, getPatientProfile, updatePatientProfile, createPatientProfile, deletePatientProfile, getPatientDashboardStats, updateRewardPoints, getUpcomingAppointments, getPatientById, getPatientHistory };
