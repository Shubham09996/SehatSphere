import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import HealthRecord from '../models/HealthRecord.js';
import Doctor from '../models/Doctor.js'; // Import Doctor model

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

// @desc    Get patient profile
// @route   GET /api/patients/profile/:id
// @access  Private/Patient or Admin
const getPatientProfile = asyncHandler(async (req, res) => {
  let patient;
  const idOrPatientId = req.params.idOrPatientId || req.params.userId; // Get the ID from route parameters

  if (idOrPatientId && idOrPatientId.startsWith('PID-')) {
    // If it starts with 'PID-', assume it's a patientId string
    patient = await Patient.findOne({ patientId: idOrPatientId }).populate('user', 'name email profilePicture phoneNumber isVerified');
  } else if (idOrPatientId) {
    // Check if it's a valid MongoDB ObjectId (for _id) or a userId
    if (idOrPatientId.match(/^[0-9a-fA-F]{24}$/)) {
      // Try to find by _id
      patient = await Patient.findById(idOrPatientId).populate('user', 'name email profilePicture phoneNumber isVerified');
    }
    // If not found by _id, or if it's not a valid ObjectId, try to find by user ID
    if (!patient) {
      patient = await Patient.findOne({ user: idOrPatientId }).populate('user', 'name email profilePicture phoneNumber isVerified');
    }
  } else {
    // Fallback to finding patient by logged in user's ID if no specific ID is provided in route
    patient = await Patient.findOne({ user: req.user._id }).populate('user', 'name email profilePicture phoneNumber isVerified');
  }

  if (patient) {
    // Allow patient to view their own profile, or admin/doctor to view any patient profile
    // Also, if fetching by userId, ensure authorization
    if (
      req.user.role !== 'Admin' &&
      req.user.role !== 'Doctor' &&
      patient.user._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to view this patient profile');
    }

    // Calculate Age
    const dob = new Date(patient.dob);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    // Fetch Health Records for Vitals, Allergies, Chronic Conditions
    const healthRecords = await HealthRecord.find({ patient: patient._id }).sort({ date: -1 });

    const latestVitals = healthRecords.filter(record => record.recordType === 'Vital');
    // const allergies = healthRecords.filter(record => record.recordType === 'Allergy').map(record => record.title);
    // const chronicConditions = healthRecords.filter(record => record.recordType === 'Other' && record.title.includes('Chronic')).map(record => record.title); // Assuming 'Other' type for chronic conditions with specific title

    // For now, let's pick dummy vitals or the latest if available
    const bloodPressure = latestVitals.find(v => v.title === 'Blood Pressure') || { details: { value: '120/80', status: 'Normal' } };
    const bloodSugar = latestVitals.find(v => v.title === 'Blood Sugar') || { details: { value: '90 mg/dL', status: 'Normal' } };
    const bmi = latestVitals.find(v => v.title === 'BMI') || { details: { value: '22.5', status: 'Healthy' } };
    const lastCheckedVitals = latestVitals.length > 0 ? latestVitals[0].date : new Date();

    // Fetch Recent Activity (Appointments, Prescriptions, Health Records)
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
            type: rec.recordType === 'Lab Report' ? 'LabReport' : (rec.recordType === 'Allergy' ? 'Allergy' : 'Other'), // Map to frontend icons
            title: rec.title,
            date: rec.date,
        }))
    ].sort((a, b) => b.date - a.date).slice(0, 5); // Get top 5 most recent activities

    // Quick Stats counts
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

    res.json({
      personalInfo: {
          name: patient.user.name,
          pfp: patient.user.profilePicture,
          patientId: patient.patientId,
          age,
          bloodGroup: patient.bloodGroup,
          emergencyContact: patient.emergencyContact,
          isVerified: patient.user.isVerified,
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
          allergies: patient.allergies, // Use allergies from Patient model
          chronicConditions: patient.chronicConditions, // Use chronicConditions from Patient model
      },
      // other patient specific details if needed separately
      gender: patient.gender,
      isPremium: patient.isPremium,
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

export { getPatients, getPatientProfile, updatePatientProfile, createPatientProfile, deletePatientProfile, getPatientDashboardStats, updateRewardPoints, getUpcomingAppointments };
